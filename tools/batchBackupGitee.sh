#!/bin/bash

# 配置参数
ENTERPRISE_NAME="enterprises_name"  # 企业名称
ACCESS_TOKEN="access_token"        # 个人访问令牌
BACKUP_ORG_NAME="back_org_name" # 备份组织名称
BACKUP_PREFIX="https://gitee.com/${BACKUP_ORG_NAME}" # 备份仓库的前缀
BACKUP_DIR="E:/backup/tmp"     # 备份目录路径
REPOS_FILE="${BACKUP_DIR}/repos.json"  # 仓库列表信息输出文件名
PER_PAGE=100                        # 每页数量（最大100）

# 创建备份目录
mkdir -p "$BACKUP_DIR" || { echo "无法创建备份目录: $BACKUP_DIR"; exit 1;}
cd "$BACKUP_DIR" || exit 1

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
WHITE='\033[0;37m'
NC='\033[0m'
# -e 选项允许echo解释字符串中的转义序列。\033是转义字符的八进制表示，[开始控制序列，31m, 32m, 33m, 44m等是指定颜色的代码，0m结束颜色设置。
echo -e "${GREEN}绿色-表示成功备份到远程仓库${NC}"
echo -e "${YELLOW}黄色-表示当前远程仓库和备份远程仓库地址相同，无需备份${NC}"
echo -e "${RED}红色-备份失败${NC}"

# 日志文件路径
LOG_FILE="${BACKUP_DIR}/backup.log"
# 记录日志函数
log() {
  echo -e "[$(date +'%Y-%m-%d %T')] $1" | tee -a "$LOG_FILE"
}
logError() { log "${RED}$1${NC}"; }
logWarning() { log "${YELLOW}$1${NC}"; }
logSuccess() { log "${GREEN}$1${NC}"; }

# 检查依赖
check_dependency() {
  for cmd in curl jq git; do
    if ! command -v $cmd &> /dev/null; then
      logError "错误: $cmd 未安装，请先安装！"
      exit 1
    fi
  done
}

# API调用函数，返回内容到标准输出
call_api() {
  local url=$1
  local method=${2:-GET}
  local data=${3:-""}
  local response=$(curl -s -w "\n%{http_code}" -X "$method" \
    -H "Authorization: token $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$data" \
    "$url")
  
  local http_code=$(echo "$response" | tail -n1)
  local content=$(echo "$response" | head -n -1)
  
  # echo返回数据，return返回状态码(0成功，1失败)
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo "$content"
    return 0
  else
    logError "API请求失败: $url (HTTP $http_code)"
    echo "$content"
    return 1
  fi
}

# 获取所有仓库列表
fetch_repos() {
  local page=1
  local all_repos="[]"
  log "开始获取仓库列表..."

  while : ; do
    local api_url="https://gitee.com/api/v5/enterprises/$ENTERPRISE_NAME/repos?page=${page}&per_page=${PER_PAGE}&type=all"
    local content=$(call_api "$api_url")

    # 使用jq提取需要的字段
    content=$(echo "$content" | jq '[.[] | {id, url, path, name, description, ssh_url, html_url}
      | select(.name | test("-删除$|-测试仓库$") | not)]')
    # 过滤掉名称以-删除结尾的仓库
    # content=$(echo "$content" | jq '[.[] | select(.name | endswith("-删除") | not)]')
    # 过滤掉名称以"-删除"或"-测试仓库"结尾的仓库
    # content=$(echo "$content" | jq '[.[] | select(.name | test("-删除$|-测试仓库$") | not)]')
    
    # 判断响应数据是否为合法json数组
    local count=$(echo "$content" | jq 'if type=="array" then length else 0 end')
    if [ "$count" -eq 0 ]; then
      break
    fi
    
    #  合并数组
    all_repos=$(echo "$all_repos" "$content" | jq -s 'add')
    log "已获取第 ${page} 页，共 ${count} 个仓库"
    ((page++))
  done
  
  echo "$all_repos" > "$REPOS_FILE"
  log "仓库列表获取完成，共 $((page-1)) 页"
}

# 检查备份组织中是否已存在仓库
check_backup_repo_exists() {
  local repo_name=$1
  local api_url="https://gitee.com/api/v5/orgs/$BACKUP_ORG_NAME/repos?page=1&per_page=${PER_PAGE}"
  local org_repos=$(call_api "$api_url")
  # 判断是否存在同名仓库
  echo "$org_repos" | jq -e --arg name "$repo_name" 'map(.name) | index($name)' &>/dev/null
}

# 在备份组织中创建私有仓库
create_backup_repo() {
  local repo_name=$1
  local description=${2:-"备份仓库"}
  local data=$(jq -n --arg name "$repo_name" --arg desc "$description" \
    '{name: $name, private: true, description: $desc}')
  local api_url="https://gitee.com/api/v5/orgs/$BACKUP_ORG_NAME/repos"
  local response=$(call_api "$api_url" "POST" "$data")
  local ret=$?
  # 根据HTTP返回码决定是否创建成功
  if [ $ret -eq 0 ]; then
    log "仓库 ${BACKUP_PREFIX}/${repo_name} 创建成功！"
    return 0
  else
    logError "仓库 ${BACKUP_PREFIX}/${repo_name} 创建失败！响应：$response"
    return $ret
  fi
}

# 备份所有仓库（克隆和推送）
backup_repos() {
  log "开始备份仓库..."
  # 使用jq提取SSH克隆地址
  jq -r '.[].ssh_url' "$REPOS_FILE" | while read -r repo_url; do
    local http_url=$(echo "$repo_url" | sed 's/git@gitee.com:/https:\/\/gitee.com\//')
    local repo_name=$(basename "$http_url" .git)
    local repo_dir="${BACKUP_DIR}/${repo_name}"

    # 检查仓库是否已存在
    if check_backup_repo_exists "$repo_name"; then
      logWarning "备份组织中已存在仓库：${repo_name}，跳过创建"
    else
      log "备份组织中不存在仓库：${repo_name}，准备创建"
      # 获取仓库描述
      local description=$(jq -r --arg ssh_url "$(echo $repo_url)" '.[] | select(.ssh_url == $ssh_url) | .description' "$REPOS_FILE")
      # 创建私有仓库
      create_backup_repo "$repo_name" "$description"
      if [ $? -ne 0 ]; then
        logError "创建仓库 ${BACKUP_PREFIX}/${repo_name} 失败，备份失败"
        continue
      fi
    fi

    log "正在克隆 ${http_url}..."
    
    if git clone --mirror "$http_url" "$repo_dir" &>> "$LOG_FILE"; then
      log "成功克隆 ${http_url}"
    else
      logError "克隆失败 ${http_url}"
      continue
    fi
    
    # 推送到备份仓库
    local backup_repo_url="${BACKUP_PREFIX}/${repo_name}.git"
    log "开始备份仓库 ${backup_repo_url}"
    cd "$repo_dir" || continue
    if git push --mirror "$backup_repo_url" &>> "$LOG_FILE"; then
      logSuccess "备份成功 ${backup_repo_url}"
    else
      logError "备份失败 ${backup_repo_url}"
    fi
    cd "$BACKUP_DIR" || exit 1
    # 清理克隆目录
    rm -rf "$repo_dir"
  done
  
  log "备份完成！备份目录：${BACKUP_DIR}"
}

# 主函数
main() {
  check_dependency
  fetch_repos
  backup_repos
}
# 执行主函数
# main

# 获取企业仓库列表
# fetch_repos

# 备份repos.json文件中的仓库列表到指定组织中
# backup_repos

# if check_backup_repo_exists "town-mp-wechat"; then
#   echo "已存在该仓库"
# else
#   echo "不存在该仓库"
# fi


#!/bin/sh
 
# 旧仓库地址前缀
export old_repo_url_prefix="https://e.coding.net/topeak/digital-village-2.0"
# 新仓库地址前缀
export new_repo_url_prefix="https://gitee.com/HuBeiTopeak_1"

# -e 选项允许echo解释字符串中的转义序列。\033是转义字符的八进制表示，[开始控制序列，31m, 32m, 33m, 44m等是指定颜色的代码，0m结束颜色设置。
# 31m 是红色 32m是绿色 33m是黄色 44m是蓝色背景 37m是白色文本，当有背景颜色时使用。
echo -e "\033[32m绿色-表示仓库地址已修改\033[0m"
echo -e "\033[33m黄色-表示仓库旧地址未匹配前缀(检查修改脚本文件中仓库旧地址前缀)\033[0m"
echo -e "\033[31m红色-表示新仓库地址不存在(检查修改脚本文件中仓库新地址前缀)\033[0m"
ls -l -d */ | awk '{print $9}' | xargs -I % bash -c '
  cd % && if [ -d ".git" ]; then 
    url=$(git remote get-url origin)
    newOriginUrl=${url/$old_repo_url_prefix/$new_repo_url_prefix}
    if [ "$newOriginUrl" != "$url" ]; then
      if $(git ls-remote --exit-code $newOriginUrl > /dev/null 2>&1); then
        echo -e "\033[32m$url修改为$newOriginUrl\033[0m"
        git remote set-url origin $newOriginUrl
      else
        echo -e "\033[31m$newOriginUrl: 新仓库不存在\033[0m"
      fi 
    else
      if [[ $url == "$new_repo_url_prefix"* ]]; then
        echo "$url: 仓库地址无需修改"
      else
        echo -e "\033[33m$url不包含前缀$old_repo_url_prefix,请检查修改脚本旧仓库前缀地址\033[0m"
      fi
    fi;
  fi;'

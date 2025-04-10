#!/bin/sh
 
# 批量备份当前远程仓库

# 当前远程仓库地址前缀
export remote_repo_url_prefix="https://gitee.com/xxx"
# 当前远程别名
export remote_name="origin"
# 备份远程仓库地址前缀
export backup_remote_repo_url_prefix="https://gitee.com/east-xxx"
# 备份远程别名
export backup_remote_name="east-xxx"

# -e 选项允许echo解释字符串中的转义序列。\033是转义字符的八进制表示，[开始控制序列，31m, 32m, 33m, 44m等是指定颜色的代码，0m结束颜色设置。
# 31m 是红色 32m是绿色 33m是黄色 44m是蓝色背景 37m是白色文本，当有背景颜色时使用。
echo -e "\033[32m绿色-表示已成功备份到远程仓库\033[0m"
echo -e "\033[33m黄色-表示当前远程仓库和备份远程仓库地址相同\033[0m"
echo -e "\033[31m红色-表示备份远程仓库地址不存在(需手动创建一个私有同名新仓库)\033[0m"
ls -l -d */ | awk '{print $9}' | xargs -I % bash -c '
  cd % && if [ -d ".git" ]; then 
    remoteUrl=$(git remote get-url $remote_name)
    backupRemoteUrl=${remoteUrl/$remote_repo_url_prefix/$backup_remote_repo_url_prefix}

    if [ "$remoteUrl" != "$backupRemoteUrl" ]; then
      if $(git ls-remote $backupRemoteUrl > /dev/null 2>&1); then
        if $(! git remote | grep -q "^$backup_remote_name$"); then
          git remote add $backup_remote_name $backupRemoteUrl
          git push $backup_remote_name --mirror
          echo -e "\033[32m$remoteUrl已成功备份$backupRemoteUrl\033[0m"
        else
          git push $backup_remote_name --mirror
          echo -e "\033[32m$remoteUrl已成功备份$backupRemoteUrl\033[0m"
        fi
      else
        echo -e "\033[31m$backupRemoteUrl: 备份仓库地址不存在，需先手动创建\033[0m"
      fi 
    else
      echo -e "\033[33m当前远程仓库和备份远程仓库地址相同\033[0m"
    fi
  fi;'
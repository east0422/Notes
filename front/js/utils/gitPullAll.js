// git remote prune origin // 清理远程仓库已删除分支在本地仓库残留的追踪记录

// current_local_branch=$(git branch | awk '/\*/ { print $2; }')

// current_dir=$(pwd) // 当前路径
// repo_dir=$(git rev-parse --show-toplevel) // 获取本地仓库的绝对路径
// cd $repo_dir

all_remote_branches=$(git branch -r | sed 's/origin\///g' | sed 's/HEAD -> master//g')
for remote_branch in ${all_remote_branches[*]}; do
  git checkout $remote_branch
  git pull
done

// git checkout $current_local_branch
// cd $current_dir
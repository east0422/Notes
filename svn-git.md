# 版本控制工具
   1. 最常用的版本控制工具有Source Tree(git)和CornerStone(svn)。
   2. 集中式代码管理(svn)的核心是服务器，所有开发者在开始新一天的工作之前必须从服务器获取代码，然后开发，最后解决冲突，提交。
      所有的版本信息都放在服务器上。如果脱离了服务器，开发者基本可以说是无法工作的。
   3. 分布式版本控制系统(git)，在git中并不存在主库这样的概念，每个库都可以独立使用，任何两个库之间的不一致都可以进行合并。

# svn常用命令
### 常用名词
	* Repository 代码仓库，保存代码的仓库。
	* Server 服务器，保存所有版本的代码仓库。
	* Client 客户端，只保存当前用户的代码仓库。
	* 用户名&密码 访问代码仓库需要使用自己的"用户名和密码"，从而区分不同人对代码做的修改。

### 操作
   1. checkout 将服务器上最新代码仓库下载到本地，通常只需要做一次。
      * svn co http://xxx/svn/xxxx --username=username --password=pwd。
      * checkout(co)之后，命令行会记录用户名和密码，后续操作不用再指定。 
   2. update 从服务器上将其他人所做的修改下载到本地，通常上班后做的第一件事。
   3. commit 将工作提交到服务器，通常下班前做的事。

### 代码管理
   1. 查看本地代码库状态 svn st。
   2. 查看svn日志 svn log。
   3. 创建文件 touch(或open) filename。
   4. 将文件添加到本地版本库中 svn add filename。
   5. 将文件提交到服务器的版本库中 svn ci -m '备注信息'。
   6. 删除文件 svn rm filename。
   7. 撤销文件修改 svn revert filename。
   8. 恢复到之前的某个版本 svn update -r 5。
   9. 冲突解决 (p)postpone 对比；(mc)mine-conflict 使用我的；(tc) theirs-conflict 使用对方的。


# git常用命令
### 仓库
   1. 远程仓库：保存我们代码的服务器。
   2. 本地仓库：连接本地代码跟远程代码的枢纽，不能联网时本地代码可先提交至该处。
   3. 缓存区：提交代码、解决冲突的中转站。
   4. 工作区间：我们创建的工程目录，可直观显示。
   ![images/git_dir.png](../images/git_dir.png "git仓库") 
   
### 目录结构
   1. config：该文件主要记录针对该项目的一些配置信息，例如是否以bare方式初始化、remote的信息等，
      通过git remote add命令增加的远程分支的信息就保存在这里。
   2. objects文件夹：该文件夹主要包含git对象。Git中的文件和一些操作都会以git对象来保存，git对象分为BLOB、tree和commit三种类型，
      例如git commit便是git中的commit对象，而各个版本之间是通过版本树来组织的，比如当前的HEAD会指向某个commit对象，而该commit对象又会指向几个BLOB对象或者tree对象。objects文件夹中会包含很多的子文件夹，其中Git对象保存在以其sha-1值的前两位为子文件夹、后38位为文件名的文件中；除此以外，Git为了节省存储对象所占用的磁盘空间，会定期对Git对象进行压缩和打包，其中pack文件夹用于存储打包压缩的对象，而info文件夹用于从打包的文件中查找git对象。
   3. HEAD文件：该文件指明了git branch(即当前分支)的结果，比如当前分支是master，则该文件就会指向master，但是并不是存储一个master字符
      串，而是分支在refs中的表示，例如ref: refs/heads/master。
   4. index文件：该文件保存了暂存区域的信息。该文件某种程度就是缓冲区(staging area)，内容包括它指向的文件的时间戳、文件名、sha1值等。
   5. Refs文件夹：该文件夹存储指向数据(分支)的提交对象的指针。其中heads文件夹存储本地每一个分支最近一次commit的sha-1值(也就是commit对象
      的sha-1值)，每个分支一个文件；remotes文件夹则记录你最后一次和每一个远程仓库的通信，Git会把你最后一次推送到这个remote的每个分支的值都记录在这个文件夹中；tag文件夹则是分支的别名。
   6. hooks文件夹：主要定义了客户端或服务端钩子脚本，这些脚本主要用于在特定的命令和操作之前或者之后进行特定的处理，比如：当你把本地仓库
      push到服务器的远程仓库时，可以在服务器仓库的hooks文件夹下定义post_update脚本，在该脚本中可以通过脚本代码将最新的代码部署到服务器的web服务器上，从而将版本控制和代码发布无缝连接起来。
   7. description文件：仅供GitWeb程序使用，不需要过多的关心。
   8. logs文件夹：记录了本地仓库和远程仓库的每一个分支的提交记录，即所有的commit对象(包括时间、作者等信息)都会被记录在这个文件夹中，因此
      这个文件夹中的内容是我们查看最频繁的，不管是git log命令还是tortoiseGit的show log，都需要从该文件夹中获取提交日志。
   9. info文件夹：保存了一份不希望在.gitignore文件中管理的忽略模式的全局可执行文件，基本也用不上。
   10. COMMIT_EDITMSG文件：则记录了最后一次提交时的注释信息。

### 常用
   * 翻看下页，按'空格'。
   * 翻看上页，按'CTRL+B'。
   * 要搜索相关文字，按'/'然后输入'相关文字'。

### 用户配置信息
   * 配置当前仓库用户名 git config user.name username。
   * 配置当前仓库邮箱 git config user.email username@gmail.com。
   * 若需要配置全局的，加上--global即可，全局会保存在用户目录下的.gitconfig文件中。
   * 查看当前所有配置 git config -l(或--list)。

### 代码管理
   1. 创建代码仓库 git init。
   2. 创建代码 touch(或open) filename。
   3. 查看当前代码库状态 git status。
   4. 将文件添加到代码库 git add filename(或使用.将当前文件夹下所有新建和修改的文件都添加到代码库)。
   5. 提交修改到代码库 git commit -m '修改注释说明'。
   6. 查看所有版本库日志 git log；查看指定文件版本库日志 git log filename。
   7. 回到当前版本，放弃所有没有提交的修改 git reset --hard HEAD。
   8. 回到上一个版本 git reset --hard HEAD^。
   9. 回到之前第三个修订版本 git reset --hard HEAD~3。
   10. 回到指定版本号的版本 git reset --hard 89f88fd。
   11. 查看分支引用记录 git reflog。

### 底层命令
   1. git hash-object：获取指定文件的key，如果带上-w选项，则会将该对象的value进行存储。
   2. git cat-file：用于查看Git数据库中数据。
   3. git update-index --add --cacheinfo 100644 key filename ：将指定的object加入索引库，-—cacheinfo则指出该文件的文件类型，100644表
      示普通文件，与之相关的还有可执行文件等；还需指定文件名，表明要把哪个文件的哪个版本加入索引库。该命令执行完成后，.git目录下多了index文件，并且在以后每次update-index命令执行之后，该index文件的内容都会发生变化。
   4. git cat-file –p/-t key: 获取指定key(commitid)的对象信息，-p打印详细信息，-t打印对象的类型。
   5. git write-tree：根据索引库中的信息创建tree对象。
   6. git commit-tree key –p key2：根据tree对象创建commit对象，-p表示前继commit对象。

### 常用命令
   1. git pull 等效于先执行git fetch紧接着执行git merge origin/当前分支名。使用git pull时可使用--rebase参数，即git pull --rebase表示
      把你的本地当前分支里的每个提交取消掉，并且把它们临时保存为补丁(这些补丁放到.git/rebase目录中)，然后把本地当前分支更新为最新的origin分支，最后把保存的这些补丁应用到本地当前分支上。
   2. git reset 把当前分支指向另一个位置，并且相应的变动工作目录和索引，有三种常用模式：
      * soft：只改变提交点，暂存区和工作目录的内容都不改变。
      * mixed(默认)：改变提交点，同时改变暂存区的内容。这是默认的回滚方式。
      * hard：暂存区、工作目录的内容都会被修改到与提交点完全一致的状态。
   3. git diff 查看做了哪些修改，有五种常用模式：
      * git diff commit1 commit2：比较commit1和commit2两个提交点的差异修改。
      * git diff branchA：比较当前分支和branchA分支的差异修改。
      * git diff HEAD：在当前分支内部进行比较，比较最新提交点与当前工作目录。
      * git diff --cached：在当前分支内部进行比较，比较最新提交点与暂存区的内容。
      * git diff：在当前分支内部进行比较，比较暂存区与当前工作目录。
   4. git add 将文件添加到缓存区。其对应两个底部命令git hash-object和git update-index。首先，通过hash-object命令将需要暂存的文件进行
      key-value化转换成Git对象，并进行存储，拿到这些文件的key；然后，通过update-index命令将这些对象加入到索引库进行暂存，这样便完成了Git文件的暂存操作。
   5. git commit 将缓存区添加到本地仓库。
   6. git rebase branchA 原理是回到两个分支最近的共同祖先，根据当前分支后续的历次提交对象，生成一系列文件补丁，然后以基底分支branchA最
      后一个提交对象为新的出发点，逐个应用之前准备好的补丁文件，最后会生成一个新的合并提交对象，从而改写当前分支的提交历史，使它成为 branchA分支的直接下游。在rebase出现冲突时git会停止rebase并会让你去解决冲突，在解决完冲突后用git add命令去更新这些内容的索引，然后无需执行git-commit，只要执行git rebase –continue，这样git会继续应用余下的补丁。如果要舍弃本次衍合，只需git rebase --abort即可。
   7. git stash 用来暂存当前正在进行的工作，将工作区还没加入索引库的内容压入本地的git栈中，在需要应用的时候再弹出来。比如想pull最新代
      码，又不想加新commit；或者为了修复一个紧急的bug，先stash，使返回到自己上一个commit，改完bug之后再stash pop，继续原来的工作。Git stash可以让本地仓库返回到上一个提交状态，而本地的还未提交的内容则被压入git栈。git stash list命令可以将当前的git栈信息打印出来，你只需将找到对应的版本号，例如使用git stash apply stash@{1}就可以将你指定版本号为stash@{1}的暂存内容取出来，当你将所有的栈都应用回来的时候，可以使用git stash clear来将栈清空。
      

### 迁移仓库到新仓库并且保留提交记录(有大小限制)
   1. github和gitlab等都有导入仓库，直接操作即可。
   2. 先下载到本地，再上传到新仓库。
      1. 从原地址克隆裸版本库`git clone --bare https://192.168.10.XX/git_repo/project_name.git`
      2. 进入project_name.git目录`cd project_name.git`
      3. 以镜像推送到新服务器(会覆盖new_project_name仓库中的现有内容)`git push --mirror git@192.168.20.XX/path/to/path/new_project_name.git`
   3. 将本地仓库迁移
      
      ```
      cd existing_repo
      // 更改origin新地址
      git remote set-url origin https://XXX/git_repo/test.git
      git push -u origin --all -f(远程上若有文件就强推)
      git push -u origin --tags -f(远程上若有文件就强推)
      ```
   4. 若仓库比较大则需要安装git-lfs，大文件常和3一起配合使用
      
      ```
      // 安装
      brew install git-lfs
      // 为每个账号只需要运行一次
      git lfs install
      // 使用Git LFS管理后缀psd文件
      git lfs track "*.psd"
      // .gitattributes指定lfs跟踪文件，将其加入版本控制中
      git add .gitattributes
      // 提交.gitattributes
      git commit -m 'something'
      
      // 列出最占空间的类型
      // git lfs migrate info
      // 将mp3和psd文件转换为LFS
      // git lfs migrate import --include="*.mp3,*.psd"
      ```
   5. 使用git lfs必须在提前在前面的commit上使用在后面的commit上才有用，如果文件不是太重要，可以删除
      
      ```
      git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch videos/temp.mp4' --prune-empty --tag-name-filter cat -- --all
      ```









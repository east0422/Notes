# 版本控制工具
1. 最常用的版本控制工具有Source Tree(git)和CornerStone(svn)。
2. 集中式代码管理(svn)的核心是服务器，所有开发者在开始新一天的工作之前必须从服务器获取代码，然后开发，最后解决冲突，提交。所有的版本信息都放在服务器上。如果脱离了服务器，开发者基本可以说是无法工作的。
3. 分布式版本控制系统(git)，在git中并不存在主库这样的概念，每个库都可以独立使用，任何两个库之间的不一致都可以进行合并。


# svn常用命令
#### 常用名词
* Repository 代码仓库，保存代码的仓库。
* Server 服务器，保存所有版本的代码仓库。
* Client 客户端，只保存当前用户的代码仓库。
* 用户名&密码 访问代码仓库需要使用自己的"用户名和密码"，从而区分不同人对代码做的修改。

#### 操作
1. checkout 将服务器上最新代码仓库下载到本地，通常只需要做一次。
	* svn co http://xxx/svn/xxxx --username=username --password=pwd。
	* checkout(co)之后，命令行会记录用户名和密码，后续操作不用再指定。 
2. update 从服务器上将其他人所做的修改下载到本地，通常上班后做的第一件事。
3. commit 将工作提交到服务器，通常下班前做的事。

#### 代码管理
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
#### 常用
* 翻看下页，按'空格'。
* 翻看上页，按'CTRL+B'。
* 要搜索相关文字，按'/'然后输入'相关文字'。

#### 用户配置信息
* 配置当前仓库用户名 git config user.name username。
* 配置当前仓库邮箱 git config user.email username@gmail.com。
* 若需要配置全局的，加上--global即可，全局会保存在用户目录下的.gitconfig文件中。
* 查看当前所有配置 git config -l(或--list)。

#### 代码管理
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









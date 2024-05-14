# svn

### 常用名词
  - Repository 代码仓库，保存代码的仓库。
  - Server 服务器，保存所有版本的代码仓库。
  - Client 客户端，只保存当前用户的代码仓库。
  - 用户名&密码 访问代码仓库需要使用自己的"用户名和密码"，从而区分不同人对代码做的修改。

### 常用操作
  - checkout(co) 将服务器上最新代码仓库下载到本地，通常只需要做一次。svn co http://xxx/svn/xxxx --username=username --password=pwd。之后命令行会记录用户名和密码，后续操作不用再指定。 
  - update(up) 从服务器上将其他人所做的修改下载到本地，通常上班后做的第一件事。
  - commit(ci) 将工作提交到服务器，通常下班前做的事。
  - add(a) 添加目录或文件到版本库。
  - delete(del/rm/remove) 从版本库中删除目录或文件。
  - diff(di) 查看本地修改与版本库之间的差异。
  - revert 恢复本地修改到未改变的状态。
  - status(st) 查看目录或文件的工作状态，如是否已加入版本库、是否有冲突等。
  - log 查看版本库的修改日志，可以结合日期和其他参数来查看特定范围的日志。
  - info 查看文件的详细信息，如版本历史等。
  - merge 将两个源的差异应用至工作副本。
  - touch(或open) 创建文件。
  - 冲突解决(p)postpone 对比；(mc)mine-conflict使用我的；(tc)theirs-conflict使用对方的。
  
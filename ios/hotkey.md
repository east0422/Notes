# mac常用技能

## 终端控制隐藏文件显示与否
1. 终端显示隐藏文件: 
		==`defaults write com.apple.finder AppleShowAllFiles -bool true`==
2. 终端隐藏隐藏文件:    ==`defaults write com.apple.finder AppleShowAllFiles -bool false`==
3. 输入指令后一定要重新启动Finder，快捷键==Command+Option+ESC==调出重启窗口选择Finder重新启动

## mac终端swift
1. swift/xcrun swift。
2. NSString是一个类，在Foundation中，String是结构体。
  
## 常用终端命令
1. 拷贝文件: ==cp 参数(R对目录进行递归操作) 源文件 目标文件==
2. 删除文件: ==rm 参数(-rf递归强制) 文件==
3. 移动文件: ==mv 源文件 目标文件==
4. 更改文件权限: ==chmod 参数 权限 文件==
5. 更改文件属主: ==chown 参数 用户:组 文件==
6. 运行脚本命令: ==sh 脚本文件名==
7. 查看命令详细帮助: ==man 命令名==
8. 链接文件: ==ls -s file1 file2==
9. 查找文件: ==find . -name “*.c” -print==
10. 比较文件: ==diff file1 file2==
11. 显示当前所有设置过的环境变量: ==env==

## xcode中常用快捷键
1. 新建xcode项目: ==shift + comand + n==
2. 新建分组: ==option + command + n==
3. 新建文件: ==command + n==
4. 搜索: ==shift + command + o ／command + f==
5. 新建tab: ==command + t==
6. 关闭tab: ==command + w==
7. 隐藏显示导航窗口: ==comand + 0==
8. 显示切换导航窗口中的几个内容: ==comand + 1 ……n==
9. 隐藏显示工具窗口: ==option + command + 0==
10. 控制工具窗口: ==option + command + 1……n==
11. .m/.h/上一个/下一个文件切换: ==control + command + 上/下/左/右==
12. 选中上/下/左/右所有: ==shift + command + 上/下/左/右==
13. 上下下选中行，左右选中单词: ==shift+option+上/下/左/右==
14. 查看定义: ==control + command + j==
15. 折叠/展开代码块: ==option + command + 左/右==
16. 编译运行／只编译不运行/停止: ==command + r/b/.==

## 自定义代码片段库
1. 选中代码块拖到xcode右侧面板Utilities下面的代码片段库｛｝中。
2. 双击刚拖进去的代码片段库，点击Edit进行编辑。
3. Title为所取别名，将<# 和 #>分别放到下面代码片段库中需要重新命名的变量名前后如name改为==<# name #>==方便重新命名变量名。



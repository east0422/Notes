husky v9 cannot execute binary file

简短描述：win10下在Visual Studio Code终端输入echo "npm run lint">.husky/pre-commit生成pre-commit钩子文件运行git commit -m 'xxx'时报错cannot execute binary file

经过各种方式不断尝试得出如下结论(Visual Studio Code下述简写为VSC)
1. 在VSC终端输入echo "npm run lint" > .husky/pre-commit生成钩子文件不可执行(error)。
2. 在VSC终端输入npx husky init(内部实际使用fs库)创建生成的.husky/pre-commit钩子文件然后再把内容修改为npm run lint可正常执行(success)。
3. 直接右键新建文件pre-commit然后输入内容npm run lint可正常执行(success)。
4. 使用cmd打开系统命令行切换到当前工程目录输入echo "npm run lint" > .husky/pre-commit生成钩子文件(内容多了引号)不可执行(error)。、
5. 使用cmd打开系统命令行切换到当前工程目录输入echo npm run lint > .husky/pre-commit生成钩子文件可正常执行(success)。
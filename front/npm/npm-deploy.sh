#!/bin/sh
echo "目录:$0,分支$1"
branch=$1
echo "删除原来构建的: rm -rf dist"
rm -rf dist
echo "切换分支:git checkout $branch"
git checkout $branch
echo "拉取最新代码: git pull"
git pull
echo "安装依赖包: npm install"
npm install
echo "打包构建: npm install"
npm run build


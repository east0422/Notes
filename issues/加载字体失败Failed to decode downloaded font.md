vue加载字体失败Failed to decode downloaded font

将点.路径修改为@ 路径
@font-face {
  font-family: 'font-name';
  src: url('./font-name.ttf');
}
修改为
@font-face {
  font-family: 'font-name';
  src: url('@/assets/font/AlimamaShuHeiTi.ttf');
}

@路径需要在vue配置文件中配置
  
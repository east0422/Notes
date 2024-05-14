input输入框账号密码自动填充

解决方法：
1、在账号密码框前面再增加一对账号密码并设置样式position:absolute,top:-100%使得自动填充最上面的输入框中并显示在可见区域外。
2、依据输入框内容是否有值设置type为text或password。
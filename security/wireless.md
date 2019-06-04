## 无线网络安全
sudo /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport en0 sniff 1 (en0是所使用网卡的名称，sniff表示模式，1是信道)。

### 为airport创建链接方便使用
1. cd /usr/local/bin。
2. sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport。
3. airport en0 sniff 1。

### 安装aircrack-ng
1. brew install aircrack-ng。
2. 使aircrack-ng可运行：
   * 创建链接：
   
	```
	cd /usr/local/bin
	sudo ln -s /usr/local/Cellar/aircrack-ng/1.1_2/bin/aircrack-ng
	sudo ln -s /usr/local/Cellar/aircrack-ng/1.1_2/sbin/aireplay-ng
```
   * 将 /usr/local/Cellar/aircrack-ng/1.1_2/bin和 /usr/local/Cellar/aircrack-ng/1.1_2/sbin加到~/.bash_profile的PATH中。




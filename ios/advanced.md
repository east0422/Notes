#### 事件响应者链
1. 响应者链表示一序列的响应者对象。事件被交由第一响应者对象处理，如果第一响应者不处理，事件被沿着响应者链向上传递，交给下一个响应者(nect responder)。
2. 通常来说，第一响应者是视图对象或其子类对象，当其被触摸后事件被交由它处理，如果它不处理，事件就会被传递给它的视图控制器对象(如果存在)，然后是它的父视图(superview)对象，以此类推，直到顶层视图。接下来会沿着顶层视图(top view)到窗口(UIWindow)对象再到程序(UIApplication)。如果整个过程都没有响应这个事件，该事件就被丢弃。
3. 一般情况下，在响应者链中只要有对象处理事件，事件就停止传递，但有时候可以在视图的响应方法中根据一些条件判断来决定是否需要继续传递事件。
4. 当触摸一个视图时，首先系统会捕捉此事件，并为此事件创建一个UIEvent对象，将此对象加入当前应用程序的事件队列中，然后由UIApplication对象从队列中一个一个取出来进行分发，首先分发给UIWindow对象，然后由UIWindow对象分发给触摸的视图对象，也就是第一响应者对象。

#### load与initialize方法
1. +(void)load：
	* 当类对象被引入项目时，runtime会向每一个类对象发送load消息。
	* load方法会在每一个类甚至分类被引入时仅调用一次，调用的顺序：父类优先于子类，子类优先于分类。
	* load方法不会被类自动继承。 
2. +(void)initialize：
	* 也是在第一次使用这个类的时候会调用这个方法。

#### NSTimer
1. 启动定时器的两种方法
  * 
```timerWithTimeInterval需要手动将timer加入到消息循环中：     NSTimer *timer = [NSTimer timerWithTimeInterval:2.0 target:self selector:       @selector(nextImage) userInfo:nil repeats:YES]; 
    NSRunLoop *loop = [NSRunLoop currentRunLoop];     [loop addTimer:timer forMode:NSDefaultRunLoopMode];     [timer fire]; //这个方法仅仅是提前执行timer要执行的方法
```
  * 
```scheduledTimerWithTimeInterval自动把timer加入到消息循环中，默认NSDefaultRunLoopMode：
    NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self          selector:@selector(nextImage) userInfo:nil repeats:YES]; 
```
  * 注意：如果当前线程run loop处UIEventTrackingRunLoopMode模式会不处理定时器事件。 

#### pch文件
1. pch文件也是一个头文件，里面的内容能被项目中的其他所有源文件共享和访问
2. 通常在pch文件中定义一些全局的宏及放置使用频繁的文件。
3. 在pch文件中添加下面的预处理指令，然后在项目中使用Log输出日志信息，在发布的时候会将NSLog语句移除(调试模式下才有定义DEBUG)。

	```
	#ifdef DEBUG
	#define Log(…) NSLog(__VA_ARGS__)
	#else
	#define Log(…)
	#endif
	```

#### 查找最合适的控件来处理事件
1. 判断自己是否能接收触摸事件(下述三种情况不接收触摸事件)
  * 不接收用户交互userInteractionEnabled = NO
  * 隐藏 hidden = YES
  * 透明度alpha在0到0.0.1之间
2. 判断触摸点是否在自己身上：
  pointInSide:withEvent返回NO代表不在自己身上，不再遍历子控件，也不接收触摸事件；返回YES代表在自己身上，继续遍历子控件。
3. 依次遍历子控件，重复前面两个步骤
4. 若没有符合条件的子控件，则自己就是最适合处理的控件
5. 找到最合适的控件后就调用touchesBegin/touchesMoved/touchesEnd方法
6. 注意：UIImageView的userInteractionEnabled为NO，所以UIImageView及其子类默认是不能响应触摸事件的。

#### 手势识别
1. 敲击手势UITapGestureRecognizer
2. 长按手势UILongPressGestureRecognizer
3. 轻扫手势UISwipeGestureRecognizer
4. 捏合手势UIPinchGestureRecognizer
  * scale缩放比例是累加的需在使用完后重置为1
5. 旋转手势UIRotationGestureRecognizer
  * rotation旋转角度是累加的需在使用完后重置为0
  * 若想和捏合手势同时使用，需设置其中一个手势的代理并实现 - (BOOL)gestureRecognizer:     shouldRecognizeSimultaneouslyWithGestureRecognizer: 返回YES即可,允许跟其他手势一起发生
6. 拖拽手势UIPanGestureRecognizer

#### Block块
1. self：在block中使用self有很大风险会造成循环引用，建议使用  __weak typeof(self) weakSelf = self。
2. 内存：

	``` 
	// block的内存默认在栈里面(系统自动管理)
	void (^test)() = ^{}
	// 若对block进行了Copy操作, block的内存会迁移到堆里面(需通过代码管理内存)。
	Block_copy(test);
	// 在不需要使用block的时候, 应该做1次release操作
	Block_release(test);
	[test release];
	```
3. 只要block中用到了对象的属性或函数，block就会持有该对象而不是该对象中的某个属性或函数。
4. 在ARC下常使用__weak打破循环，在MRC下使用__block。或者在block执行完后，将block置nil也可以打破循环引用。
5. 大部分GCD方法不会造成循环引用(如`dispatch_async(dispatch_get_main_queue(), ^{[self doSomething];})`)，因为self并没有对GCD的block进行持有，没有形成循环引用，在block中可以直接使用self。
6. MRC下一个变量如果不加__block是不能在block里面修改的，不过例外的是static的变量和全局变量不需要加__block就可以在block中修改。

#### SDWebImage
1. 默认缓存时长一周，SDImageCacheConfig中  static const NSInteger kDefaultCacheMaxCacheAge = 60 * 60 * 24 * 7; // 1 week 
2. 防止url对应图片重复下载：先看icon->再看内存缓存->沙盒缓存，如果已经存在于下载队列中就不再添加到里面。

#### ip查询
1. 获得本机真实ip地址：https://httpbin.org/ip, 通常是接入家庭的光猫ip地址得到的
2. 查询ip详细信息：http://ip.taobao.com/service/getIpInfo.php?ip=171.113.94.94，查询ip对应的物理位置

#### 规档和解档
1. 实现NSCoding协议
2. 实现-encodeWithCoder:(NSCoder *)encoder；和  - (instancetype)initWithCoder:(NSCoder *)aDecoder;
3. 使用NSKeyedArchiver和NSKeyedUnarchiver分别归/解档

#### JSON
1. 定义
  是一种轻量级的数据格式，一般用于数据交互。本质上是一个特殊格式的非NSString字符串。
2. JSON解析
  1. 第三方框架：JSONKit  > SBJson > TouchJSON (性能从左到右，越差)。
  2. 苹果原生NSJSONSerialization(性能最好)
    	* JSON数据 —> OC对象`+ (id)JSONObjectWithData:(NSData *)data options:(NSJSONReadingOptions)opt error:(NSError **)error`
     * OC对象 —> JSON数据`+ (NSData *)dataWithJSONObject:(id)obj options:(NSJSONWritingOptions)opt error:(NSError **)error`；

#### XML
1. 定义：和JSON一样，也是常用的一种用于交互的数据格式。
2. 文档声明：在XML文档的最前面，必须编写一个文档声明，用来声明XML文档的类型，如<?xml version=“1.0” encoding=“UTF-8” ?> // encoding属性说明文档的字符编码
3. XML解析
   1. 第三方框架
      * libxml2：纯C语言，默认包含在iOS SDK中，同时支持DOM和SAX方式解析。
      * GDataXML：DOM方式解析，由Google开发，基于libxml2。
   2. 苹果原生NSXMLParser(SAX方式解析，使用简单)
      * 使用步骤 `// 传入XML数据，创建解析器 NSXMLParser *parser = [[NSXMLParser alloc] initWithData:data]; // 设置代理，监听解析过程 parser.delegate = self;
        // 开始解析
        [parser parse];`
      * NSXMLParserDelegate
		`// 当扫描到文档的开始时调用(开始解析) 		 - (void)parserDidStartDocument:(NSXMLParser *)parser;  		// 当扫描到文档的结束时调用(解析完毕) 		 - (void)parserDidEndDocument:(NSXMLParser *)parser;  		// 当扫描到元素的开始时调用(attributeDict存放着元素的属性) 		- (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName attributes:(NSDictionary *)attributeDict 		// 当扫描到元素的结束时调用 		- (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI   qualifiedName:(NSString *)qName`

#### Cookie
1. 定义：由服务器端生成，发送给客户端，客户端将Cookie的Key/value保存到某个目录下的文本文件内。如果客户端支持Cookie，下次请求同一网站时就可以将Cookie直接发送给服务器。Cookie名称和值由服务器端开发自己定义。iOS程序中默认支持Cookie，不需任何处理，若服务器返回Cookie，会自动保存在沙盒的Library/Cookies目录中。
2. 读取Cookie内容   `// 读取所有cookie   NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
   for (NSHTTPCookie *cookie in cookies) {     if ([cookie.name isEqualToString:@“userName”]) {
    	self.username.text = cookie.value;   	  }     if ([cookie.name isEqualToString:@“userPassword”]){
      self.password.text = cookie.value;      }   	 }`
3. 删除Cookie   `NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];   for (NSHTTPCookie *cookie in cookies) {     [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie: cookie];   }`
4. 缺陷
    1. 会被附加在每个HTTP请求中，会增加额外的流量。
    2. 在HTTP请求中的Cookie是明文传递的，会有安全隐患，故建议使用HTTPS。
    3. Cookie的大小限制在4KB左右，不适合存储复杂的数据信息。

#### 资源打包
1. 图片被放到Image.xcassets里面：
	1. ios8及以上，打包的资源包中的图片会被放到Assets.car中，图片有被压缩。
	2. ios8以下，打包的资源包中的图片会被放在MainBundle中，图片没有被压缩。
2. 非Image.xcassets中：  图片会直接暴露在沙盒的资源包(MainBundle)中，不会压缩到Assets.car中。
3. 压缩到Assets.car中的图片只能通过图片名imageNamed:来加载，直接暴露在沙盒的资源包(MainBundle)中的图片可通过全路径imageWithContentsOfFile：来加载。

#### 内存泄漏分析
1. 内存泄漏：堆里不再使用的对象，没有被销毁，依然占据着内存。简单理解就是不再使用的对象没有被释放。
2. 内存溢出
	1. 内存不够用了。
	2. 数据长度比较小的数据类型存储了数据长度比较大的数据。
3. 静态内存分析
   1. 不运行程序，直接根据程序的语法结果进行分析Product -- > Analyze。
   2. 分析内存非常快，可以对整个项目的内存进行分析。但相对不太准确，若有提示可能出现内存泄漏则需要依据实际情况查看分析是否有内存泄漏。
4. 动态内存分析
   1. 需要运行程序，可对某一个操作来具体分析。可以查看做出了某个操作后(比如点击了某个按钮/显示了某个控制器)，内存是否有暴增的情况(突然变化)，比较准确。Product --> Profile -->Leaks --> 选择想要运行的项目 --> Record。
   2. 分析速度比较慢，需一步一步分析，分析过程中可能会有遗漏代码。
5. 减少内存泄漏
   1. 非ARC
      * Foundation对象(OC对象)：只要方法中包含了alloc\new\copy\mutableCopy\retain等关键字, 那么这些方法产生的对象, 就必须在不再使用的时候调用1次release或者1次autorelease
      * CoreFoundation对象(C对象)：只要函数中包含了create\new\copy\retain等关键字, 那么这些方法产生的对象,就必须在不再使用的时候调用1次CFRelease或者其他release函数
   2. ARC
      * Foundation对象(OC对象)：会自动管理OC对象，但不会自动管理C对象
      * CoreFoundation对象(C对象)：只要函数中包含了create\new\copy\retain等关键字, 那么这些方法产生的对象就必须在不再使用的时候调用1次CFRelease或者其他release函数

#### 闭源库
1. 定义：不公开源代码，是经过编译后的二进制文件，看不到具体实现
2. 静态库
	1. 存在形式：.a和.framework
	2. 使用：链接时，静态库会被完整的复制到可执行文件中，被多次使用就有多份冗余拷贝
3. 动态库
	1. 存在形式：.dylib和.framework
	2. 使用：链接时不复制，程序运行时由系统动态加载到内存，供程序调用，系统只加载一次，多个程序共用，节省内存。
4. 常用命令
	1. 检测库的类型及支持的CPU框架：`lipo -info 库名`
	2. 合并（也可以将Build Active Architecture Only的YES改为NO）`lipo -create Debug-iphoneos/libTools.a Debug-iphonesimulator/libTools.a -output libTools.a`

#### UIDynamic
1. 定义：是从iOS7开始引入的一种新技术，隶属于UIKit框架。可认为是一种物理引擎，能模拟和仿真现实生活中的物理现象。
2. 使用步骤：
	1. 创建一个物理仿真器，顺便指定仿真范围 UIDynamicAnimator *animator = [[UIDynamicAnimator alloc] initWithReferenceView:self.view];
   2. 创建相应的物理仿真行为，顺便添加物理仿真元素 UIGravityBehavior *gravity = [[UIGravityBehavior alloc] initWithItems:@[self.redView]];
   3. 将物理仿真行为添加到物理仿真器中，开始仿真 [animator addBehavior:gravity];
3. 三大概念
	1. 物理仿真元素(Dynamic Item)：谁要进行物理仿真。任何遵守了UIDynamicItem协议的对象，UIView和UICollectionViewLayoutAttributes类都已经默认遵守了UIDynamicItem协议。
	2. 物理仿真行为(Dynamic Behavior)：执行怎样的物理仿真效果，怎样的动画效果。下述所有的物理仿真行为都继承自UIDynamicBehavior，所有的UIDynamicBehavior都可以独立进行。
		* UIGravityBehavior：重力行为，给定重力方向、加速度、让物体朝着重力方向掉落。
		* UICollisionBehavior：碰撞行为，可以让物体之间实现碰撞效果，可通过添加边界(boundary)让物理碰撞局限在某个空间中。
		* UISnapBehavior：捕捉行为，可以让物体迅速冲到某个位置(捕捉位置)，捕捉到位置后会带有一定的震动，若要进行连续的捕捉行为，需要先把前面的捕捉行为从物理仿真器中移除。
		* UIPushBehavior: 推动行为
		* UIAttachmentBehavior: 附着行为
		* UIDynamicItemBehavior: 动力元素行为。
	3. 物理仿真器(Dynamic Animator)：让物理仿真元素执行具体的物理仿真行为。是UIDynamicAnimator类型的对象。初始化: - (instancetype)initWithReferenceView:(UIView *)view;其中view参数是一个参照视图，表示物理仿真的范围。注意：不是任何对象都能做物理仿真元素，不是任何对象都能进行物理仿真。

#### AutoLayout
1. 定义：是一种“自动布局”技术，专门用来布局UI界面。自iOS6开始引入，自iOS7(Xcode5)开始得到较大推广。
2. 核心：
	1. 参照
	2. 约束
3. 警告和错误
	1. 警告：控件的frame不匹配所添加的约束，比如约束控件的宽度为100，而控件现在的宽度是110。
	2. 错误：
		* 缺乏必要的约束，比如只约束了宽度和高度，没有约束具体的位置。
		* 两个约束冲突，比如1个约束控件的宽度为100，1个约束控件的宽度为110
4. 添加约束的规则：  在创建约束之后，需要将其添加到作用的view上，在添加时要注意目标view需要遵循以下规则：
   1. 对于两个同层级view(兄弟view)之间的约束关系，添加到它们的父view上。
   2. 对于两个不同层级view之间的约束关系，添加到它们最近的共同父view上。
   3. 对于有层次关系的两个view之间的约束关系，添加到层级较高的父view上。总之对于两个view之间的约束关系添加到它们最近的一个共同祖先view上。
 5. 代码实现
    1. 利用NSLayoutConstraint类创建具体的约束对象 + (id)constraintWithItem:(id)view1 attribute:(NSLayoutAttribute)attr1 relatedBy:(NSLayoutRelation)relation toItem:(id)view2 attribute:(NSLayoutAttribute)attr2      multiplier:(CGFloat)multiplier constant:(CGFloat)c;其中view1为要约束的控件，attr1约束的类型(做怎样的约束)，releation与参照控件之间的关系，view2参照的控件，attr2约束的类型，multiplier乘数，c常量。
    2. 添加约束对象到相应的view上  - (void)addConstraint:(NSLayoutConstraint *)constraint;   - (void)addConstraints:(NSArray *)constraints;  注意点：a. 要先禁止autoresizing功能，设置view下面属性为NO； view.translatesAutoresizingMaskIntoConstraints = NO;b. 添加约束前，一定要保证相关控件都已经在各自的父控件上。c. 不用再给view设置frame。
6. VFL
	1. 定义：VFL全称是Visual Format Language，可视化格式语言，是苹果公司为了简化Autolayout的编码而推出的抽象语言。
	2. 示例：
		* H:[cancelButton[72]]-12-[acceptButton[50]] cancelButton宽72、acceptButton宽50、它们之间间距12。
		* H:[wideView[>=60@700]] wideView宽度大于等于60point、该约束条件优先级为700(优先级最大值为1000、优先级越高的约束越先被满足)。
		* V:[redBox][yellowBox(==redBox)] 竖直方向上先有一个redBox、其下方紧接一个高度等于redBox高度的yellowBox。
		* H:I-10-[Find]-[FindNext]-[FindField[>=20]]-I水平方向上、Find距离父view左边缘默认间隔宽度、之后FindNext距离Find间隔默认宽度、再之后是宽度不小于20的FindField、它和FindNext以及父view右边缘的间距都是默认宽度。(竖线“|”表示superview的边缘)。
	3. 使用VFL来创建约束数组  + (NSArray *)constraintsWithVisualFormat:(NSString *)format options:(NSLayoutFormatOptions)opts metrics:(NSDictionary *)metrics views:(NSDictionary *)views;其中format为VFL语句，opts约束类型，metrics为VFL语句中用到的具体数值，views为VFL语句中用到的控件。
7. 基于Autolayout的动画：   在修改了约束之后，只要执行下面代码，就能做动画效果   `[UIView animateWithDuration:1.0 animations:^{     [添加了约束的view layoutIfNeeded];  }];`

#### 传感器
1. 定义：传感器是一种感应/检测装置。
2. 作用：用于感应/检测设备周边的信息。不同类型的传感器，检测的信息也不一样。
3. 应用场景：
	1. 在地图应用中，能判断出手机头面向的方向。
	2. 开关灯，iPhone会自动调节亮度让屏幕显得不是那么刺眼。
	3. 打电话时，人脸贴近iPhone屏幕时，屏幕会自动锁屏，达到省电的目的。
4. 类型：
	1. 环境光传感器(Ambient Light Sensor)：随着环境的变化设备会自动调节亮度。当使用iPhone拍照时，闪光灯会在一定条件下自动开启。当周围光线弱到一定条件时，Mac会自动开启键盘背光。
	2. 距离传感器(Proximity Sensor)：用于检测是否有其他物体靠近设备屏幕。当打接电话将电话屏幕贴近耳边，iPhone会自动关闭屏幕以节省电量和防止耳朵或面部不小心触摸屏幕而引发一些不想要的意外操作。  `// 开启距离感应功能  [UIDevice currentDevice].proximityMonitoringEnabled = YES;    // 监听距离感应的通知    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(    proximityChange:) name:UIDeviceProximityStateDidChangeNotification      object:nil];    // 距离更改执行方法     - (void)proximityChange:(NSNotificationCenter *)notification {      if ([UIDevice currentDevice].proximityState == YES) {         NSLog(@“某个物体靠近了设备屏幕”); // 屏幕会自动锁住       } else {        NSLog(@“某个物体远离了设备屏幕”); // 屏幕会自动解锁       }     }`
   3. 磁力计传感器(Magnetometer Sensor)：可感应地球磁场，获得方向信息，使位置服务数据更精准。可用于电子罗盘和导航应用。
   4. 内部问题传感器(Internal Temperature Sensor)：用于检测内部组件温度，当温度超过系统设定的阀值时会出现警告提示。
   5. 湿度传感器(Moisture Sensor)：是一个简单的物理传感器，简单来说湿度传感器就是一张遇水变红的试纸。
   6. 陀螺仪(Gyroscope)：可用于检测设备的持握方式，陀螺仪的原理是检测设备在X、Y、Z轴上所旋转的角速度。
   7. 运动传感器/加速度传感器(Motion/Accelerometer Sensor)，即加速计加速计用于检测设备在X、Y、Z轴上的加速度。感应设备的运动，常用于摇一摇和计步器。
      * UIAccelerometer：iOS4以前，iOS5已过期，用法简单，部分程序还有残留。       `// 获得单例对象       UIAccelerometer *accelerometer = [UIAccelerometer sharedAccelerometer];       // 设置代理       accelerometer.delegate = self;      // 设置采样间隔       accelerometer.updateInterval = 1.0 / 30.0; // 1秒钟采样30次      // 实现代理方法，accelerometer中x、y、z分别代表每个轴上的加速度       - (void)accelerometer:(UIAccelerometer *)accelerometer        didAccelerate:(UIAcceleration *)acceleration`
       * CoreMotion：iOS4以后，不仅提供了实时的加速度值和旋转速度值，还集成了很多好的算法。可通过push(实时采集所有数据，采集频率高)和pull(在有需要的时候，再主动去采集数据)两种方式获取数据。    `// 创建运动管理者对象    CMMotionManager *mgr = [[CMMotionManager alloc] init];    // 判断加速计是否可用    if (mgr.isAccelerometerAvailable) {       // 加速计可用    }    // pull    // 开始采样    - (void)startAccelerometerUpdates;    // 在需要的时候采集加速度数据    CMAcceleration acc = mgr.accelerometerData.acceleration;          // push    // 设置采样间隔     mgr.accelerometerUpdateInterval = 1.0 / 30.0;       // 开始采样，采样到数据就会调用handler、handler会在queue中执行      - (void)startAccelerometerUpdatesToQueue:(NSOperationQueue *)queue      withHandler:(CMAccelerometerHandler)handler;`

## 其他
#### 退出键盘方式
* resignFirstResponder: 当叫出键盘的那个控件(第一响应者)调用这个方法时，就能退出键盘。
* endEditing: 只要调用这个方法的控件内部存在第一响应者，就能退出键盘。

#### 通常开发流程
* 搭建软件界面(UI)。
* 获取网络数据(多线程、网络)。
* 解析网络数据(json、xml)。
* 展示数据到界面(UI)。

#### instancetype
* 在类型表示上，跟id一样，可以表示任何对象类型。
* 只能用在返回值类型上，不能像id一样用在参数类型上。
* 比id多一个好处：编译器会检测instancetype的真实类型，若不匹配会报警告⚠️。 





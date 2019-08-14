#### 内存
1. 栈区  
	栈是向着内存地址减小的方向增长的，由内存的高地址向低地址方向增长。内存地址连续，先进来的存放在栈底，所以先进后出，由系统自动分配释放空间。函数模块内申请，函数结束时由系统自动释放，存放局部变量，函数参数等。  
2. 堆区  
	堆是向着内存地址增加的方向增长的，从内存的低地址向高地址方向增长。内存地址不连续，这是由于系统是用链表来存储空闲内存地址的，自然是不连续的。由开发者自行申请、释放。C里malloc、create、copy、new默认开辟堆空间。
3. 全局区(静态区)  
	全局变量和静态变量的存储是放在一块的，程序运行时申请内存并初始化，程序结束后系统释放。未初始化的全局变量和未初始化的静态变量在一块区域，初始化的全局变量和静态变量在相邻的另一块区域(也称数据段和常量区在一起)。
4. 常量区  
	常量字符串就放在这里，程序运行时申请内存并初始化，程序结束后系统释放。
5. 代码区  
 	也称文本段，存放着程序的机器码和只读数据，可执行指令就是从这里取得的。存放函数体的二进制代码。  
6. 注意
	* 内存地址从高到低：  
	 	栈 -> 堆 -> 未初始化静态变量或全局变量 -> 已初始化静态变量或全局变量(常量区) -> 程序指令和只读数据(代码区)。
	* CFRelease和free都是释放内存空间，但是free有可能存在内存泄露，释放不干净，因为CoreFundation框架中的结构体内部也许还有指针指向堆区域，如果直接free会导致那部分堆区域无法释放，引起内存泄露。CFRelease把函数体里的指针指向的内存全部释放后再释放自己。dealloc函数是当在释放之前，让你可以做一些清空clear的操作。 
	* 栈帧是指为一个函数调用单独分配的那部分栈空间。比如，当运行中的程序调用另一个函数时，就要进入一个新的栈帧，原来函数的栈帧称为调用者的帧，新的栈帧称为当前帧。被调用的函数运行结束后当前帧全部收缩，回到调用者的帧。每个帧都是基于一个函数，帧随着函数的生命周期产生、发展和消亡。  


#### 运行时runtime
1. objc_msgSend
	* 需先将build setting中objc_msgSend值YES改为NO。
	* 如果调用有参数的方法，需要先定义原型再使用，否则会发生崩溃。

	```
	Person *p = [[Person alloc] init];
	void (*eat_msgsend)(id, SEL, NSString *) = (void (*)(id, SEL, NSString *))objc_msgSend;
	eat_msgsend(p, @selector(eatWithObject:), @"apple");
	
	// 在mac下可新建测试文件main.m和Person类然后使用clang -rewrite-objc main.m获取main.cpp查看其底层
	Person *p = [[Person alloc] init];在底层实现实质如下：
	Person *(*person_msgSend)(id, SEL) = (Person *(*)(id, SEL))(void *)objc_msgSend;
	Person *p2 = person_msgSend((id)person_msgSend((id)objc_getClass("Person"), sel_registerName("alloc")), sel_registerName("init"));
	```
[可参考代码https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/runtime/Person/PersonViewController.m](https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/runtime/Person/PersonViewController.m) 
 
2. method_exchangeImplementations 
	i. 需要在使用之前先调用，通常会放在load方法中

	```
	+ (void)load {  
		// class_getClassMethod是类方法，class_getInstanceMethod是对象方法
		Method originMethod = class_getClassMethod(self, @selector(URLWithString:));
		Method replacedMethod = class_getClassMethod(self, @selector(Verify_URLWithString:));
	    // 交换两个方法实现
	    method_exchangeImplementations(originMethod, replacedMethod);
	}  
	```

	ii. 在替代方法中不要调用原方法而需要调用自己否则的话会不断调用直到内存溢出，因为此时两个方法实现已经交换。

	```
	+ (instancetype)Verify_URLWithString:(NSString *)URLString {
	    // 注意：如果使用[NSURL URLWithString:URLString];会一直调用直到内存溢出
	    NSURL *url = [NSURL Verify_URLWithString:URLString];
	    if (url == nil) {
	        printf("url 为 nil\n");
	    }
	    return url;
	}
	```
	
	iii. NSURL中若有中文需对其编码否则会为null

	```
	NSString *urlString = [@"http://www.baidu.com/中文测试" stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
	```
[可参考代码https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/runtime/NSURLVerify/NSURLVerifyViewController.m](https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/runtime/NSURLVerify/NSURLVerifyViewController.m) 


#### KVO  

```
// Animal.h
@interface Animal : NSObject {
    @public
    NSInteger age; // 成员变量
}
// 这句话相当于定义成员变量_name并实现setter和getter方法
@property (nonatomic, copy) NSString *name;

@end

// AnimalViewController.m
_animal = [[Animal alloc] init];
// 1. 动态创建Animal子类。 2. 改变_animal对象类型为其子类型NSKVONotifying_Animal。 3. 使用子类型。
// 查看的话在此加个断点，第一次到这里的时候Command + Q停止当前任务，再重新打开再调试就可看到_animal的isa的改变
[_animal addObserver:self forKeyPath:@"name" options:(NSKeyValueObservingOptionNew) context:nil];
// 由@property (nonatomic, copy) NSString *name;
_animal.name = @"小花猫";
// 成员变量使用->
_animal->age = 2;
```  
原始类型Animal:  
![images/ios_Animal.png](../images/ios_Animal.png "原始类型Animal")  
子类型NSKVONotifying_Animal:  
![images/ios_NSKVONotifying_Animal.png](../images/ios_NSKVONotifying_Animal.png "子类型NSKVONotifying_Animal")

[可参考代码https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/kvo/Animal/AnimalViewController.m](https://github.com/east0422/Training/blob/feature/oc/othersdemo/oc/OthersDemo/OthersDemo/kvo/Animal/AnimalViewController.m)

#### 程序启动过程(从启动到view显示)
1. start->(加载framework、动态静态链接库、启动图片、Info.plist等)->main函数->UIApplicationMain函数:
	1. 初始化UIApplication单例对象。
	2. 初始化AppDelegate对象，并设为UIApplication对象的代理。
	3. 检查Info.plist设置的xib文件是否有效，若有则关联Nib文件并设置outlets，创建并显示key window、rootViewController、与rootViewController关联的根view(没有关联则查找rootViewController同名的xib)，否则launch之后由程序员手动加载。
	4. 建立一个主事件循环，其中包含UIApplication的Runloop来开始处理事件。
2. UIApplication：
	1. 通过window管理视图。
	2. 发送runloop封装好的control消息给target。
	3. 处理url、应用图标警告、联网状态、状态栏、远程事件等。
3. AppDelegate：管理UIApplication生命周期和应用的五种状态(notRunning/inactive/active/background/suspend)。
4. key window：
	1. 显示view。
	2. 管理rootViewController生命周期。
	3. 发送UIApplication传来的事件消息给view。
5. rootViewController：
	1. 管理view(view生命周期，view的数据源/代理，view与superView间事件响应nextResponder的备胎)。
	2. 界面跳转与传值。
	3. 状态栏，屏幕旋转。
6. view：
	1. 通过作为CALayer的代理，管理layer的渲染(顺序大概是先更新约束再layout最后display)和动画(默认layer的熟悉可动画，view默认禁止，在UIView的block分类方法中才打开动画)。layer是RGBA纹理，通过和mask位图(含alpha属性)关联将合成后的layer纹理填充在像素点内，GPU每1/60秒将计算出的纹理display在像素点中。
	2. 布局子控件(屏幕旋转或子视图布局变动时，view会重新布局)。
	3. 事件响应：event和gesture。
7. runloop：
	1. 通过do-while死循环让程序持续运行：接收用户输入，调度处理事件时间。
	2. 通过mach_msg()让runloop没事时进入trap状态，节省CPU资源。 
	
#### UITableViewCell重用机制
1. 一个UITableView中有许多需要显示的cell，但我们不可能每个都浏览到，若我们把这些数据全部都加载进去可能会造成内存的负担。所能显示的区域通常只有一个屏幕的大小，那么屏幕之外的信息是不需要一次性全都加载完的，只有当我们滑动屏幕需要浏览时才需要加载进来，因此就有了UITableViewCell的重用机制。
2. 重用机制实现了数据和显示的分离，并不是为每个数据创建一个UITableViewCell，只创建屏幕可显示最大的cell个数+1，然后去循环重复使用这些cell，既节省空间又达到我们需要显示的效果。
3. 这种机制下系统默认有一个可变数组NSMutableArray *visibleCells用来保存当前显示的cell，还有一个可变字典NSMutableDictionary *reusableTableCells用来保存可重复利用的cell(用字典是因为可重用的cell有不止一种样式，需要根据它的reuseIdentifier重用标识符来查找是否有可重用的该样式的cell)。
4. 当数据过多，整个屏幕的cell显示不完全时cellForRowAtIndexPath执行情况为：
	 1. 先执行[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:identifier]创建整个屏幕能显示的cell数+1的cell(当拖动UITableView第一个cell没有移出屏幕，最下面的cell就已经存在时)，并指定相同或不同标识符identifier。把创建出屏幕能显示的cell全部都加入到visibleCells数组中(最后一个创建的先不加入数组)，reusableTableCells为空。
	 2. 当拖动屏幕时，顶端cell移出屏幕并加入到reusableTableCells字典中，键为identifier，并把之前已经创建但还未加入到visibleCells的cell加入到visibleCells数组中。
	 3. 当接着拖动时，因为reusableTableCells中已有值，当需要显示新cell，cellForRowAtIndexPath再次被调用，执行[tableView dequeueReusableCellWithIdentifier:identifier]，返回一个标识符为identifier的cell。该cell移出reusableTableCells后加入到visibleCells；顶端cell移出visibleCells并加入到reusableTableCells。如果reusableTableCells数组中没有找到identifier类型的cell则再次重新alloc一个。
5. iOS6之后系统加入了一种单元格注册的方法[self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:identifier]。该方法作用是当从重用队列中取cell时，若没有则系统会帮我们创建给定类型的cell，若有则直接重用，这种方式cell的样式为系统默认样式。只需在tableView初始化时注册一下然后就可以在cellForRowAtIndexPath中直接使用[tableView dequeueReusableCellWithIdentifier:identifier forIndexPath:indexPath];获取cell。



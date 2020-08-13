学习笔记

## 2020-08-11
### iOS
1. 栈从高地址往低地址分配，堆从低地址往高地址分配。内存地址从高到低：栈 -> 堆 -> 未初始化静态变量或全局变量 -> 已初始化静态变量或全局变量(常量区) -> 程序指令和只读数据(代码区)。
2. 函数调用时会将函数对应函数指针放到栈中会分配占用32个字节空间(subq \$0x20, %rsp)，调用完成返回之前会释放所占空间(addq \$0x20 %rsp)，占用的是栈空间(函数指针)，栈是从高地址往低地址分配的。
3. CFRelease和free都是释放内存空间，但是free有可能存在内存泄露，释放不干净，因为CoreFundation框架中的结构体内部也许还有指针指向堆区域，如果直接free会导致那部分堆区域无法释放，引起内存泄露。CFRelease把函数体里的指针指向的内存全部释放后再释放自己。dealloc函数是当在释放之前，让你可以做一些清空clear的操作。
4. strong、weak、assign、copy
	1. strong常用于需要持有的对象，NSMutableString/NSMutableArray/NSMutableDictionary等有对应不可变类型的也需要使用strong，因为使用copy的话会将对象变为不可变的再使用可变对象方法会报错找不到对应方法。
	2. weak常用于不需要持久的对象(代理对象避免循环引用，Storyboard中避免重复强引用若使用strong则vc->view->对象与vc->对象重复强引用)，对象释放后会将对象指针置为nil，assign不会自动置为nil。
	3. assign常用于基本数据类型及枚举类型。
	4. copy常用于block(通常函数内部block分配在栈区函数完成后会被释放，需要使用copy将其拷贝到堆区)以及有可变子类型的类型对象(NSString，NSArray, NSDictionary等)，使用copy无论原始初值是否可变都会变为不可变的，操作原始值不会影响该对象。
5. 调用self方法会转换类似objc_msgSend，而super则对应类似objc_msgSendSuper。objc_msgSend对应参数为id类型self和SEL类型op及可变参数，objc_msgSendSuper对应参数为objc_super类型结构体(id类型receiver也即self和Class类型super_class)和SEL类型op及可变参数。

### flutter
1. State生命周期方法(继承StatefulWidget重写方法时对于包含@mustCallSuper标注的父类方法都要在子类方法中(开头或结尾)调用父类方法)：
	1. initState：当Widget第一次插入到Widget树时会被调用，对于每一个State对象，Flutter framework只会调用一次该回调，所以，通常在该回调中做一些一次性的操作，如状态初始化、订阅子树的事件通知等。不能在该回调中调用BuildContext.dependOnInheritedWidgetOfExactType(该方法用于在Widget树上获取离当前widget最近的一个父级InheritFromWidget)，原因是在初始化完成后，Widget树中的InheritFromWidget也可能会发生变化，所以正确的做法应该在build方法或didChangeDependencies中调用它。
	2. didChangeDependencies：当State对象的依赖发生变化时会被调用；如：在之前build中包含了一个InheritedWidget，然后在之后的build中InheritedWidget发生了变化，那么此时InheritedWidget的子widget的didChangeDependencies回调都会被调用。典型的场景是当系统语言Locale或应用主题改变时，Flutter framework会通知widget调用此回调。
	3. build：主要是用于构建Widget子树的，会在调用initState/didUpdateWidget/setState/didChangeDependencies之后被调用，还会在State对象从树中一个位置移除后(会调用deactivate)又重新插入到树的其它位置之后被调用。
	4. reassemble：是专门为了开发调试而提供的，在热重载(hot reload)时会被调用，此回调在Release模式下永远不会被调用。
	5. didUpdateWidget：在widget重新构建时，Flutter framework会调用Widget.canUpdate来检测Widget树中同一位置的新旧节点，然后决定是否需要更新，如果Widget.canUpdate返回true则会调用此回调。
	6. deactivate：当State对象从树中被移除时，会调用此回调。在一些场景下，Flutter framework会将State对象重新插到树中，如包含此State对象的子树在树的一个位置移动到另一个位置时(可通过GlobalKey来实现)。如果移除后没有重新插入到树中则紧接着会调用dispose方法。
	7. dispose：当State对象从树中被永久移除时调用；通常在此回调中释放资源。
2. 在Widget树中获取State对象：
	1. 通过Context获取：context对象有一个findAncestorStateOfType方法，该方法可以从当前节点沿着widget树向上查找指定类型的StatefulWidget对应的State对象。默认约定若StatefulWidget的状态是希望暴露出的，应当在StatefulWidget中提供一个of静态方法来获取其State对象，开发者通过该of方法来获取；若State不希望暴露，则不提供of方法。
	2. 通过GlobalKey(GlobalKey是Flutter提供的一种在整个APP中引用element的机制。如果一个widget设置了GlobalKey，那么便可以通过globalKey.currentWidget获得该widget对象、globalKey.currentElement来获得widget对应的element对象，如果当前widget是StatefulWidget，则可以通过globalKey.currentState来获得该widget对应的state对象)：

		```
		//	1. 给目标StatefulWidget添加GlobalKey
		// 定义一个globalKey, 由于GlobalKey要保持全局唯一性，我们使用静态变量存储
		static GlobalKey<ScaffoldState> _globalKey = GlobalKey();
		...
		Scaffold(
    		key: _globalKey , //设置key
    		...  
		)

		// 2. 通过GlobalKey来获取State对象
		_globalKey.currentState.openDrawer()
		
		// 3. 注意：使用GlobalKey开销较大，若有其他可选方案应尽量避免使用它。另外同一个GlobalKey在整个widget树中必须是唯一的，不能重复
		``` 

## 2020-08-12
### flutter
1. 状态管理：
	1. 若状态是用户数据(如复选框的选中状态、滑块的位置)则该状态最好由父Widget管理。
	2. 若状态是有关界面外观效果的(如颜色、动画)那么状态最好由Widget本身来管理。
	3. 若某一个状态是不同Widget共享的则最好由它们共同的父Widget管理。
2. 加载图片
	1. 从asset中加载图片

	```
	// 1. 在工程根目录下创建一个assets/images目录，并将图片vip.png拷贝到该目录。
	
	// 2. 在pubspec.yaml中的flutter部分添加如下内容(yaml文件对缩进严格，必须严格按照每一层两个空格的方式进行缩进，此处assets前面应有两个空格)
		assets:
     	    - assets/images/		# 加载assets/images/目录下所有图片资源

   // 3. 加载该图片
   Image(image: AssetImage('assets/images/vip.png'))或使用快捷构造函数Image.asset('assets/images/vip.png')从asset中加载显示图片。
	```
	2. 从网络加载图片

	```
	Image(image: NetworkImage('网络图片地址'))或Image.network('网络图片地址')。
	```
		
3. 字体图标iconfont：Flutter默认包含了一套Material Design的字体图标，在pubspec.yaml文件中的配置如下uses-material-design: true。还可以自定义字体图标使用iconFont相比图片优势有：
	1. 体积小，可以减小安装包大小；
	2. 矢量的，iconfont都是矢量图标，放大不会影响其清晰度；
	3. 可以应用文本样式，可以像文本一样改变字体图标的颜色、大小对齐等； 
	4. 可以通过TextSpan和文本混用。
	
## 2020-08-13
### iOS
1. 头文件中，对象@property属性默认会自动生成成员变量(下划线成员变量)、getter/setter方法。分类属性只是生成getter/setter方法声明并没有实现也没有生成对应的成员变量。协议属性也只是生成getter/setter方法声明，标记为@required属性若在实现类中没有对这个属性做任何实现(常用两种实现1,@synthesize 属性名称; 2,添加对应的成员变量和getter/setter方法实现)则实现类会报警告(UIApplicationDelegate协议的window属性，NSObject协议的hash属性)。
2. 一个vc中实现多个tableView效果：
	1. vc中定义多个视图用，然后为vc添加子vc(使用addChildViewController:添加单个或者直接设置childViewControllers添加多个)，每个子vc中可以单独实现tableView，最后将每个子vc的view分别添加道父vc对应视图中。
	2. 在vc中定义多个tableView，在数据源和代理方法中使用时判断具体是那个tableView再进行相应操作(为每个tableView设置不同tag值或直接与不同tableView做对比)。
3. 处理大量不同图片时尽量不要使用imageNamed:方法，因为该方法会将图片缓存到内存中占据内存空间，若过多的话可能会造成内存溢出。imageWithContentsOfFile:和initWithContentsOfFile:方法都不会缓存，前者由自动释放池管理图片释放，后者需要手动释放release后立即释放常用于封面等图比较大的地方。
4. 单例模式

	```
	// 1. 在类的内部提供一个static修饰的全局变量
	// 2. 提供一个类方法，方便外界访问
	// 3. 重写+allocWithZone方法，保证永远都只为单例对象分配一次内存空间
	// 4. 严谨起见，重写-copyWithZone方法和-MutableCopyWithZone方法
	
	#import "SingleInstance.h"
	@implementation SingleInstance
	// 创建静态对象 防止外部访问
	static SingleInstance *singleInstance;
	// alloc/new都会调用到allocWithZone:
	+ (instancetype)allocWithZone:(struct _NSZone *)zone
	{
	//    @synchronized (self) {
	//        // 为了防止多线程同时访问对象，造成多次分配内存空间，所以要加上线程锁
	//        if (singleInstance == nil) {
	//            singleInstance = [super allocWithZone:zone];
	//        }
	//        return singleInstance;
	//    }
	    // 也可以使用一次性代码
	    static dispatch_once_t onceToken;
	    dispatch_once(&onceToken, ^{
	        if (singleInstance == nil) {
	            singleInstance = [super allocWithZone:zone];
	        }
	    });
	    return singleInstance;
	}
	// 为了使实例易于外界访问 我们一般提供一个类方法
	// 类方法命名规范 share类名|default类名|类名
	+ (instancetype)shareSingleInstance {
	    // return singleInstance;
	    // 最好用self 用SingleInstance他的子类调用时会出现错误
	    return [[self alloc]init];
	}
	// 使用拷贝创建对象时会调用copyWithZone:或mutableCopyWithZone:方法，为了严谨，也要重写copyWithZone:和 mutableCopyWithZone:
	- (id)copyWithZone:(NSZone *)zone {
		return singleInstance;
	}
	- (id)mutableCopyWithZone:(NSZone *)zone {
		return singleInstance;
	}

	```
5. 
	


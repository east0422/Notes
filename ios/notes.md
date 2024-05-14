学习笔记

### 2020-08-11
  1. 栈从高地址往低地址分配，堆从低地址往高地址分配。内存地址从高到低：栈 -> 堆 -> 未初始化静态变量或全局变量 -> 已初始化静态变量或全局变量(常量区) -> 程序指令和只读数据(代码区)。
  2. 函数调用时会将函数对应函数指针放到栈中会分配占用32个字节空间(subq \$0x20, %rsp)，调用完成返回之前会释放所占空间(addq \$0x20 %rsp)，占用的是栈空间(函数指针)，栈是从高地址往低地址分配的。
  3. CFRelease和free都是释放内存空间，但是free有可能存在内存泄露，释放不干净，因为CoreFundation框架中的结构体内部也许还有指针指向堆区域，如果直接free会导致那部分堆区域无法释放，引起内存泄露。CFRelease把函数体里的指针指向的内存全部释放后再释放自己。dealloc函数是当在释放之前，让你可以做一些清空clear的操作。
  4. strong、weak、assign、copy
	  1. strong常用于需要持有的对象，NSMutableString/NSMutableArray/NSMutableDictionary等有对应不可变类型的也需要使用strong，因为使用copy的话会将对象变为不可变的再使用可变对象方法会报错找不到对应方法。
	  2. weak常用于不需要持久的对象(代理对象避免循环引用，Storyboard中避免重复强引用若使用strong则vc->view->对象与vc->对象重复强引用)，对象释放后会将对象指针置为nil，assign不会自动置为nil。
	  3. assign常用于基本数据类型及枚举类型。
	  4. copy常用于block(通常函数内部block分配在栈区函数完成后会被释放，需要使用copy将其拷贝到堆区)以及有可变子类型的类型对象(NSString，NSArray, NSDictionary等)，使用copy无论原始初值是否可变都会变为不可变的，操作原始值不会影响该对象。
  5. 调用self方法会转换类似objc_msgSend，而super则对应类似objc_msgSendSuper。objc_msgSend对应参数为id类型self和SEL类型op及可变参数，objc_msgSendSuper对应参数为objc_super类型结构体(id类型receiver也即self和Class类型super_class)和SEL类型op及可变参数。

### 2020-08-13
  1. 头文件中，对象@property属性默认会自动生成成员变量(下划线成员变量)、getter/setter方法。分类属性只是生成getter/setter方法声明并没有实现也没有生成对应的成员变量。协议属性也只是生成getter/setter方法声明，标记为@required属性若在实现类中没有对这个属性做任何实现(常用两种实现1,@synthesize 属性名称; 2,添加对应的成员变量和getter/setter方法实现)则实现类会报警告(UIApplicationDelegate协议的window属性，NSObject协议的hash属性)。
  2. 一个vc中实现多个tableView效果：
	  1. vc中定义多个视图用，然后为vc添加子vc(使用addChildViewController:添加单个或者直接设置childViewControllers添加多个)，每个子vc中可以单独实现tableView，最后将每个子vc的view分别添加道父vc对应视图中。
	  2. 在vc中定义多个tableView，在数据源和代理方法中使用时判断具体是那个tableView再进行相应操作(为每个tableView设置不同tag值或直接与不同tableView做对比)。
  3. 处理大量不同图片时尽量不要使用imageNamed:方法，因为该方法会将图片缓存到内存中占据内存空间，若过多的话可能会造成内存溢出。imageWithContentsOfFile:和initWithContentsOfFile:方法都不会缓存，前者由自动释放池管理图片释放，后者需要手动释放release后立即释放常用于封面等图比较大的地方。
  4. 单例模式
		```
		//   1. 在类的内部提供一个static修饰的全局变量
		//   2. 提供一个类方法，方便外界访问
		//   3. 重写+allocWithZone方法，保证永远都只为单例对象分配一次内存空间
		//   4. 严谨起见，重写-copyWithZone方法和-MutableCopyWithZone方法
		
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

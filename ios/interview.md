## 基础
####  nil、NULL、Nil、NSNull区别
1. nil定义一个空的实例，指向OC中对象的空指针，是一个空对象
(`eg: NSString *someString = nil;NSURL *someURL = nil;id someObject = nil;`)。
2. NULL可以用在C语言的各种指针上，是一个值，只能作为指针变量的值，若指针变量的值是NULL则代表该指针不指向内存中任何一块空间，实质是一个宏值为0(`eg: int *pointerToInt = NULL;char *pointerToChar = NULL;struct TreeNode *rootNode = NULL;`)。
3. Nil定义一个空的类(`eg: Class someClass = Nil;`)。
4. NSNull定义一个单例对象用于表示集合对象的空值即值为空的对象，集合对象(如NSArray、NSSet和NSDictionary)无法包含nil作为其具体值。相应的nil值用一个特定的对象NSNull来表示。NSNull提供了一个单一实例用于表示对象属性中的nil值。默认实现方法中，dictionaryWithValuesForKeys:和setValuesForKeysWithDictionary:自动将NSNull和nil相互转换。

#### GDB与LLDB
1. GDB是UNIX及UNIX-like下的调试工具，xCode老版本中使用。
2. LLDB是个开源的内置于xCode4.3之后的版本中。
3. 常用命令：
 	* p、po： po只会输出对应的值，而p则会输出值+值类型+引用名+内存地址(xcode中)。
 	* expression：打印修改参数值，一般用于修改。
 	* call：方法调用并输出方法的返回值。
 	* image lookup -a 地址：查找崩溃位置。
 	* image lookup -name 方法名：查找方法来源。
 	* image lookup -type 类名：查看某个class的所有属性成员变量。
 	* bt：查看堆栈。

#### static、const、extern关键字
1. static修饰全局变量作用域仅限于当前文件，外部类不可以访问到该变量；static修饰局部变量时该局部变量只会初始化一次，在程序中只有一份内存，分配在静态存储区，该变量在整个程序执行期间不释放，其所分配的空间始终存在。不可改变局部变量的作用域(eg: A方法中定义不能在A方法外使用)，但可延长局部变量的生命周期(该变量直到整个项目结束时才会被销毁)；static修饰的成员函数属于整个类所拥有，该函数不接收this指针因而只能访问类的static成员变量，可被该模块内的其他函数调用，模块外不可调用。
2. const用来修饰右边的基本变量或指针变量，被修饰的变量只读不能被修改。
3. extern访问全局变量，当某一个全局变量没用static修饰时其作用域为整个项目文件，若想在其他类中引用该变量则用extern声明。

#### OC内存管理
1. MRC(Manual Reference Counting)手动内存管理，需要程序员手动创建对象申请内存然后再手动释放。
	* 管理内存原则是谁创建谁释放，也就是说在使用过程中谁retain(或alloc)谁release。
	* 在使用MRC时，当引用计数为0时必须回收，引用计数不为0时则不回收；如果内存计数为0了没回收会造成内存泄漏。
	* 若想使用已经创建好的某个对象，不能直接拿过去用，需要先retain让计数加1，用完之后应该release计数减1，否则会造成野指针。
2. ARC(Automatic Reference Counting)自动引用计数。代码中自动加入retain/release，原先需要手动添加用来处理内存管理引用计数的代码可以自动地由==编译器==完成。
   * 使用ARC只要某个对象被任一strong指针指向，那么它将不会被销毁。如果对象没有被任何strong指针指向，那么就将被销毁。
   * 使用ARC后不允许调用release、retain、retainCount等方法。
   * 允许重写dealloc，但不允许调用[super dealloc]，系统会默认调用[super dealloc]。
   * 不可以使用区域 NSZone。
   * 若A有个属性参照B，B中也有个属性参照A，而且都是strong参照的话那么两个对象都无法释放，从而会出现内存泄漏，常见解决方法是将一个参照改为weak避免循环参照。
   * 若有个ViewController中有无限循环，也会导致即使ViewController对应的view消失了，ViewController也不能释放，从而会出现内存泄漏。
3. Autorelease Pool内存池，类似于release，但不等同于它，release调用后引用计数马上减1。autorelease是在创建对象的时候写的，表示加入自动释放池，当释放池销毁时，才调用引用计数减1。自动释放池需要手动创建。当调用[pool drain]方法时会调用池中全部对象release掉他们。内存池是可以嵌套的。

#### 单例 
1. 在整个应用程序的生命周期内，单例对象的类必须保证只有一个实例对象存在。
2. 优点：
	* 对象只被初始化了一次，确保所有对象访问的都是唯一实例。
	* 只有一个实例存在，所以节省了系统资源，对于一些需要频繁创建和销毁的对象单例模式无疑可以提高系统的性能。
	* 允许可变数目的实例，基于单例模式我们可以进行扩展，使用与单例控制相似的方法来获得指定个数的对象实例，既节省系统资源又解决了单例对象共享过多有损性能的问题。
3. 缺点：
   * 职责过重，在一定程度上违背了"单一职责原则"。
   * 由于单例模式中没有抽象层，因此单例类的扩展有很大的困难。
   * 单例对象一旦创建，指针是保存在静态区的，单例对象的实例会在应用程序终止后才会被释放。
   * 滥用单例将会带来一些负面问题，如为了节省资源将数据库连接池对象设计为单例类，可能会导致共享连接池对象的程序过多而出现连接池溢出；如果实例化的对象长时间不被利用，系统会认为是垃圾而被回收，这将导致对象状态的丢失。
4. 简单实现：
	
	```
	@interface SingleObject : NSObject
	@property (nonatomic, copy)NSString *name;
	+(instancetype)shareInstance;
	@end
	
	#import "SingleObject.h"
	static SingleObject *_singleInstance = nil;
	@implementation SingleObject
	+(instancetype)shareInstance
	{
	    static dispatch_once_t onceToken;
	    dispatch_once(&onceToken, ^{
	        if (_singleInstance == nil) {
	            _singleInstance = [[self alloc]init];
	            _singleInstance.name = @"name";
	        }
	    });
	    return _singleInstance;
	}
	// alloc调用OC内部实际通过调用+(instancetype)allocWithZone
	+(instancetype)allocWithZone:(struct _NSZone *)zone
	{
	    static dispatch_once_t onceToken;
	    dispatch_once(&onceToken, ^{
	        _singleInstance = [super allocWithZone:zone];
	    });
	    return _singleInstance;
	}
	// 老对象直接调用copy
	-(id)copyWithZone:(NSZone *)zone
	{
	    return _singleInstance;
	}
	// 老对象直接调用copy
	-(id)mutableCopyWithZone:(NSZone *)zone {
	    return _singleInstance;
	}
	@end
	```

#### Runloop和线程的关系
1. loop表示某种昂循环，和run放在一起就表示一直在运行着的循环。runloop与线程是一一对应的，一个线程对应一个核心runloop，runloop可以嵌套的，但是核心的只能有一个，他们的关系保存在一个全局的字典里。
2. 主线程的runloop默认自动开启，所以程序在开启后会一直运行不会退出。子线程runloop需要手动开启默认是不开启的，若需要更多的线程交互则可以手动配置和启动，若线程只是去执行一个长时间的已确定的任务则不需要。
3. runloop是来管理线程的，当线程的runloop开启(run)后，线程就会在执行完任务后处于休眠状态，随时等待接受新的任务而不是退出。
4. runloop在第一次获取的时候创建，线程结束时销毁。
5. 获取当前线程的runloop：[NSRunLoop currentRunLoop];。

#### 两个对象间通信
1. 委托代理。通过被代理者定义代理协议委托代理者实现协议，用于两个对象间的通信交互。
2. 通知。一个中心对象注册和发送通知，所用的其它的对象都可以收到通知。
3. 使用block。类似与函数，可作为参数进行传递用于回调，block可以定义在方法里而函数不能。
4. 单例。一个对象实例修改单例属性，另一个对象实例获取单例属性。
5. 使用对象指针。一个对象实例作为另一个对象实例属性。

#### objc类方法和实例方法
1. 类方法：
	* 类方法是属于类对象的，只能通过类对象调用。
	* 类方法中的self是类对象。
	* 类方法可以调用其它的类方法，不能直接调用对象方法，也不能访问成员变量。
2. 实例方法
	* 实例方法是属于实例对象的，只能通过实例对象调用。 
	* 实例方法中的self是实例对象。
	* 实例丰富中可以访问成员变量，可以直接调用实例方法，也可以通过类名调用类方法。 

#### id与instancetype
1. id可以当返回值类并且可以声明对象。
2. instancetype只可以当返回值类型。
3. instancetype返回和方法所在类相同类型的对象，id返回未知类型的对象(instancetype会对返回值类型做一个检查，检查你这个返回值是不是当前类类型)。
4. 自定义初始化方法，返回值类型如果写成id，编译器会自动转换成instancetype。



## 框架
#### Cocoa touch
1. 音频和视频：Core Audio，OpenAL，Media Library，AV Foundation。
2. 数据管理：Core Data，SQLite。
3. 图形和动画：Core Animation，OpenGL ES，Quartz 2D。
4. 网络：Bonjour，WebKit，BSD Sockets。
5. 用户应用：Address Book，Core Location，Map Kit，Store Kit。


## 网络
#### http协议
1. 超文本传输协议(Hyper Text Transfer Protocol)。属于应用层的面向对象的协议，简捷、快速，适用于分布式超媒体信息系统。基于请求与响应模式的、无状态的、应用层的协议。
2. 主要特点：
	* 支持客户/服务器模式。
	* 简单快速，客户向服务器请求服务时只需传送请求方法和路径。
	* 灵活，http允许传输任意类型的数据对象，正在传输的类型由Content-Type加以标记。
	* 无连接，即限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后就断开连接，从而节省传输时间。
	* 无状态，协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，若服务器不需要先前信息时它的应答就较快。

#### tcp/ip协议
1. 是传输层协议，主要解决数据如何在网络中传输。
2. ip代表网际协议，tcp和udp使用该协议从一个网络传送数据包到另一个网络。
3. tcp提供有保证的数据传输，而udp不提供。
4. tcp标志位，有6种标示：
	* SYN(synchronous建立联机)。
	* ACK(acknowledgement确认)。
	* PSH(push传送)。
	* FIN(finish结束)。
	* RST(reset重置)。
	* URG(urgent紧急)。
5. TCP状态迁移：
	* 客户端：CLOSED->SYN_SENT->ESTABLISHED->FIN_WAIT_1->FIN_WAIT_2->TIME_WAIT->CLOSED。
	* 服务器：CLOSED->LISTEN->SYN_RECEIVED->ESTABLISHED->CLOSE_WAIT->LAST_ACK->CLOSED。
	* 各状态意义如下：LISTEN->侦听来自远方TCP端口的连接请求；SYN_SENT->在发送连接请求后等待匹配的连接请求；SYN_RECEIVED->在收到和发送一个连接请求后等待对连接请求的确认；ESTABLISHED->代表一个打开的连接，数据可以传送给用户；FIN_WAIT_1->等待远程TCP的连接中断请求，或先前的连接中断请求的确认；FIN_WAIT_2->从远程TCP等待连接中断请求；CLOSE_WAIT->等待从本地用户发来的连接中断请求；CLOSING->等待远程TCP对连接中断的确认；LAST_ACK->等待原来发向远程TCP的连接中断请求的确认；TIME_WAIT->等待足够的时间以确保远程TCP接收到连接中断请求的确认；CLOSED->没有任何连接状态。
6. tcp/ip三次握手：
	* 第一次握手：建立连接时，客户端A发送SYN包(SYN=j)到服务器B，并进入SYN_SEND状态，等待服务器B确认。
	* 第二次握手：服务器B收到SYN包，必须确认客户A的SYN(ACK=j+1)，同时自己也发送一个SYN包(SYN=k)，即SYN+ACK包，此时服务器B进入SYN_RECV状态。
	* 第三次握手：客户端A收到服务器B的SYN+ACK包，向服务器B发送确认包ACK(ACK=k+1)，此包发送完毕，客户端A和服务器B进入ESTABLISHED状态，完成三次握手。完成后，客户端和服务器开始传送数据。
7. TCP连接释放，即TCP四次挥手。客户端或服务器均可主动发起挥手动作，在socket编程中，任何一方执行close()操作即可产生挥手操作。
	* 客户端A发送一个FIN，用来关闭客户A到服务器B的数据传送。
	* 服务器B收到这个FIN，它发回一个ACK，确认序号为收到的序号加1。和SYN一样，一个FIN将占用一个序号。
	* 服务器B关闭与客户端A的连接，发送一个FIN给客服端A。
	* 客户端A发回ACK报文确认，并将确认序号设置为收到序号加1。
8. 由于TCP连接是全双工的，因此每个方向都必须单独进行关闭。这个原则是当一方完成它的数据发送任务后就能发送一个FIN来终止这个方向的连接。收到一个FIN只意味着这一方向上没有数据流动，一个TCP连接在收到一个FIN后仍能发送数据。首先进行关闭的一方将执行主动关闭，而另一方执行被动关闭。

#### socket
1. socket连接就是所谓的长连接，理论上客服端和服务器端一旦建立起连接将不会主动端掉；但是由于各种环境因素连接可能会断开(eg：服务器端或客服端主机down了，网络故障，或两者之间长时间没有数据传输，网络防火墙可能会断开该连接以释放网络资源)。所以当一个socket连接中没有数据的传输，那么为了维持连接需要发送心跳消息，具体心跳消息格式是开发者自己定义的。
2. socket是通信的基石，是支持TCP/IP协议的网络通信的基本操作单元。它是网络通信过程中端点的抽象表示，包含进行网络通信必须的五种信息：连接使用的协议，本地主机的ip地址，本地进程的协议端口，远地主机的ip地址，远地进程的协议端口。
3. socket是对tcp/ip协议的封装，socket本身并不是协议，而是一个调用接口(api)，通过socket我们才能使用tcp/ip协议。实际上socket跟tcp/ip协议没有必然的联系。socket编程接口在设计的时候就希望也能适应其它的网络协议。所以说socket的出现只是使得程序员更方便地使用tcp/ip协议栈而已，是对tcp/ip协议的抽象，从而形成了我们知道的一些最基本的函数接口，比如create、listen、connect、accept、send、read和write等等。


## 底层
#### oc中的反射机制
1. class反射：通过类名的字符串形式实例化对象。

	```
	Class class = NSClassFromString(@"Teacher");
	Teacher *teacher = [[class alloc] init];
	// 将类名变为字符串
	Class class = [Teacher class];
	NSString *className = NSStringFromClass(class);
	
	```
2. SEL反射：通过方法的字符串形式实例化方法。

	```
	SEL selector = NSSelectorFromString(@"setName");
	[teacher performSelector: selector withObject: @"Wang"];
	// 将方法变为字符串
	NSStringFromSelector(selector);
	```
	
#### 能否向编译后得到的类添加实例变量，能否向运行时创建的类中添加实例变量？
1. 不能想编译后得到的类添加实例变量。因为编译后的类已经注册在runtime中，类结构体中的objc_ivar_list实例变量的链表和instance_size实例变量的内存大小已经确定，同时runtime会调用class_setIvarLayout或class_setWeakIvarLayout来处理strong weak引用。因此不能向存在的类中添加实例变量。
2. 可以向运行时创建的类中添加实例变量。运行时创建的类是可以添加实例变量，调用class_addIvar函数，但是得在调用objc_allocateClassPair之后，objc_registerClassPair之前。原理同上。




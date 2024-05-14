# 基础面试

### nil、NULL、Nil、NSNull区别
  - nil在objc/objc.h中定义。表示oc对象的值为空，定义一个空的实例，指向OC中对象的空指针，是一个空对象。在oc中nil对象调用任何方法什么都不执行也不会崩溃。(`eg: NSString *someString = nil;NSURL *someURL = nil;id someObject = nil;`)。
  - NULL可以用在C语言的各种指针上，是一个值，只能作为指针变量的值，若指针变量的值是NULL则代表该指针不指向内存中任何一块空间，实质是一个宏值为0(`eg: int *pointerToInt = NULL;char *pointerToChar = NULL;struct TreeNode *rootNode = NULL;`)。
  - Nil定义一个空的类(`eg: Class someClass = Nil;`)。
  - NSNull继承于NSObject，表示是空，什么也不存储，但它却是对象只是一个占位对象。定义一个单例对象用于表示集合对象的空值即值为空的对象，集合对象(如NSArray、NSSet和NSDictionary)无法包含nil作为其具体值。相应的nil值用一个特定的对象NSNull来表示。NSNull提供了一个单一实例用于表示对象属性中的nil值。默认实现方法中，dictionaryWithValuesForKeys:和setValuesForKeysWithDictionary:自动将NSNull和nil相互转换。

### GDB与LLDB
  - GDB是UNIX及UNIX-like下的调试工具，xCode老版本中使用。
  - LLDB是个开源的内置于xCode  -3之后的版本中。
  - 常用命令：
    - p、po： po只会输出对应的值，而p则会输出值+值类型+引用名+内存地址(xcode中)。
    - expression：打印修改参数值，一般用于修改。
    - call：方法调用并输出方法的返回值。
    - image lookup -a 地址：查找崩溃位置。
    - image lookup -name 方法名：查找方法来源。
    - image lookup -type 类名：查看某个class的所有属性成员变量。
    - bt：查看堆栈。

### static、const、extern关键字
  - static修饰全局变量作用域仅限于当前文件，外部类不可以访问到该变量；static修饰局部变量时该局部变量只会初始化一次，在程序中只有一份内存，分配在静态存储区，该变量在整个程序执行期间不释放，其所分配的空间始终存在。不可改变局部变量的作用域(eg: A方法中定义不能在A方法外使用)，但可延长局部变量的生命周期(该变量直到整个项目结束时才会被销毁)；static修饰的成员函数属于整个类所拥有，该函数不接收this指针因而只能访问类的static成员变量，可被该模块内的其他函数调用，模块外不可调用。
  - const用来修饰右边的基本变量或指针变量，被修饰的变量只读不能被修改。
  - extern访问全局变量，当某一个全局变量没用static修饰时其作用域为整个项目文件，若想在其他类中引用该变量则用extern声明。

### malloc和new的区别
  - new是c++中的操作符，malloc是c中的一个函数。
  - new不止是分配内存，而且会调用类的构造函数，同理delete会调用类的析构函数。而malloc则只分配内存，不会进行初始化类成员的工作，同样free也不会调用析构函数。
  - 内存泄漏对于malloc或new都可以检查出来的，区别在于new可以指明是那个文件的那一行，而malloc没有这些信息。
  - new可以认为是malloc加构造函数的执行，new出来的指针是直接带类型信息的。

### 两个对象间通信
  - 委托代理。通过被代理者定义代理协议委托代理者实现协议，用于两个对象间的通信交互。
  - 通知。一个中心对象注册和发送通知，所用的其它的对象都可以收到通知。
  - 使用block。类似与函数，可作为参数进行传递用于回调，block可以定义在方法里而函数不能。
  - 单例。一个对象实例修改单例属性，另一个对象实例获取单例属性。
  - 使用对象指针。一个对象实例作为另一个对象实例属性。

### 页面A跳转到页面B方法调用次序
  - A -> viewWillDisappear。
  - B -> viewWillAppear。
  - A -> viewDidDisappear。
  - B -> viewDidAppear。

### objc类方法和实例方法
  - 类方法：
    - 类方法是属于类对象的，只能通过类对象调用。
  	- 类方法中的self是类对象。
  	- 类方法可以调用其它的类方法，不能直接调用对象方法，也不能访问成员变量。
  - 实例方法
    - 实例方法是属于实例对象的，只能通过实例对象调用。 
  	- 实例方法中的self是实例对象。
  	- 实例丰富中可以访问成员变量，可以直接调用实例方法，也可以通过类名调用类方法。 

### id与instancetype
  - id可以当返回值类并且可以声明对象。
  - instancetype只可以当返回值类型，编译时判断真实类型，不符合会警告。
  - instancetype返回和方法所在类相同类型的对象，id返回未知类型的对象(instancetype会对返回值类型做一个检查，检查你这个返回值是不是当前类类型)。
  - 自定义初始化方法，返回值类型如果写成id，编译器会自动转换成instancetype。

### CPU与GPU
  - CPU：中央处理器(Central Processing Unit)是一台计算机的运算核心和控制核心。CPU、内部存储器和输入/输出设备是电子计算机三大核心部件。其功能主要是解释计算机指令以及处理计算机软件中的数据。
  - GPU：图形处理器(Graphic Processing Unit)，一个专门的图形核心处理器。GPU是显示卡的“大脑”，决定了该显卡的档次和大部分性能，同时也是2D显示卡和3D显示卡的区别依据。2D显示芯片在处理3D图像和特效时主要依赖CPU的处理能力，成为“软加速”。3D显示芯片是将三维图像和特效处理功能集中在显示芯片内，也即所谓的“硬件加速”功能。

### 深拷贝和浅拷贝
  - 浅拷贝是指针拷贝，对一个对象进行浅拷贝相当于对指向对象的指针进行复制，产生一个新的指向这个对象的指针，两个指针指向同一个对象，这个对象销毁后两个指针都应该置空。
  - 深拷贝是对一个对象进行拷贝，相当于对对象进行复制，产生一个新的对象，那么就有两个指针分别指向两个对象，当一个对象改变或被销毁后拷贝出来的新的对象不受影响。
  - 实现深拷贝需要实现NSCopying协议，实现-(id)copyWithZone:(NSZone *)zone方法，当对一个property属性含有copy修饰符时在进行赋值操作时实际上就是调用这个方法。
  - 父类实现深拷贝后，子类只要重写copyWithZone方法，在方法内部调用父类的copyWithZone方法，之后实现自己属性的处理。父类没有实现深拷贝，子类除了需要对自己对属性进行处理还要对父类的属性进行处理。

### 字符串使用copy与strong
  - NSString的字符串对象的值改变时会开辟一块新的内存，NSMutableString的字符串对象的值改变时依旧是原地址。
  - copy拷贝NSString字符串是拷贝指针即浅拷贝。copy拷贝NSMutableString字符串是重新生成一个新对象即深拷贝。copy修饰的可变字符串属性类型始终是NSString而不是NSMutableString，若想让拷贝过来的对象是可变的就要使用mutableCopy。
  - strong表示强指向，对可变和不可变字符串都是浅拷贝。对NSMutableString不存在深拷贝。
  - 当源字符串(赋值符号右边字符串)是NSString时，由于字符串是不可变的，所以不管是strong还是copy属性的对象都是指向源对象，copy操作只是做了次浅拷贝。当源字符串是NSMutableString时，strong属性只是增加了源字符串的引用计数，而copy属性则是对源字符串做了次深拷贝，产生一个新的对象，且copy属性对象指向这个新的对象(这个copy属性对象的类型始终是NSString而不是NSMutableString因此其是不可变的)。
  - 当源字符串是NSMutableString，strong是单纯的增加对象的引用计数(值会随着源字符串改变而改变)。而copy操作是执行了一次深拷贝(值不会随着源字符串改变而改变)。
  - [参考链接](https://www.jianshu.com/p/5584993b5e0f)。





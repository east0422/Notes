flutter日常学习笔记

### 2020-08-11
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
			//	  1. 给目标StatefulWidget添加GlobalKey
			// 定义一个globalKey, 由于GlobalKey要保持全局唯一性，我们使用静态变量存储
			static GlobalKey<ScaffoldState> _globalKey = GlobalKey();
			...
			Scaffold(
				key: _globalKey , //设置key
				...  
			)
			//   2. 通过GlobalKey来获取State对象
			_globalKey.currentState.openDrawer()
			//   3. 注意：使用GlobalKey开销较大，若有其他可选方案应尽量避免使用它。另外同一个GlobalKey在整个widget树中必须是唯一的，不能重复
			``` 

### 2020-08-12
  1. 状态管理：
	  1. 若状态是用户数据(如复选框的选中状态、滑块的位置)则该状态最好由父Widget管理。
	  2. 若状态是有关界面外观效果的(如颜色、动画)那么状态最好由Widget本身来管理。
	  3. 若某一个状态是不同Widget共享的则最好由它们共同的父Widget管理。
  2. 加载图片
	  1. 从asset中加载图片
			```
			//   1. 在工程根目录下创建一个assets/images目录，并将图片vip.png拷贝到该目录。
			//   2. 在pubspec.yaml中的flutter部分添加如下内容(yaml文件对缩进严格，必须严格按照每一层两个空格的方式进行缩进，此处assets前面应有两个空格)
				assets:
							- assets/images/		# 加载assets/images/目录下所有图片资源
			//   3. 加载该图片
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
	
### 2020-08-14
  1. 依据Widget是否需要包含子节点分为三类
	  1. LeafRenderObjectWidget: 叶子节点，用于没有子节点的widget，通常基础组件都属于这一类(如Image等)。对应LeafRenderObjectElement。
	  2. SingleChildRenderObjectWidget: 包含一个子Widget(如ConstrainedBox、DecoratedBox等)。对应SingleChildRenderObjectElement。
	  3. MultiChildRenderObjectWidget: 包含多个子Widget，一般都有一个children参数，接受一个Widget数组(如Row、Column、Stack等)。对应MultiChildRenderObjectElement。
  2. Align和Stack对比(Align和Stack/Positioned都可用于指定子元素相对于父元素的偏移)区别
	  1. Stack可以有多个子元素，并且子元素可以堆叠，而Align只能有一个子元素，不存在堆叠。
	  2. 定位参考系统不同；Stack/Positioned定位的的参考系可以是父容器矩形的四个顶点；而Align则需要先通过alignment参数来确定坐标原点，不同的alignment会对应不同原点(Alignment会以矩形的中心点作为坐标原点，FractionalOffset的坐标原点为矩形的左侧顶点)，最终的偏移是需要通过alignment的转换公式来计算出。

### 2020-08-17
  1. 容器类Widget和布局类Widget都作用于其子Widget，不同的是：
	  1. 布局类Widget一般都需要接收一个widget数组(children)，他们直接或间接继承自(或包含)MultiChildRenderObjectWidget ；而容器类Widget一般只需要接收一个子Widget(child)，他们直接或间接继承自(或包含)SingleChildRenderObjectWidget。
	  2. 布局类Widget是按照一定的排列方式来对其子Widget进行排列；而容器类Widget一般只是包装其子Widget，对其添加一些修饰(补白或背景色等)、变换(旋转或剪裁等)、或限制(大小等)。
	  3. 常用布局类Widget有Row, Column, Flex, Wrap, Flow, Stack, Positioned, Align等。常用容器类Widget有Padding, ConstrainedBox, SizedBox, UnconstrainedBox, AspectRatio, DecoratedBox, Transform, Container, Scaffold, TabBar,Clip等。
  2. 尺寸限制类容器：
	  1. 有多重限制时，对于minWidth和minHeight来说取父子控件中数值较大值作为最小限制值，对于maxWidth和maxHeight来说取父子控件中数值较小值作为最大限制值。最后尺寸限制值作用于指定尺寸再得出最终实际尺寸值，只有这样才能保证父限制与子限制不冲突。

### 2020-08-20
  1. 可滚动组件
	  1. 当组件内容超过当前显示视口(ViewPort)时，如果没有特殊处理，Flutter则会提示Overflow错误。
	  2. 可滚动组件都直接或间接包含一个Scrollable组件
		```
		Scrollable({
			...
			this.axisDirection = AxisDirection.down, // 滚动方向
			this.controller, // 接受一个ScrollController对象，主要作用是控制滚动位置和监听滚动事件。默认情况下，Widget树中会有一个默认的PrimaryScrollController，如果子树中的可滚动组件没有显式的指定controller，并且primary属性值为true时(默认就为true)，可滚动组件会使用这个默认的PrimaryScrollController。这种机制带来的好处是父组件可以控制子树中可滚动组件的滚动行为(如Scaffold正是使用这种机制在iOS中实现了点击导航栏回到顶部的功能)。
			this.physics, // 接受一个ScrollPhysics类型的对象，它决定可滚动组件如何响应用户操作，比如用户滑动完抬起手指后，继续执行动画；或者滑动到边界时，如何显示。默认情况下，Flutter会根据具体平台分别使用不同的ScrollPhysics对象，应用不同的显示效果，如当滑动到边界时，继续拖动的话，在iOS上会出现弹性效果(BouncingScrollPhysics)，而在Android上会出现微光效果(ClampingScrollPhysics：Android)。如果你想在所有平台下使用同一种效果，可以显式指定一个固定的ScrollPhysics。
			@required this.viewportBuilder, //后面介绍
		})

		```
  2. 基于Sliver的延迟构建：通常可滚动组件的子组件可能会非常多、占用的总高度也会非常大；如果要一次性将子组件全部构建出将会非常昂贵！为此，Flutter中提出一个Sliver(薄片)概念，如果一个可滚动组件支持Sliver模型，那么该滚动可以将子组件分成好多个“薄片”(Sliver)，只有当Sliver出现在视口(实际显示区域)中时才会去构建它，这种模型也称为“基于Sliver的延迟构建模型”。可滚动组件中有很多都支持基于Sliver的延迟构建模型，如ListView、GridView，但是也有不支持该模型的，如SingleChildScrollView(所以SingleChildScrollView只应在期望的内容不会超过屏幕太多时使用，如果预计视口可能包含超出屏幕尺寸太多的内容时，那么使用它将会非常昂贵，性能比较差)。
  3. ListView
	  1. 可以沿一个方向线性排布所有子组件，并且它也支持基于Sliver的延迟构建模型。
	  2. 默认构造函数有一个children参数，它接受一个Widget列表(List)。这种方式适合只有少量的子组件的情况，因为这种方式需要将所有children都提前创建好(这需要做大量工作)，而不是等到子widget真正显示的时候再创建，也就是说通过默认构造函数构建的ListView没有应用基于Sliver的懒加载模型。实际上通过此方式创建的ListView和使用SingleChildScrollView+Column的方式没有本质的区别。可滚动组件通过一个List来作为其children属性时，只适用于子组件较少的情况，这是一个通用规律，并非ListView自己的特性，像GridView也是如此。
	  3. ListView.builder适合列表项比较多(或者无限)的情况，因为只有当子组件真正显示的时候才会被创建，也就说通过该构造函数创建的ListView是支持基于Sliver的懒加载模型的。

### 2020-08-25
  1. 导航返回拦截(WillPopScope)：
	  1. 避免用户误触返回按钮而导致APP退出，在很多APP中都拦截了用户点击返回键的按钮，然后进行一些防误触判断，比如当用户在某一个时间段内点击两次时，才会认为用户是要退出(而非误触)。
	  2. onWillPop是一个回调函数，当用户点击返回按钮时被调用(包括导航返回按钮及Android物理返回按钮)。该回调需要返回一个Future对象，如果返回的Future最终值为false时，则当前路由不出栈(不会返回)；最终值为true时当前路由出栈退出。需要提供这个回调来决定是否退出。
  2. 数据共享(InheritedWidget)：
	  1. 它提供了一种数据在widget树中从上到下传递、共享的方式，比如我们在应用的根widget中通过InheritedWidget共享了一个数据，那么我们便可以在任意子widget中来获取该共享的数据。
	  2. 在StatefulWidget中State对象有一个didChangeDependencies回调，它会在“依赖”发生变化时被Flutter Framework调用。而这个“依赖”指的就是子widget是否使用了父widget中InheritedWidget的数据！如果使用了，则代表子widget有依赖InheritedWidget；如果没有使用则代表没有依赖。这种机制可以使子组件在所依赖的InheritedWidget变化时来更新自身！比如当主题、locale(语言)等发生变化时，依赖它的子widget的didChangeDependencies方法将会被调用。
	  3. dependOnInheritedElement方法中主要是注册了依赖关系！调用dependOnInheritedWidgetOfExactType和getElementForInheritedWidgetOfExactType的区别就是前者会注册依赖关系，而后者不会，所以在调用dependOnInheritedWidgetOfExactType时，InheritedWidget和依赖它的子孙组件关系便完成了注册，之后当InheritedWidget发生变化时，就会更新依赖它的子孙组件，也就是会调这些子孙组件的didChangeDependencies和build方法。而当调用的是getElementForInheritedWidgetOfExactType时，由于没有注册依赖关系，所以之后当InheritedWidget发生变化时，就不会更新相应的子孙Widget。
  3. 跨组件状态共享(Provider)
	  1. 状态管理一般的原则是：如果状态是组件私有的，则应该由组件自己管理；如果状态要跨组件共享，则该状态应该由各个组件共同的父元素来管理。对于跨组件共享的状态，管理的方式就比较多了，如使用全局事件总线EventBus（将在下一章中介绍），它是一个观察者模式的实现，通过它就可以实现跨组件状态同步：状态持有方（发布者）负责更新、发布状态，状态使用方（观察者）监听状态改变事件来执行一些操作。

### 进程
1. 进程是指在系统中正在运行的一个应用程序。
2. 每个进程之间是独立的，每个进程运行在其自己专用且受保护的内存空间里。

### 线程
1. 线程是进程的基本执行单元，一个进程的所有任务都在线程中执行。
2. 一个线程中任务的执行是串行(顺序执行)的，也就是说在同一时间内，一个线程只能执行一个任务，例如在一个线程中要下载三个文件只能一个一个的下载。
3. 若要在一个线程中执行多个任务，则只能一个一个地按顺序执行这些任务。

### 多线程
	能适当提高程序的执行效率和资源(CPU，内存)利用率，但是开启线程需要占用一定的内存空间（默认情况下，主线程占用1M，子线程占用512KB），若开启大量的线程会占用大量的内存空间，降低程序的性能。线程越多，CPU在调度线程上的开销也就越大。
1. pthread
  1. 简介：POSIX线程，是线程的POSIX标准。是一套通用的多线程API，可以在Unix/Linux/Mac OS X等系统跨平台使用，Windows中也有其移植版pthread-win32。使用C语言编写，需要程序员自己管理线程的生命周期，在开发中几乎不使用。
  2. 使用
    	* 包含头文件#import <pthread.h>
    	* 创建线程，并开启线程执行任务

		```
		// 定义一个pthread_t类型变量
		pthread_t thread;
		// 创建线程，开启线程，执行任务
		pthread_create(&thread, NULL, run, NULL);
		// 设置子线程的状态为detached，该线程运行结束后会自动释放所有资源
		pthread_detach(thread);
		// run方法
		void *run(void *param) {
			NSLog(@“%@”, [NSThread currentThread]);
			return NULL;
		}
		```
2. NSThread
   1. 先创建后启动（可对线程进行更详细的设置，例如线程名字）   
		`NSThread *thread = [[NSThread alloc] initWithTarget:self selector:      @selector(download:) object:nil];     	[thread start];`
   2. 创建完自动启动 `[NSThread detachNewThreadSelector:@selector(download:) toTarget:self withObject:nil];`
   3. 隐式创建（自动启动） `[self performSelectorInBackground:@selector(download:) withObject:nil];`
3. GCD（核心为任务和队列，即执行什么操作和用来存放任务）
   1. 同步：在当前线程中执行任务，不具备开启新线程的能力 `dispatch_sync(dispatch_queue_t queue, dispatch_block_t block)`，queue为队列，block为任务
	2. 异步：马上执行，在新的线程中执行任务，具备开启新线程的能力。 `dispatch_async(dispatch_queue_t queue, dispatch_block_t block)`。
	3. 并发：多个任务并发(同时)执行(自动开启多个线程同时执行任务，开启线程时间由GCD底层决定)，只在异步下有效。使用`dispatch_get_global_queue`函数可获得全局并发队列。
	4. 串行：多个任务一个一个执行，一个任务执行完成后再执行下一个任务，最多开一个线程。使用`dispatch_queue_create`函数可创建串行队列。
	5. 主队列：专门负责在主线程上调度任务，即与主线程相关联的队列，不会在子线程调度任务。在主队列不允许开启新线程。主队列是GCD自带的一种特殊的串行队列，放在主队列中的任务都会放到主线程中执行。可使用`dispatch_get_main_queue()`获得主队列串。
		* 行队列同步执行：不开线程，在原线程中一个一个顺序执行。
		* 串行队列异步执行：开一个新线程，在新线程中一个一个顺序行。
		* 并发队列同步执行：不开线程，在原线程中一个一个顺序执行。
		* 并发队列异步执行：开多个新线程，在新线程中并发(执行先后顺序不确定）执行。
		* 主队列同步执行：死锁。
		* 主队列异步执行：不会开启新线程，先执行主线程中的任务再执行异步队列中任务。
   6. 只执行一次
	`static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      // 执行代码，这里面默认是线程安全的
    });
	`
   7. 队列组   
	`
	// 创建一个队列组
	dispatch_group_t group = dispatch_group_create();
	// 获取一个全局队列
	dispatch_queue_t queue =  dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
	dispatch_group_async(group, queue, ^{
		// 执行耗时操作A
	});
	dispatch_group_async(group, queue, ^{
		// 执行耗时操作B
	});
	// 监听操作A和操作B执行完后通知执行操作C
	dispatch_group_notify(group, queue, ^{
		// 执行操作C
	});
	`	
4. NSOperation
	先将需要执行的操作封装到一个NSOperation对象中，然后将NSOperation对象添加到NSOperationQueue中，系统会自动将NSOperationQueue中的NSOperation取出来放到一条新线程中异步执行。
	1. NSInvocationOperation： `// 创建NSInvocationOperation对象 - (id)initWithTarget:(id)target selector:(SEL)sel object:(id)arg; // 调用start方法开始执行操作，一旦执行操作就会调用target的sel方法 - (void)start; 注意：默认情况下，调用了start方法后并不会开一条新线程去执行操作，而是在当前线程中同步执行操作，只有将NSOperation放到一个NSOperationQueue中，才会异步执行操作。`
   2. NSBlockOperation： `// 创建NSBlockOperation对象 + (id)blockOperationWithBlock:(void (^)(void))block; // 通过addExecutionBlock：方法添加更多的操作 - (void)addExecutionBlock:(void (^)(void))block; 注意：只要NSBlockOperation封装的操作数大于1就会异步执行操作。`
	3. 自定义NSOperation子类重写main方法：经常通过-(BOOL)isCancelled方法检测操作是否被取消，对取消做出响应。
	4. 添加任务到NSOperationQueue中 `- (void)addOperation:(NSOperation *)op;  - (void)addOperationWithBlock:(void (^)(void))block;`
	5. 设置最大并发数，最大并发数不是线程总数，而是同时执行线程最多个数`- (NSInteger)maxConcurrentOperationCount;  - (void)setMaxConcurrentOperationCount:(NSInteger)cnt;`
	6. 取消所有操作，正在执行的不会被取消会继续执行完 `- (void)cancelAllOperations;// 也可以调用NSOperation的 - (void)cancel方法取消单个操作`
  7. 暂停和恢复所有操作： `- (void)setSuspended:(BOOL)b; // YES代表暂停队列，NO代表恢复队列`
	8. 操作之间的依赖，可以跨队列，NSOperation之间可以设置依赖来保证执行顺序，不能相互依赖，如A依赖B，B依赖A。 `[operationB addDependency:operationA]; // 操作B依赖于操作A，等操作A执行完毕后，才会执行操作B。`
	9. 监听操作执行完毕：
		`- (void (^)(void))completionBlock; - (void)setCompletionBlock:(void (^)(void))block`
5. 线程间通信
	1. thread：
   ` - (void)performSelector:(SEL)aSelector onThread: (NSThread *)thread withObject: (id)arg waitUntilDone: (BOOL)wait;`
   2. gcd： `dispatch_async(dispatch_get_global_queue(   DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),  ^{    // 执行耗时的异步操作...    dispatch_async(dispatch_get_main_queue(), ^{        // 回到主线程，执行UI刷新操作    });  });`
   3. NSOperation： `NSOperationQueue *queue = [[NSOperationQueue alloc] init]; [queue addOperationWithBlock:^{    // 1.执行一些比较耗时的操作   // 2.回到主线程   [[NSOperationQueue mainQueue] addOperationWithBlock:^{      // 执行更新操作    }];   }];`
6. 从其他线程回到主线程
	 1. perform： `[self performSelectorOnMainThread:<#(SEL)#> withObject:<#(id)#> waitUntilDone:<#(BOOL)#>];`
	 2. gcd：`dispatch_async(dispatch_get_main_queue(), ^{});`
	 3. NSOperation：`[[NSOperationQueue mainQueue] addOperationWithBlock:^{}];`
7. 延时执行
   1. NSObject：`[self performSelector:@selector(method) withObject:nil afterDelay: 1.0];`
   2. gcd：`dispatch_after(dispatch_time(DISPATCH_TIME_NOW,       (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      // 延迟执行代码     });`



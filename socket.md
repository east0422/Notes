# Socket

### 简述
  1. I/O命令集模式为打开一读/写一关闭(open-write-read-close)。在一个用户进程进行I/O操作时，首先调用“打开”获得对指定文件或设备的使用权，并返回称为文件描述符的整型数，以描述用户在打开的文件或设备上进行I/O操作的进程。然后这个用户进程多次调用“读/写”以传输数据。当所有的传输操作完成后，用户进程关闭调用，通知操作系统已经完成了对某对象的使用。

### 进程间通信
   1. UNIX BSD中的管道(pipe)、命名管道(named pipe)和软中断信号(signal)，UNIX system V的消息(message)、共享存储区(shared memory)和信号(semaphore)等，但都仅限于用在本机进程之间通信。

### 半相关
   1. 网络中用一个三元组可以在全局唯一标志一个进程：(协议，本地地址，本地端口号)，这样一个三元组叫做一个半相关(half-association)，它指定连接的每半部分。

### 全相关
   1. 一个完整的网间进程通信需要由两个进程组成，并且只能使用同一种高层协议。也就是说，不可能通信的一端用TCP协议，而另一端用UDP协议。因此一个完整的网间通信需要一个五元组来标识：(协议，本地地址，本地端口号，远地地址，远地端口号)，这样一个五元组，叫做一个相关(association)，即两个协议相同的半相关才能组合成一个合适的相关，或完全指定组成一连接。

### 流控制
   在数据传输过程中控制数据传输速率的一种机制，以保证数据不被丢失。TCP协议提供这项服务。

### 字节流
   字节流方式指的是仅把传输中的报文看作是一个字节序列，不提供数据流的任何边界。TCP协议提供字节流服务。

### 报文
   接收方要保存发送方的报文边界。UDP协议提供报文服务。

### 全双工/半双工
   端－端间数据同时以两个方向/一个方向传送。

### 缓存/带外数据
   在字节流服务中，由于没有报文边界，用户进程在某一时刻可以读或写任意数量的字节。为保证传输正确或采用有流控制的协议时，都要进行缓存。但对某些特殊的需求，如交互式应用程序，又会要求取消这种缓存。在数据传送过程中，希望不通过常规传输方式传送给用户以便及时处理的某一类信息，如 UNIX系统的中断键(Delete或Control-c)、终端流控制符(Control-s和Control-q)，称为带外数据。逻辑上看，好象用户进程使用了一个独立的通道传输这些数据。该通道与每对连接的流相联系。由于Berkeley Software Distribution中对带外数据的实现与RFC 1122中规定的Host Agreement不一致，为了将互操作中的问题减到最小，应用程序编写者除非与现有服务互操作时要求带外数据外，最好不使用它。

### TCP/IP套接字类型
   1. 流式套接字(SOCK_STREAM)
      提供了一个面向连接、可靠的数据传输服务，数据无差错、无重复地发送，且按发送顺序接收。内设流量控制，避免数据流超限；数据被看作是字节流，无长度限制。文件传送协议(FTP)即使用流式套接字。
   2. 数据报式套接字(SOCK_DGRAM)
      提供了一个无连接服务。数据包以独立包形式被发送，不提供无错保证，数据可能丢失或重复，并且接收顺序混乱。网络文件系统(NFS)使用数据报式套接字。
   3. 原始式套接字(SOCK_RAW)
      该接口允许对较低层协议，如IP、ICMP直接访问。常用于检验新的协议实现或访问现有服务中配置的新设备。

### 基本套接字系统调用
   1. 创建套接字──SOCKET PASCAL FAR socket(int af, int type, int protocol)
      应用程序在使用套接字前，首先必须拥有一个套接字，系统调用socket向应用程序提供创建套接字的手段，接收三个参数：af、type、protocol。
      参数af指定通信发生的区域，UNIX系统支持的地址族有：AF_UNIX、AF_INET、AF_NS等，而DOS、WINDOWS中仅支持AF_INET，它是网际网区域。因此，地址族与协议族相同。根据这三个参数建立一个套接字，并将相应的资源分配给它，同时返回一个整型套接字号。因此socket系统调用实际上指定了相关五元组中的“协议”这一元。
      * 参数type描述要建立的套接字的类型。
      * 参数protocol说明该套接字使用的特定协议，如果调用者不希望特别指定使用的协议则置为0，使用默认的连接模式。
   2. 指定本地地址──int PASCAL FAR bind(SOCKET s, const struct sockaddr FAR * name, int namelen)
      当一个套接字用socket创建后，存在一个名字空间(地址族)，但它没有被命名。bind将套接字地址(包括本地主机地址和本地端口地址)与所创建的套接字号联系起来，即将名字赋予套接字，以指定本地半相关。如果没有错误发生，bind返回0。否则返回值SOCKET_ERROR。
      * 参数s是由socket调用返回的并且未作连接的套接字描述符(套接字号)。
      * 参数name是赋给套接字s的本地地址(名字)，其长度可变，结构随通信域的不同而不同。
      * namelen表明了name的长度。
      * UNIX BSD有一组描述套接字地址的数据结构，其中使用TCP/IP协议的地址结构为：
      ```
        struct sockaddr_in {
          short sin_family; /* AF_INET */
          u_short sin_port; /* 16位端口号，网络字节顺序 */
          struct in_addr sin_addr; /* 32位IP地址，网络字节顺序 */
          char sin_zero[8]; /* 保留 */
        }
      ```
   3. 建立套接字连接──connect与accept
      这两个系统调用用于完成一个完整相关的建立。
      其中connect用于建立连接。如果没有错误发生，connect返回0。否则返回值SOCKET_ERROR。在面向连接的协议中，该调用导致本地系统和外部系统之间连接实际建立。由于地址族总被包含在套接字地址结构的前两个字节中，并通过socket调用与某个协议族相关。因此bind和connect无须协议作为参数。无连接的套接字进程也可以调用connect，但这时在进程之间没有实际的报文交换，调用将从本地操作系统直接返回。这样做的优点是程序员不必为每一数据指定目的地址，而且如果收到的一个数据报，其目的端口未与任何套接字建立“连接”，便能判断该端口不可操作。connect的调用格式为：int PASCAL FAR connect(SOCKET s, const struct sockaddr FAR * name, int namelen);
         * 参数s是欲建立连接的本地套接字描述符。
         * 参数name指出说明对方套接字地址结构的指针。
         * namelen指出说明对方套接字地址长度。
      而accept用于使服务器等待来自某客户进程的实际连接。如果没有错误发生，accept返回一个SOCKET类型的值，表示接收到的套接字的描述符。否则返回值INVALID_SOCKET。accept用于面向连接服务器。accept的调用格式为：SOCKET PASCAL FAR accept(SOCKET s, struct sockaddr FAR* addr, int FAR* addrlen);
         * 参数s为本地套接字描述符，在用做accept调用的参数前应该先调用过listen()。
         * addr指向客户方套接字地址结构的指针，用来接收连接实体的地址。addr的确切格式由套接字创建时建立的地址族决定。
         * addrlen为客户方套接字地址的长度(字节数)。
         * 参数addr和addrlen存放客户方的地址信息。调用前，参数addr指向一个初始值为空的地址结构，而addrlen的初始值为0；调用accept后，服务器等待从编号为s的套接字上接受客户连接请求，而连接请求是由客户方的connect调用发出的。当有连接请求到达时，accept调用将请求连接队列上的第一个客户方套接字地址及长度放入addr和addrlen，并创建一个与s有相同特性的新套接字号。新的套接字可用于处理服务器并发请求。
   
      ***
      四个套接字系统调用，socket()、bind()、connect()、accept()，可以完成一个完全五元相关的建立。socket指定五元组中的协议元，它的用法与是否为客户或服务器、是否面向连接无关。bind()指定五元组中的本地二元，即本地主机地址和端口号，其用法与是否面向连接有关：在服务器方，无论是否面向连接，均要调用bind；在客户方，若采用面向连接，则可以不调用bind()，而通过connect()自动完成。若采用无连接，客户方必须使用bind()以获得一个唯一的地址。上述讨论仅对客户/服务器模式而言，实际上套接字的使用是非常灵活的，唯一需遵循的原则是进程通信之前，必须建立完整的相关。
      ***

   4. 监听连接──int PASCAL FAR listen(SOCKET s, int backlog)
      此调用用于面向连接服务器，表明它愿意接收连接。listen需在accept之前调用。如果没有错误发生，listen返回0。否则它返回SOCKET_ERROR。listen在执行调用过程中可为没有调用过bind的套接字s完成所必须的连接，并建立长度为backlog的请求连接队列。调用listen是服务器接收一个连接请求的四个步骤中的第三步。它在调用socket分配一个流套接字，且调用bind给s赋于一个名字之后调用，而且一定要在accept之前调用。
      * 参数s标识一个本地已建立、尚未连接的套接字号，服务器愿意从它上面接收请求。
      * backlog表示请求连接队列的最大长度，用于限制排队请求的个数，目前允许的最大值为 5。
   5. 数据传输──send与recv
      当一个连接建立以后，就可以传输数据了。常用的系统调用有send和recv。
      send用于在参数s指定的已连接的数据报或流套接字上发送输出数据，格式为：int PASCAL FAR send(SOCKET s, const char FAR *buf, int len, int flags);如果没有错误发生，send返回总共发送的字节数。否则它返回SOCKET_ERROR。
      * 参数s为已连接的本地套接字描述符。
      * buf指向存有发送数据的缓冲区的指针，其长度由len指定。
      * flags指定传输控制方式，如是否发送带外数据等。
      recv调用用于在参数s指定的已连接的数据报或流套接字上接收输入数据，格式为：int PASCAL FAR recv(SOCKET s, char FAR *buf, int len, int flags);如果没有错误发生，recv返回总共接收的字节数。如果连接被关闭，返回0。否则它返回SOCKET_ERROR。
      * 参数s为已连接的套接字描述符。
      * buf指向接收输入数据缓冲区的指针，其长度由len指定。
      * flags指定传输控制方式，如是否接收带外数据等。
   6. 输入/输出多路复用──select()
      select调用用来检测一个或多个套接字的状态。对每一个套接字来说，这个调用可以请求读、写或错误状态方面的信息。请求给定状态的套接字集合由一个fd_set结构指示。在返回时，此结构被更新，以反映那些满足特定条件的套接字的子集，同时，select调用返回满足条件的套接字的数目，其调用格式为：int PASCAL FAR select(int nfds, fd_set FAR * readfds, fd_set FAR * writefds, fd_set FAR *exceptfds, const struct timeval FAR * timeout);select返回包含在fd_set结构中已准备好的套接字描述符的总数目，或者是发生错误则返回SOCKET_ERROR。
      * 参数nfds指明被检查的套接字描述符的值域，此变量一般被忽略。
      * 参数readfds指向要做读检测的套接字描述符集合的指针，调用者希望从中读取数据。
      * 参数writefds指向要做写检测的套接字描述符集合的指针。
      * exceptfds指向要检测是否出错的套接字描述符集合的指针。
      * timeout指向select函数等待的最大时间，如果设为NULL则为阻塞操作。
   7. 关闭套接字──BOOL PASCAL FAR closesocket(SOCKET s)
      closesocket关闭套接字s，并释放分配给该套接字的资源；如果s涉及一个打开的TCP连接，则该连接被释放。如果没有错误发生，closesocket返回 0。否则返回值SOCKET_ERROR。
      * 参数s待关闭的套接字描述符。
   8. 客户/服务器模式中并发服务典型结构如下
      执行的结果是newsockid与客户的套接字建立相关，子进程启动后，关闭继承下来的主服务器initsockid,并利用新的newsockid与客户通信。主服务器的initsockid可继续等待新的客户连接请求。由于在Unix等抢先多任务系统中，在系统调度下，多个进程可以同时进行。因此，使用并发服务器可以使服务器进程在同一时间可以有多个子进程和不同的客户程序连接、通信。在客户程序看来，服务器可以同时并发地处理多个客户的请求，这就是并发服务器名称的来由。
      ```
      int initsockid, newsockid;
      if ((initsockid = socket(....)) < 0) error("can't create socket");
      if (bind(initsockid,....) < 0) error("bind error");
      if (listen(initsockid , 5) < 0) error("listen error");
      for (;;) {
         newsockid = accept(initsockid, ...) /* 阻塞 */
         if (newsockid < 0) error("accept error");
         if (fork() == 0) { /* 子进程 */
            closesocket(initsockid);
            do(newsockid); /* 处理请求 */
            exit(0);
         }
         closesocket(newsockid); /* 父进程 */
      }
      ```
   9. 客户/服务器模式中重复服务器，其结构如下
      重复服务器在一个时间只能和一个客户程序建立连接，它对多个客户程序的处理是采用循环的方式重复进行，因此叫重复服务器。并发服务器和重复服务器各有利弊：并发服务器可以改善客户程序的响应速度，但它增加了系统调度的开销；重复服务器正好与其相反，因此用户在决定是使用并发服务器还是重复服务器时，要根据应用的实际情况来定。
      ```
      int initsockid, newsockid;
      if ((initsockid = socket(....)) <0 ) error("can't create socket");
      if (bind(initsockid, ....) < 0) error("bind error");
      if (listen(initsockid, 5) < 0) error("listen error");
      for (;;) {
         newsockid = accept(initsockid, ...) /* 阻塞 */
         if (newsockid < 0) error("accept error");
         do(newsockid); /* 处理请求 */
         closesocket(newsockid);
      }
      ```


    


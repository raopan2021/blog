# TCP/IP 的分层管理

### 1.首先分为4层：应用层，传输层，[网络层](https://so.csdn.net/so/search?q=网络层&spm=1001.2101.3001.7020)，链路层。

应用层：决定了向用户提供应用服务时通信的活动。TCP/IP 协议族内预存了各类通用的应用服务。 比如， FTP（File
Transfer Protocol， 文件传输协议） 和 DNS（Domain Name System， 域名系统） 服务就是其中两类。此外，HTTP也属于这一层。

 传输层：传输层对上层应用层， 提供处于网络连接中的两台计算机之间的数据传输。在传输层有两个性质不同的协议： TCP（Transmission Control Protocol， 传输控制协议） 和 UDP（User Data Protocol， 用户数据报协议） 。

网络层（又名网络互连层）：用来处理在网络上流动的数据包。 数据包是网络传输的最小数据单位。 该层规定了通过怎样的路径（所谓的传输路线） 到达对方计算机， 并把数据包传送给对方，网络层所起的作用就是在众多的选项内选择一条传输路线。

链路层（又名数据链路层， 网络接口层）：用来处理连接网络的硬件部分。 包括控制操作系统、 硬件的设备驱
动、 NIC（Network Interface Card， 网络适配器， 即网卡） ， 及光纤等物理可见部分（还包括连接器等一切传输媒介） 。 硬件上的范畴均在链路层的作用范围之内。

###  2.TCP/IP 通信传输流参看下图

![img](https://img-blog.csdnimg.cn/20181114105644209.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3N0cml2ZWI=,size_16,color_FFFFFF,t_70)

发送端在层与层之间传输数据时， 每经过一层时必定会被打上一个该层所属的首部信息。 反之， 接收端在层与层传输数据时， 每经过一层时会把对应的首部消去。其实包装数据信息的过程就是封装。
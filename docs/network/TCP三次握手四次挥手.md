---
title: TCP三次握手四次挥手
---

# TCP 三次握手四次挥手

## TCP 连接建立：三次握手

### 完整流程

TCP 是一种面向连接的传输层协议，通过三次握手（Three-Way Handshake）建立可靠的连接。

```
客户端                        服务端
   |                            |
   |  -------- SYN = 1 --------> |  第一次握手：客户端发送 SYN
   |  -------- seq = x --------> |
   |                            |
   |  <------ SYN = 1 ---------- |  第二次握手：服务端发送 SYN + ACK
   |  <------ ACK = 1 ---------- |
   |  <------ seq = y ---------- |
   |  <------ ack = x + 1 ------ |
   |                            |
   |  -------- ACK = 1 --------> |  第三次握手：客户端发送 ACK
   |  -------- seq = x + 1 ----> |
   |  -------- ack = y + 1 ----> |
   |                            |
   |      ESTABLISHED           |      ESTABLISHED
   |                            |
```

### 各字段含义

- **SYN（Synchronize）**：同步标志，用于发起连接
- **ACK（Acknowledgment）**：确认标志，表示确认收到对方数据
- **seq（Sequence Number）**：序列号，标识当前报文的数据部分第一个字节的序号
- **ack（Acknowledgment Number）**：确认号，表示期望收到的下一个字节的序号

### 为什么需要三次握手？

**第一次握手**：服务端确认「客户端的发送能力正常」

服务端收到 SYN 后知道：客户端可以发送数据。

**第二次握手**：客户端确认「服务端的发送和接收能力都正常」

客户端收到 SYN + ACK 后知道：服务端能接收我的数据，也能发送数据给我。

**第三次握手**：服务端确认「客户端的接收能力正常」

服务端收到 ACK 后知道：客户端能接收我的数据。

三次握手是**最小次数**的握手次数。如果只有两次，服务端无法确认客户端是否具备接收能力；如果四次或更多，则浪费资源。

### 状态转换详解

#### 客户端状态变迁

```
CLOSED                          CLOSED
   |                                |
   |  主动打开，发送 SYN             |
   +---------------------------->   |
   |         SYN_SENT               |
   |                                |
   |  收到 SYN + ACK，发送 ACK       |
   +<----------------------------+  |
   |         ESTABLISHED          |  |
   |                              |  |
```

| 状态 | 说明 |
|------|------|
| CLOSED | 初始状态，连接不存在 |
| SYN_SENT | 已发送 SYN，等待服务器确认 |
| ESTABLISHED | 连接已建立，可以传输数据 |

#### 服务端状态变迁

```
LISTEN                          LISTEN
   |                                |
   |  收到 SYN，发送 SYN + ACK       |
   |  进入 SYN_RCVD                 |
   +---------------------------->   |
   |         SYN_RCVD               |
   |                                |
   |  收到 ACK，进入 ESTABLISHED    |
   +<----------------------------+  |
   |         ESTABLISHED           |  |
   |                              |  |
```

| 状态 | 说明 |
|------|------|
| LISTEN | 服务端被动打开，监听端口等待连接 |
| SYN_RCVD | 收到客户端 SYN，等待确认 |
| ESTABLISHED | 连接已建立 |

---

## 半连接队列（SYN Queue）

### 什么是半连接队列？

服务端在收到客户端的 SYN 后，连接处于 `SYN_RCVD` 状态，此时的连接称为**半连接**（Half-Open Connection）。服务端会将这些半连接放入一个队列中，这个队列就是**半连接队列**，也称 **SYN Queue**。

### 全连接队列（Accept Queue）

完成三次握手后，连接从半连接队列移到**全连接队列**（Accept Queue），也叫 **Accept Queue** 或 **Established Queue**。应用程序调用 `accept()` 时，从全连接队列取出连接。

```
客户端                   服务端内核                     应用层
                          |
SYN --------------------->| (存入 SYN Queue)
                          | SYN_RCVD
                          |
SYN+ACK <-----------------| (发送 SYN+ACK)
                          |
ACK --------------------->| (移到 Accept Queue)
                          | ESTABLISHED
                          |
                          | <-- accept() <-- 连接交付给应用
                          |
```

### 队列溢出与应对

#### 查看队列状态

```bash
# 查看半连接队列溢出统计
cat /proc/net/netstat | grep -i synqueue

# 查看全连接队列溢出统计
ss -lntp

# 观察 accept queue overflow
netstat -s | grep -i "overflow"
```

#### SYN Flood 攻击与对策

SYN Flood 攻击利用半连接队列的特性：攻击者发送大量 SYN 但不完成三次握手，耗尽半连接队列资源。

**对策1：调整队列大小**

```bash
# 调整半连接队列最大长度
echo 4096 > /proc/sys/net/ipv4/tcp_max_syn_backlog

# 调整全连接队列大小（使用 listen 时指定 backlog）
```

**对策2：SYN Cookies**

当半连接队列满时，使用 Cookie 机制——不存储半连接状态，而是将相关信息编码在 seq 中发回给客户端，第三次握手时验证。

```bash
# 开启 SYN Cookies
echo 1 > /proc/sys/net/ipv4/tcp_syncookies

# 永久生效
sysctl -w net.ipv4.tcp_syncookies=1
```

```python
# Python 示例：设置 socket 为半连接溢出时使用 cookies
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(('0.0.0.0', 8080))
sock.listen(128)  # backlog 建议 128-256
```

---

## TCP 连接断开：四次挥手

### 完整流程

```
客户端                        服务端
   |                            |
   |  -------- FIN = 1 --------> |  第一次挥手：主动方发送 FIN
   |  -------- seq = u ----------|
   |                            |
   |  <------ ACK = 1 --------- |  第二次挥手：被动方发送 ACK
   |  <------ ack = u + 1 ------|
   |                            |
   |        (客户端 -> 服务端方向关闭)  |
   |                            |
   |  <------ FIN = 1 --------- |  第三次挥手：被动方发送 FIN
   |  <------ seq = v ----------|
   |                            |
   |  -------- ACK = 1 --------> |  第四次挥手：主动方发送 ACK
   |  -------- ack = v + 1 ---->|
   |                            |
   |        TIME_WAIT           |
   |    (等待 2MSL = 60s)       |
   |                            |
   |         CLOSED             |         CLOSED
   |                            |
```

### 为什么需要四次挥手？

TCP 是**全双工**（Full-Duplex）协议，两个方向各自独立关闭：

1. **第一次挥手**：客户端通知服务端「我不再发送数据了」（但仍能接收）
2. **第二次挥手**：服务端确认收到通知
3. **第三次挥手**：服务端通知客户端「我也不再发送数据了」
4. **第四次挥手**：客户端确认收到，客户端等待 2MSL 后关闭

如果把第二次和第三次合并（即三次挥手），会丢失服务端「数据已发送完毕」的通知，导致主动方可能没有收到所有数据就关闭了连接。

### TIME_WAIT 状态详解

主动关闭方在收到第四次挥手的 ACK 后，会进入 `TIME_WAIT` 状态，等待 **2MSL**（Maximum Segment Lifetime）后才转为 CLOSED。

#### MSL

MSL（Maximum Segment Lifetime）是 TCP 报文在网络中的最大生存时间，通常为 60 秒（Linux 可通过 `sysctl net.ipv4.tcp_fin_timeout` 调整）。

#### TIME_WAIT 的作用

1. **确保最后的 ACK 能到达被动方**：如果第四次挥手的 ACK 丢失，被动方会重发 FIN，主动方需要在 TIME_WAIT 期间响应这个重发的 FIN
2. **让旧连接的报文在网络中消散**：等待 2MSL 可以让本次连接产生的所有报文都从网络中消失，防止它们干扰后续新连接

#### TIME_WAIT 过多的问题与应对

在高并发短连接场景下，TIME_WAIT 状态的连接会积累，占用大量端口和内存。

```bash
# 查看 TIME_WAIT 连接数
ss -ant | grep TIME-WAIT | wc -l

# 调整 TIME_WAIT 回收策略
sysctl -w net.ipv4.tcp_tw_reuse=1     # 开启重用（客户端建议开启）
sysctl -w net.ipv4.tcp_tw_recycle=1   # 开启快速回收（已被废弃，NAT 环境有问题）

# 调整 MSL
sysctl -w net.ipv4.tcp_fin_timeout=30 # 减少 MSL 到 30s
```

```python
# 代码层面：使用 SO_REUSEADDR 允许绑定处于 TIME_WAIT 的地址
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(('0.0.0.0', 8080))
sock.listen(128)
```

### 状态总览

| 状态 | 说明 |
|------|------|
| CLOSED | 结束状态，连接不存在 |
| LISTEN | 被动打开，监听端口 |
| SYN_SENT | 已发送 SYN |
| SYN_RCVD | 收到 SYN，等待确认 |
| ESTABLISHED | 连接已建立，正常数据传输 |
| FIN_WAIT_1 | 已发送 FIN，等待对方 ACK |
| FIN_WAIT_2 | 收到 ACK，等待对方 FIN |
| CLOSING | 双方同时发送 FIN，进入此状态 |
| TIME_WAIT | 等待 2MSL 后关闭 |
| CLOSE_WAIT | 收到 FIN，等待应用层关闭 |
| LAST_ACK | 最后一次 ACK 等待 |

### 常见面试问题

**Q1：为什么握手是三次，挥手是四次？**

握手时服务端收到 SYN 后可以同时将 SYN + ACK 一起发送（因为此时连接还未建立，发送 ACK 无需等待应用层确认）。挥手时被动方收到 FIN 后需要先回复 ACK 确认，但关闭连接的操作需要应用层配合，所以 FIN 的发送可能延迟，因此需要分开。

**Q2：TCP 为什么需要 TIME_WAIT？**

确保最后的 ACK 能到达对方（如果丢失会被重发）；等待网络中旧连接的报文完全消散，防止干扰新连接。

**Q3：服务器出现大量 CLOSE_WAIT 是什么原因？**

通常是代码问题——服务端收到客户端的 FIN 后没有调用 `close()` 关闭连接，导致连接一直处于 CLOSE_WAIT 状态。需要检查代码中 `socket.close()` 是否被正确调用。

**Q4：SYN Queue 和 Accept Queue 的区别？**

- SYN Queue（半连接队列）：存放处于 `SYN_RCVD` 状态的连接（三次握手未完成）
- Accept Queue（全连接队列）：存放已完成三次握手、等待应用 `accept()` 的连接

[[返回 网络首页|../index]]

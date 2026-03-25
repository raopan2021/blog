---
title: WebSocket 与 SSE
---

# WebSocket 与 SSE

## HTTP 请求响应模型

HTTP 是「一问一答」模式，服务端不能主动推送：

```
客户端 → 请求 → 服务端
客户端 ← 响应 ← 服务端

问题：聊天、实时数据、游戏等场景需要服务端主动推送
```

## 解决方案对比

| 方案 | 原理 | 实时性 | 兼容性 | 推荐场景 |
|------|------|--------|--------|---------|
| 轮询 | 定时发请求 | 差 | 最好 | 低实时需求 |
| Long Polling | 长轮询 | 中 | 好 | 适中 |
| WebSocket | 双向长连接 | 好 | 好 | 实时聊天、游戏 |
| SSE | 服务端推送 | 好 | 差（仅浏览器） | 通知、动态更新 |

## WebSocket

### 原理

```
1. HTTP 握手（Upgrade 请求）
客户端 → GET /ws HTTP/1.1
          Upgrade: websocket
          Connection: Upgrade

2. 服务端响应 101 Switching Protocols
服务端 ← HTTP/1.1 101 Switching Protocols

3. 双方进入 WebSocket 模式（全双工通信）
客户端 ↔ 服务端（平等对话）
```

### 客户端代码

```javascript
// 创建连接
const ws = new WebSocket('wss://example.com/ws')

// 连接成功
ws.onopen = () => {
    console.log('连接已建立')
    ws.send('Hello, Server!')  // 发送消息
}

// 接收消息
ws.onmessage = (event) => {
    console.log('收到:', event.data)
}

// 连接关闭
ws.onclose = () => {
    console.log('连接已关闭')
}

// 发生错误
ws.onerror = (error) => {
    console.error('错误:', error)
}

// 手动关闭
ws.close()
```

### 服务端代码（Node.js）

```javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
    console.log('新客户端连接')

    // 接收消息
    ws.on('message', (message) => {
        console.log('收到:', message.toString())

        // 广播给所有客户端
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('广播: ' + message)
            }
        })
    })

    // 发送消息
    ws.send('欢迎连接！')

    // 定时推送
    const timer = setInterval(() => {
        ws.send('服务器时间: ' + new Date().toLocaleTimeString())
    }, 1000)

    // 清理
    ws.on('close', () => {
        clearInterval(timer)
        console.log('客户端断开')
    })
})
```

### 帧结构

```
WebSocket 帧：
┌─────────────┬─────────────┬─────────────┬──────────────┐
│ FIN(1) │ RSV(3) │ Opcode(4) │ MASK(1) │ Payload len(7) │
├─────────────┼─────────────┼─────────────┼──────────────┤
│                  Masking-key (32)                          │
├─────────────┼─────────────┼─────────────┼──────────────┤
│                     Payload Data                          │
└─────────────────────────────────────────────────────────┘

Opcode: 0x1=文本帧, 0x2=二进制帧, 0x8=关闭帧
```

### 心跳机制

```javascript
// 客户端
const HEARTBEAT_INTERVAL = 30000
let timer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
    }
}, HEARTBEAT_INTERVAL)

ws.onmessage = (event) => {
    if (event.data === 'pong') {
        console.log('心跳正常')
    }
}

// 服务端
ws.on('message', (data) => {
    if (data === 'ping') {
        ws.send('pong')
    }
})
```

## Server-Sent Events（SSE）

### 原理

```
HTTP 连接建立后，服务端持续向客户端推送数据
客户端只能接收，不能发送（单向）
```

### 客户端代码

```javascript
const eventSource = new EventSource('/api/events')

eventSource.onopen = () => {
    console.log('连接建立')
}

eventSource.onmessage = (event) => {
    console.log('收到:', event.data)
}

eventSource.addEventListener('custom', (event) => {
    console.log('自定义事件:', event.data)
})

eventSource.onerror = (error) => {
    console.error('错误:', error)
    eventSource.close()
}
```

### 服务端代码（Node.js + Express）

```javascript
app.get('/api/events', (req, res) => {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 每秒发送时间
    const timer = setInterval(() => {
        res.write(`data: ${new Date().toLocaleTimeString()}\n\n`)
    }, 1000)

    // 客户端断开时清理
    req.on('close', () => {
        clearInterval(timer)
        console.log('客户端断开')
    })
})
```

## WebSocket vs SSE

| 特性 | WebSocket | SSE |
|------|-----------|-----|
| 方向 | 全双工 | 单向（服务端→客户端） |
| HTTP | 需要 HTTP Upgrade | 普通 HTTP 即可 |
| 重连 | 需自行实现 | 自动重连 |
| 二进制 | 支持 | 需编码 |
| 浏览器兼容 | 较好 | 较差（IE 不支持） |
| 穿过防火墙 | 可能被拦截 | 通常没问题 |
| 负载均衡 | 需 sticky session | 普通 HTTP 负载均衡即可 |

## 使用建议

```
需要双向通信（聊天、游戏）→ WebSocket
只需要服务端推送（通知、实时数据）→ SSE
需要兼容性好 → Long Polling
```

[[返回 计算机网络首页|../index]]

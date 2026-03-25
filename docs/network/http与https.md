---
title: HTTP 与 HTTPS
---

# HTTP 与 HTTPS

## HTTP 基础

HTTP（HyperText Transfer Protocol）是浏览器和服务器之间的通信协议。

### 请求结构

```

请求行：GET /index.html HTTP/1.1
请求头：Host: example.com
       User-Agent: Mozilla/5.0
       Accept: text/html
       Cookie: session_id=abc123

请求体：（GET 请求通常为空，POST 请求有数据）
```


### 响应结构

```

状态行：HTTP/1.1 200 OK
响应头：Content-Type: text/html
        Content-Length: 1234
        Server: nginx/1.20.1
        Set-Cookie: session=xyz

响应体：<html>...</html>
```


### 常见状态码

| 状态码 | 含义 |
|--------|------|
| 200 | OK，请求成功 |
| 301 | 永久重定向 |
| 302 | 临时重定向 |
| 304 | Not Modified，缓存未过期 |
| 400 | Bad Request，请求语法错误 |
| 401 | Unauthorized，未认证 |
| 403 | Forbidden，无权限 |
| 404 | Not Found，资源不存在 |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### HTTP 方法

| 方法 | 语义 | 幂等 | 安全性 |
|------|------|------|--------|
| GET | 获取资源 | ✅ | ✅ |
| POST | 创建资源 | ❌ | ✅ |
| PUT | 更新资源（整体） | ✅ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |
| PATCH | 部分更新 | ❌ | ❌ |
| HEAD | 获取响应头 | ✅ | ✅ |
| OPTIONS | 预检请求 | ✅ | ✅ |

## HTTPS 加密原理

HTTPS = HTTP + TLS/SSL

```

TLS 握手流程：

1. 客户端 → 服务器：ClientHello（支持的加密套件）
2. 服务器 → 客户端：Certificate（服务器证书 + 公钥）
3. 客户端 → 服务器：ClientKeyExchange（用公钥加密的随机数）
4. 双方用随机数生成对称密钥
5. 之后的通信用对称密钥加密
```


### 对称加密 vs 非对称加密

| 类型 | 特点 | 代表算法 |
|------|------|---------|
| 对称加密 | 加密解密用同一密钥，速度快 | AES、DES |
| 非对称加密 | 公钥加密，私钥解密，速度慢 | RSA、ECC |

HTTPS 实际使用：先用非对称加密传递对称密钥，之后用对称加密通信。

### SSL 证书

```bash
# 证书类型
DV（Domain Validation）：域名验证，最快
OV（Organization Validation）：组织验证
EV（Extended Validation）：扩展验证，地址栏变绿
```


## HTTP/1.1 特性

### 持久连接（Keep-Alive）

```bash
# 一次 TCP 连接，多个 HTTP 请求
Connection: keep-alive    # 保持连接
Connection: close          # 关闭连接
```


### 管道化（Pipeline）

```

请求1 → 请求2 → 请求3 →
← 响应1 ← 响应2 ← 响应3
```


### 队头阻塞

```

问题：HTTP 1.1 的管道化不完善
      响应必须按顺序返回
      前面的请求慢会阻塞后面的请求

解决：
1. 合并请求（雪碧图、合并 JS/CSS）
2. 域名分片
3. HTTP/2 多路复用
```


## HTTP/2 特性

### 多路复用

```

一个 TCP 连接，并行传输多个请求/响应
请求1 ──→ 响应1 ←──
请求2 ──→ 响应2 ←──
请求3 ──→ 响应3 ←──
（在一个连接上并行）
```


### Header 压缩

```

使用 HPACK 算法压缩头部
维护头部表，已发送过的头部只传索引
```


### Server Push

```

服务器主动推送资源
客户端请求 HTML → 服务器主动推送 CSS/JS
```


## HTTP/3 特性

```

HTTP/3 = HTTP/2 + QUIC（基于 UDP）

优势：
- 0-RTT 握手（首次连接更快）
- 不存在 TCP 队头阻塞
- 连接迁移（IP 变了不断开）
```


## 常用 HTTP 头

### 请求头

```bash
Host: example.com              # 目标域名
User-Agent: Mozilla/5.0...     # 浏览器标识
Accept: text/html,application/json  # 接受的类型
Accept-Language: zh-CN,en     # 语言偏好
Accept-Encoding: gzip, deflate  # 支持的压缩方式
Authorization: Bearer token     # 认证令牌
Cookie: session=abc123         # Cookie
Referer: https://google.com     # 来源页面
```


### 响应头

```bash
Content-Type: text/html; charset=utf-8  # 内容类型
Content-Length: 1234             # 内容长度
Content-Encoding: gzip           # 压缩方式
Cache-Control: max-age=3600     # 缓存控制
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Strict
Location: https://new.com       # 重定向目标
Access-Control-Allow-Origin: *  # CORS 跨域
```


## HTTPS 配置（Nginx）

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}

# HTTP 强制跳转到 HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```


[[返回 计算机网络首页|../index]]

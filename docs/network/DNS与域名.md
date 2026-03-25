---
title: DNS 与域名
---

# DNS 与域名

## DNS 概述

DNS（Domain Name System）将域名解析为 IP 地址。

```

用户输入 example.com
       ↓
浏览器检查自身 DNS 缓存
       ↓
操作系统检查 hosts 文件
       ↓
向配置的 DNS 服务器发起查询
       ↓
DNS 服务器递归/迭代查询
       ↓
返回 IP 地址
```


## DNS 查询流程

```

浏览器 → 递归 DNS 服务器 → 根域名服务器 → .com 顶级域名 →权威域名服务器
```


### 递归查询

```

客户端 → 本地 DNS 服务器 → 其他 DNS 服务器
（只拿最终结果）
```


### 迭代查询

```

根 DNS → .com DNS → example.com DNS
（每一步都告诉你下一步去哪）
```


## 记录类型

| 记录类型 | 说明 | 示例 |
|---------|------|------|
| A | 域名指向 IPv4 | `example.com → 93.184.216.34` |
| AAAA | 域名指向 IPv6 | `example.com → 2606:2800:220:1::` |
| CNAME | 域名别名 | `www.example.com → example.com` |
| MX | 邮件交换 | `example.com → mail.example.com` |
| TXT | 文本记录 | 验证域名所有权 |
| NS | 域名服务器 | `example.com → ns1.example.com` |
| PTR | IP 反向解析 | `1.2.3.4.in-addr.arpa` |

```bash
# 查看 DNS 记录
dig example.com            # A 记录
dig example.com MX         # MX 记录
dig example.com CNAME      # CNAME
dig @8.8.8.8 example.com  # 指定 DNS 服务器

# Windows
nslookup example.com

# 追踪 DNS 解析路径
traceroute example.com    # Linux
tracert example.com       # Windows
```


## CDN 原理

```

用户请求内容
       ↓
CDN DNS 返回最近节点的 IP
       ↓
用户访问 CDN 边缘节点
       ↓
节点无缓存 → 回源站拉取 → 缓存 → 返回
```


```

CDN 优势：
- 就近访问（速度快）
- 隐藏真实 IP
- 减轻源站压力
- 抗 DDoS
```


## 常用公共 DNS

| DNS 服务商 | DNS 地址 |
|------------|---------|
| Google | 8.8.8.8 / 8.8.4.4 |
| Cloudflare | 1.1.1.1 / 1.0.0.1 |
| 阿里云 | 223.5.5.5 / 223.6.6.6 |
| 腾讯 DNSPod | 119.29.29.29 / 182.254.116.116 |

## 域名解析配置

```bash
# /etc/hosts（优先级最高）
127.0.0.1 localhost
192.168.1.100 myapp.local

# /etc/resolv.conf（DNS 配置）
nameserver 8.8.8.8
nameserver 1.1.1.1

# 查看 DNS 缓存（Linux 通常没有系统级缓存）
systemd-resolve --status
```


## HTTP DNS

```javascript
// 传统 DNS：浏览器 → 域名 → DNS 解析 → IP → 连接
// HTTP DNS：直接使用域名，DNS 解析在后台完成

// DNS 预解析（减少等待时间）
<link rel="dns-prefetch" href="//static.example.com">

// 预连接（DNS + TCP 握手）
<link rel="preconnect" href="https://cdn.example.com">
```


## 常见 DNS 攻击

| 攻击类型 | 原理 | 防御 |
|---------|------|------|
| DNS 劫持 | 篡改 DNS 响应 | DNSSEC |
| DNS 污染 | 注入虚假响应 | 知名 DNS |
| DDoS | 攻击 DNS 服务器 | CDN 分散流量 |
| 缓存投毒 | 污染 DNS 缓存 | 短期 TTL |

[[返回 计算机网络首页|../index]]

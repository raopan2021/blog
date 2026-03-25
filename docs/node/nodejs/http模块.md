# http 模块

> http 模块用于创建 HTTP 服务器和客户端

## 创建 HTTP 服务器

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // req: 请求对象（IncomingMessage）
  // res: 响应对象（ServerResponse）

  // 设置响应头
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  // 获取请求路径
  const url = req.url
  console.log('请求路径:', url)

  // 获取请求方法
  const method = req.method
  console.log('请求方法:', method)

  // 获取请求头
  const headers = req.headers
  console.log('请求头:', headers)

  // 获取查询参数
  const { searchParams } = new URL(url, `http://${req.headers.host}`)
  const name = searchParams.get('name')

  // 发送响应
  res.statusCode = 200 // 状态码
  res.end('Hello World')
})

// 监听端口
server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

## 获取请求体数据

```js
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''

    // 接收数据（chunk 为 Buffer）
    req.on('data', (chunk) => {
      body += chunk
    })

    // 数据接收完毕
    req.on('end', () => {
      console.log('请求体:', body)
      // 解析 JSON
      try {
        const data = JSON.parse(body)
        console.log('JSON数据:', data)
      } catch (e) {
        console.log('非JSON格式')
      }
      res.end('收到数据')
    })
  }
})
```

## 创建 HTTP 客户端（发起请求）

```js
// 发送 GET 请求
http.get('http://localhost:3000/api', (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    console.log('响应数据:', data)
  })
})

// 发送 POST 请求
const data = JSON.stringify({ name: '张三', age: 18 })

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/user',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}

const req = http.request(options, (res) => {
  let body = ''

  res.on('data', (chunk) => {
    body += chunk
  })

  res.on('end', () => {
    console.log('响应状态:', res.statusCode)
    console.log('响应数据:', body)
  })
})

req.write(data)
req.end()
```

## 使用 Axios（推荐）

> 实际开发中更推荐使用 axios 或其他 HTTP 库

```bash
pnpm add axios
```

```js
import axios from 'axios'

// GET 请求
const res = await axios.get('http://localhost:3000/api', {
  params: { name: '张三' }
})
console.log(res.data)

// POST 请求
const res = await axios.post('http://localhost:3000/api', {
  name: '张三',
  age: 18
})
console.log(res.data)

// 设置请求头
const res = await axios.get('http://localhost:3000/api', {
  headers: {
    Authorization: 'Bearer token'
  }
})
```

## 常用状态码

| 状态码 | 说明 |
|--------|------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 301 | Moved Permanently |
| 302 | Found |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 设置不同类型响应

```js
const server = http.createServer((req, res) => {
  const url = req.url

  // 返回 HTML
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<h1>首页</h1>')
  }

  // 返回 JSON
  else if (url === '/api/user') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ name: '张三', age: 18 }))
  }

  // 返回 404
  else {
    res.statusCode = 404
    res.end('Not Found')
  }
})
```

## Express 框架（更便捷）

```bash
pnpm add express
```

```js
import express from 'express'

const app = express()

// 解析 JSON 请求体
app.use(express.json())

// GET 请求
app.get('/api/user/:id', (req, res) => {
  const { id } = req.params
  res.json({ id, name: '张三' })
})

// POST 请求
app.post('/api/user', (req, res) => {
  const { name, age } = req.body
  res.json({ success: true, data: { name, age } })
})

// 启动服务器
app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

# Express 框架

> Express 是一个简洁、灵活的 Node.js Web 应用框架

## 安装

```bash
pnpm add express
```

## 第一个 Express 应用

```js
const express = require('express')
const app = express()

// 路由
app.get('/', (req, res) => {
  res.send('Hello World')
})

// 监听端口
app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

## 基本路由

### HTTP 方法

```js
// GET 请求
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: '张三' }])
})

// POST 请求
app.post('/users', (req, res) => {
  res.json({ success: true })
})

// PUT 请求（完整更新）
app.put('/users/:id', (req, res) => {
  const { id } = req.params
  res.json({ success: true, id })
})

// DELETE 请求
app.delete('/users/:id', (req, res) => {
  const { id } = req.params
  res.json({ success: true })
})

// PATCH 请求（部分更新）
app.patch('/users/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body
  res.json({ success: true })
})
```

## 请求对象

```js
app.get('/user/:id', (req, res) => {
  // URL 参数
  console.log(req.params.id)  // 路由参数
  console.log(req.query)       // 查询参数 ?name=xxx
  console.log(req.body)         // 请求体（需配置中间件）
  console.log(req.headers)      // 请求头
  console.log(req.cookies)     // Cookie
  console.log(req.method)       // 请求方法
  console.log(req.url)          // 请求 URL
  console.log(req.path)         // 路径名
})
```

## 响应对象

```js
app.get('/', (req, res) => {
  // 发送响应
  res.send('Hello')              // 发送文本/HTML
  res.json({ name: '张三' })     // 发送 JSON
  res.jsonp({ name: '张三' })    // 发送 JSONP
  res.sendFile('./index.html')   // 发送文件
  res.download('./file.pdf')      // 下载文件
  res.redirect('/login')         // 重定向
  res.status(404).send('Not Found') // 设置状态码
  res.setHeader('Content-Type', 'text/plain') // 设置响应头
})
```

## 中间件

中间件是 Express 的核心概念。

### 什么是中间件

```js
// 中间件函数
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next() // 必须调用 next()
}

// 使用中间件
app.use(logger)

// 全局中间件
app.use((req, res, next) => {
  console.log('所有请求都会经过这里')
  next()
})
```

### 常见中间件

```js
const express = require('express')
const app = express()

// 解析 JSON 请求体
app.use(express.json())

// 解析 URL-encoded 请求体
app.use(express.urlencoded({ extended: true }))

// 解析 Cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// 静态文件服务
app.use(express.static('public'))

// CORS 跨域
const cors = require('cors')
app.use(cors())

// 路由日志
app.use((req, res, next) => {
  console.log(`${new Date()} ${req.method} ${req.url}`)
  next()
})
```

### 路由级中间件

```js
// 路由组
const adminRouter = express.Router()

// 管理员验证中间件
adminRouter.use((req, res, next) => {
  if (req.query.isAdmin === 'true') {
    next()
  } else {
    res.status(403).send('禁止访问')
  }
})

adminRouter.get('/dashboard', (req, res) => {
  res.send('管理员面板')
})

app.use('/admin', adminRouter)
```

## 路由组织

### 基础路由

```js
const express = require('express')
const router = express.Router()

// 用户列表
router.get('/', (req, res) => {
  res.json([{ id: 1 }, { id: 2 }])
})

// 用户详情
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id })
})

// 创建用户
router.post('/', (req, res) => {
  res.json({ success: true, ...req.body })
})

// 更新用户
router.put('/:id', (req, res) => {
  res.json({ success: true })
})

// 删除用户
router.delete('/:id', (req, res) => {
  res.json({ success: true })
})

module.exports = router
```

### 使用路由模块

```js
const userRouter = require('./routes/users')

app.use('/users', userRouter)
```

## 错误处理

### 同步错误

```js
app.get('/', (req, res) => {
  throw new Error('出错了！')
})
```

### 异步错误

```js
app.get('/', async (req, res, next) => {
  try {
    const data = await fetchData()
    res.json(data)
  } catch (err) {
    next(err) // 传递给错误处理中间件
  }
})
```

### 错误处理中间件

```js
// 错误处理中间件（4个参数）
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || '服务器错误'
  })
})
```

## 模板引擎

### EJS

```bash
pnpm add ejs
```

```js
app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index', { title: '首页', name: '张三' })
})
```

### HTML 模板

```js
// 直接发送 HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
```

## 最佳实践

1. **路由模块化**：使用 Router 分离路由
2. **错误处理**：所有路由都需要错误处理
3. **中间件顺序**：注意中间件的注册顺序
4. **安全中间件**：helmet、cors、rate-limit
5. **环境配置**：使用环境变量区分开发/生产环境

# 网络请求

> React Native 中发起 HTTP 请求的几种方式

## 一、Fetch API（推荐）

### 1.1 基础 GET 请求

```tsx
const fetchData = async () => {
  try {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    setData(json)
  } catch (error) {
    console.error('请求失败:', error)
  }
}
```

### 1.2 POST 请求

```tsx
const postData = async () => {
  const res = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token'
    },
    body: JSON.stringify({ name: '张三', age: 25 })
  })
  const data = await res.json()
}
```

### 1.3 超时处理

```tsx
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return await res.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时')
    }
    throw error
  }
}
```

## 二、Axios（功能更丰富）

```bash
npm install axios
```

```tsx
import axios from 'axios'

// 创建实例
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器
api.interceptors.request.use(async (config) => {
  const token = await getToken()  // 获取 token
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // token 过期处理
      logout()
    }
    return Promise.reject(error)
  }
)

// 使用
const data = await api.get('/users/1')
const result = await api.post('/users', { name: '张三' })
```

## 三、WebSocket

```tsx
const [messages, setMessages] = useState([])

// 建立连接
const ws = useRef(new WebSocket('wss://api.example.com/ws'))

useEffect(() => {
  ws.current.onopen = () => console.log('连接成功')
  ws.current.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    setMessages(prev => [...prev, msg])
  }
  ws.current.onerror = () => console.log('WebSocket 错误')
  ws.current.onclose = () => console.log('连接关闭')

  return () => ws.current.close()
}, [])

// 发送消息
const sendMessage = (text) => {
  ws.current.send(JSON.stringify({ type: 'chat', content: text }))
}
```

## 四、上传文件

```tsx
const uploadFile = async (uri, fileName) => {
  const formData = new FormData()
  formData.append('file', {
    uri,
    name: fileName,
    type: 'image/jpeg'
  })

  const res = await fetch('https://api.example.com/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })
  return await res.json()
}
```

## 五、注意事项

1. **HTTP 明文**：生产环境必须使用 HTTPS
2. **iOS ATS**：iOS 9+ 默认禁止 HTTP，需在 Info.plist 配置
3. **Android 明文**：Android 9+ 默认禁止 HTTP，需配置 networkSecurityConfig
4. **Cookie**：iOS 自动管理，Android 需手动处理

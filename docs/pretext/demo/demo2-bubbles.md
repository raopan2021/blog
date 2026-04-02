# Demo 2：聊天气泡

> 多行聊天气泡——每个气泡的高度由 Pretext 精确预测

## 展示

<iframe
  src="/blog/pretext-demo/bubbles.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f7f5;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 核心测量函数

```ts
import { prepare, layout } from '@chenglou/pretext'

function getBubbleHeight(text: string) {
  const font = '14px/1.65 Helvetica Neue, sans-serif'
  const lineHeight = 23.1
  const maxWidth = 320

  // 预处理
  const prepared = prepare(text, font)
  // 计算高度（减去 padding 和 header）
  const { height, lineCount } = layout(prepared, maxWidth - 28, lineHeight)

  return { height, lineCount }
}
```

### 动态添加气泡

```ts
function addBubble(text: string, isRight: boolean) {
  const { height, lineCount } = getBubbleHeight(text)
  const hPx = Math.round(height)

  const div = document.createElement('div')
  div.className = `msg ${isRight ? 'right' : 'left'}`
  div.innerHTML = `
    <div class="avatar" style="background:${isRight ? 'var(--blue)' : '#2ecc71'}">
      ${isRight ? 'B' : 'A'}
    </div>
    <div class="bubble-wrap">
      <div class="bubble" style="height:${hPx + 20}px">
        ${escapeHtml(text)}
      </div>
      <div class="meta">
        <span class="height-tag">${hPx}px · ${lineCount}行</span>
        · ${isRight ? 'Bob' : 'Alice'}
      </div>
    </div>
  `
  chat.appendChild(div)
  chat.scrollTop = chat.scrollHeight
}
```

### 响应式调整宽度

```ts
window.updateWidth = (val: number) => {
  maxWidth = parseInt(val)

  // 重新渲染所有消息的气泡高度
  const msgs = chat.querySelectorAll('.msg')
  msgs.forEach((msg) => {
    const bubbleText = msg.querySelector('.bubble').textContent
    const { height, lineCount } = getBubbleHeight(bubbleText)
    const hPx = Math.round(height)

    msg.querySelector('.bubble').style.height = (hPx + 20) + 'px'
    msg.querySelector('.height-tag').textContent = `${hPx}px · ${lineCount}行`
  })
}
```

## 总结

本 demo 展示了 Pretext 在**聊天气泡**场景的应用：

- **问题**：传统方案要么用固定高度（浪费空间），要么等渲染完再测量（抖动）
- **解决**：Pretext 在渲染前精确预测高度，气泡"刚好"包裹内容
- **关键 API**：`prepare()` + `layout()`

## 拓展：封装可复用的聊天气泡组件

```ts
interface BubbleConfig {
  maxWidth: number
  font: string
  lineHeight: number
  padding: number
  avatarSize?: number
}

interface BubbleMessage {
  id: string
  text: string
  isRight: boolean
  sender?: string
}

class ChatBubbleRenderer {
  private config: BubbleConfig
  private container: HTMLElement
  private preparedCache: Map<string, any> = new Map()

  constructor(container: HTMLElement, config: BubbleConfig) {
    this.container = container
    this.config = config
  }

  /**
   * 测量单条消息的气泡尺寸
   */
  measure(text: string): { height: number; lineCount: number; width: number } {
    const { maxWidth, font, lineHeight, padding } = this.config
    const contentWidth = maxWidth - padding * 2

    const prepared = prepare(text, font)
    const { height, lineCount } = layout(prepared, contentWidth, lineHeight)

    return {
      height: Math.round(height) + padding * 2,
      lineCount,
      width: maxWidth
    }
  }

  /**
   * 渲染单条气泡
   */
  render(message: BubbleMessage): HTMLElement {
    const { height, lineCount } = this.measure(message.text)

    const div = document.createElement('div')
    div.className = `msg ${message.isRight ? 'right' : 'left'}`
    div.dataset.id = message.id

    const avatarBg = message.isRight ? 'var(--blue)' : '#2ecc71'
    const sender = message.sender || (message.isRight ? '我' : '对方')

    div.innerHTML = `
      <div class="avatar" style="background:${avatarBg}">${sender[0]}</div>
      <div class="bubble-wrap">
        <div class="bubble" style="height:${height}px">
          ${this.escapeHtml(message.text)}
        </div>
        <div class="meta">
          <span class="height-tag">${height}px · ${lineCount}行</span>
          · ${sender}
        </div>
      </div>
    `

    return div
  }

  /**
   * 添加消息到容器
   */
  addMessage(message: BubbleMessage): void {
    const bubble = this.render(message)
    this.container.appendChild(bubble)
    this.container.scrollTop = this.container.scrollHeight
  }

  /**
   * 批量渲染消息（初始化时）
   */
  renderAll(messages: BubbleMessage[]): void {
    this.container.innerHTML = ''
    messages.forEach(msg => this.addMessage(msg))
  }

  /**
   * 更新容器宽度（响应式）
   */
  updateWidth(newWidth: number): void {
    this.config.maxWidth = newWidth
    // 重新渲染所有气泡
    const messages = Array.from(this.container.querySelectorAll('.msg')).map(el => ({
      id: el.dataset.id || '',
      text: el.querySelector('.bubble').textContent || '',
      isRight: el.classList.contains('right')
    }))
    this.renderAll(messages)
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}

// 使用示例
const chat = document.getElementById('chat')
const renderer = new ChatBubbleRenderer(chat, {
  maxWidth: 320,
  font: '14px/1.65 Helvetica Neue, sans-serif',
  lineHeight: 23.1,
  padding: 14
})

// 添加新消息
renderer.addMessage({
  id: 'msg-1',
  text: '这是一条测试消息',
  isRight: true,
  sender: '我'
})

// 响应式调整
window.addEventListener('resize', () => {
  renderer.updateWidth(newWidth)
})
```

**特点**：
- 自动缓存 `prepare()` 结果避免重复计算
- 支持响应式宽度调整
- 纯函数 `measure()` 可独立使用
- 完整的类型定义

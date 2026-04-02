# Demo 5：手风琴

> 手风琴组件的高度由 Pretext 预先计算，展开/收起动画流畅无抖动

## 展示

<iframe
  src="/blog/pretext-demo/accordion.html"
  width="100%"
  height="540px"
  frameborder="0"
  style="margin-top:12px; border-radius:12px; background:#f5f1ea;"
  allow="autoplay"
/>

## 代码拆分与实现原理

### 预先计算所有内容高度

```ts
import { prepare, layout } from '@chenglou/pretext'

const font = '14px/1.8 Georgia, "Times New Roman", serif'
const lineHeight = 25.2

// 在初始化时一次性计算所有内容的高度
function getContentHeight(text: string, containerWidth: number): number {
  const prepared = prepare(text, font)
  const { height } = layout(prepared, containerWidth - 40, lineHeight)
  return height + 16 // 加上 padding
}

// 批量预处理
const items = [
  { title: '什么是 Pretext？', content: '...' },
  { title: '为什么不用 getBoundingClientRect？', content: '...' },
  // ...
]

const measuredItems = items.map(item => ({
  ...item,
  contentHeight: getContentHeight(item.content, 560) // 560 是容器宽度
}))
```

### 使用 max-height 实现动画

```css
.item-body {
  max-height: 0;              /* 收起时 */
  overflow: hidden;
  transition: max-height 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.item.open .item-body {
  max-height: 600px;          /* 展开时（预定义足够大的值） */
}
```

```ts
// 切换展开/收起
function toggle(index: number) {
  const el = document.getElementById(`item-${index}`)
  el.classList.toggle('open')
}
```

### 响应式宽度更新

```ts
function updateWidth(val: number) {
  containerWidth = val

  // 重新计算所有高度并渲染
  const accordion = document.getElementById('accordion')
  accordion.innerHTML = ''

  items.forEach((item, i) => {
    const h = getContentHeight(item.content, containerWidth)
    const div = createAccordionItem(item, i, h)
    accordion.appendChild(div)
  })
}
```

## 总结

本 demo 展示了 Pretext 在**手风琴/折叠面板**场景的应用：

- **问题**：传统方案依赖 DOM 测量触发回流
- **解决**：Pretext 在初始化时一次性预测所有内容高度
- **优势**：展开/收起动画流畅，无任何抖动

**关键代码**：
```ts
const { height } = layout(prepare(text, font), maxWidth, lineHeight)
// height 就是内容需要的精确高度
```

## 拓展：封装可复用的手风琴组件

```ts
interface AccordionItem {
  id: string
  title: string
  content: string
  tag?: string
}

interface AccordionOptions {
  font: string
  lineHeight: number
  padding: number
  headerHeight?: number
  animationDuration?: number
}

class PretextAccordion {
  private container: HTMLElement
  private items: AccordionItem[]
  private options: AccordionOptions
  private measuredHeights: Map<string, number> = new Map()
  private openItems: Set<string> = new Set()

  constructor(container: HTMLElement, items: AccordionItem[], options: AccordionOptions) {
    this.container = container
    this.items = items
    this.options = {
      headerHeight: 56,
      animationDuration: 400,
      ...options
    }

    this.premeasure()
    this.render()
  }

  /**
   * 预先测量所有内容的高度
   */
  private premeasure(): void {
    const { font, lineHeight, padding } = this.options

    this.items.forEach(item => {
      const prepared = prepare(item.content, font)
      const { height } = layout(prepared, 10000, lineHeight) // 用大宽度确保不断行
      this.measuredHeights.set(item.id, Math.ceil(height) + padding * 2)
    })
  }

  /**
   * 渲染手风琴
   */
  private render(): void {
    const { headerHeight, animationDuration } = this.options

    this.container.innerHTML = this.items.map(item => {
      const contentHeight = this.measuredHeights.get(item.id) || 0
      const isOpen = this.openItems.has(item.id)

      return `
        <div class="item ${isOpen ? 'open' : ''}" data-id="${item.id}">
          <div class="item-header" onclick="accordion.toggle('${item.id}')">
            <div class="title-wrap">
              <h3>${item.title}</h3>
              ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
            </div>
            <svg class="chevron" viewBox="0 0 20 20">
              <line x1="4" y1="7" x2="10" y2="13"/>
              <line x1="10" y1="13" x2="16" y2="7"/>
            </svg>
          </div>
          <div class="item-body" style="max-height: ${isOpen ? contentHeight : 0}px">
            <div class="item-content">
              ${item.content}
              <div class="height-badge">
                预测高度: ${contentHeight}px
              </div>
            </div>
          </div>
        </div>
      `
    }).join('')

    // 添加 transition
    const bodies = this.container.querySelectorAll('.item-body')
    bodies.forEach(body => {
      (body as HTMLElement).style.transition = `max-height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
    })
  }

  /**
   * 切换展开/收起
   */
  toggle(id: string): void {
    if (this.openItems.has(id)) {
      this.openItems.delete(id)
    } else {
      this.openItems.add(id)
    }

    const item = this.container.querySelector(`[data-id="${id}"]`)
    const body = item?.querySelector('.item-body') as HTMLElement
    const contentHeight = this.measuredHeights.get(id) || 0

    if (body) {
      if (this.openItems.has(id)) {
        body.style.maxHeight = `${contentHeight}px`
        item?.classList.add('open')
      } else {
        body.style.maxHeight = '0px'
        item?.classList.remove('open')
      }
    }
  }

  /**
   * 响应式：更新宽度并重新测量
   */
  updateWidth(newWidth: number): void {
    const { font, lineHeight, padding } = this.options

    // 重新测量
    this.items.forEach(item => {
      const prepared = prepare(item.content, font)
      const { height } = layout(prepared, newWidth - padding * 2, lineHeight)
      this.measuredHeights.set(item.id, Math.ceil(height) + padding * 2)
    })

    // 如果有展开项，需要更新它们的 max-height
    this.openItems.forEach(id => {
      const body = this.container.querySelector(`[data-id="${id}"] .item-body`) as HTMLElement
      const contentHeight = this.measuredHeights.get(id) || 0
      if (body) {
        body.style.maxHeight = `${contentHeight}px`
      }
    })
  }

  /**
   * 获取当前展开的项
   */
  getOpenItems(): string[] {
    return Array.from(this.openItems)
  }
}

// 使用示例
const accordion = new PretextAccordion(
  document.getElementById('accordion'),
  [
    {
      id: 'what',
      title: '什么是 Pretext？',
      tag: '基础',
      content: 'Pretext 是一个纯 JavaScript 库，用于多行文本的精确测量与布局...'
    },
    {
      id: 'why',
      title: '为什么不用 getBoundingClientRect？',
      tag: '原理',
      content: 'getBoundingClientRect() 等 DOM 测量方法会强制触发布局回流...'
    }
  ],
  {
    font: '14px/1.8 Georgia, "Times New Roman", serif',
    lineHeight: 25.2,
    padding: 16,
    headerHeight: 56
  }
)

// 切换
accordion.toggle('what')

// 响应式
window.addEventListener('resize', () => {
  accordion.updateWidth(newWidth)
})
```

**特点**：
- 初始化时一次性预处理所有高度
- 支持平滑的 max-height 动画
- 支持响应式宽度更新
- 自动缓存测量结果

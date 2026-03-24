# Stage 2：入口页面与加载动画

> 本节实现页面结构、CSS 动画、以及 Three.js 的基础 DOM 挂载

## 2.1 页面结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>小米 SU7 展示</title>
  <style>
    /* 样式省略，见下方 */
  </style>
</head>
<body>
  <!-- 加载屏幕：初始显示 -->
  <div class="loader-screen" id="loader-screen">
    <div class="loading-container">
      <div class="loading">
        <span style="--i: 0">L</span>
        <span style="--i: 1">O</span>
        <span style="--i: 2">A</span>
        <span style="--i: 3">D</span>
        <span style="--i: 4">I</span>
        <span style="--i: 5">N</span>
        <span style="--i: 6">G</span>
        <span style="--i: 7">.</span>
      </div>
      <div class="loading-subtitle">INITIALIZING EXPERIENCE</div>
    </div>
  </div>

  <!-- Three.js 渲染容器 -->
  <div id="sketch"></div>

  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

## 2.2 CSS 样式

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  background: #000;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: white;
}

/* Three.js Canvas 全屏 */
#sketch {
  width: 100vw;
  height: 100vh;
}

/* ================================================
   加载屏幕
   作用：资源加载过程中显示的过渡动画
   原理：覆盖在整个页面之上，Three.js 在 #sketch 中渲染
   ================================================ */
.loader-screen {
  position: fixed;       /* 固定定位，相对于视口 */
  inset: 0;            /* top:0; right:0; bottom:0; left:0 */
  background: #000;     /* 纯黑背景 */
  z-index: 1000;        /* 最高层级，覆盖 Canvas */

  /* Flexbox 居中 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 过渡动画 */
  /* JS 调用 loaderScreen.classList.add('hollow') 后触发 */
  transition: opacity 1.5s ease, visibility 1.5s ease;
}

/* 加载完成时的状态 */
/* 添加 hollow 类后：opacity → 0，visibility → hidden */
.loader-screen.hollow {
  opacity: 0;
  visibility: hidden;   /* hidden 也会让元素不可点击 */
  pointer-events: none;
}

/* 加载文字容器 */
.loading-container {
  text-align: center;
}

/* LOADING 文字 */
.loading {
  display: flex;
  gap: 8px;           /* 每个字母间距 */
  font-size: 32px;
  font-weight: 200;    /* 细体 */
  letter-spacing: 8px; /* 字间距 */
  color: rgba(255, 255, 255, 0.9);
}

/* 每个字母的动画 */
.loading span {
  display: inline-block;
  /* CSS 自定义属性，每个字母有不同的延迟 */
  /* --i:0 的延迟 = 0 * 0.15s = 0s */
  /* --i:1 的延迟 = 1 * 0.15s = 0.15s */
  /* ... */
  animation: loadingPulse 1.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.15s);
}

/* 字母跳动关键帧 */
@keyframes loadingPulse {
  0%, 100% {
    /* 暗、小 */
    opacity: 0.3;
    transform: scale(0.9);
  }
  50% {
    /* 亮、大 */
    opacity: 1;
    transform: scale(1.05);
  }
}

/* 副标题 */
.loading-subtitle {
  margin-top: 30px;
  font-size: 12px;
  letter-spacing: 6px;
  color: rgba(255, 255, 255, 0.25);
}
```

## 2.3 动画时序

```
t=0s      ：页面打开，加载屏幕显示
t=0s      ：字母 L 首先开始跳动（--i:0, delay=0s）
t=0.15s   ：字母 O 开始跳动
t=0.30s   ：字母 A 开始跳动
t=0.45s   ：字母 D 开始跳动
...以此类推，每 0.15s 下一个字母加入

t=1s      ：JS 检测到所有资源加载完成
            调用 loaderScreen.classList.add('hollow')
            CSS transition 开始（1.5s 淡出）

t≈2.5s    ：加载屏幕完全消失，Three.js 场景可见
t≈3s      ：开始播放进场动画（相机推进 + 灯光渐亮）
```

## 2.4 CSS 动画原理

```
animation-delay = calc(var(--i) * 0.15s)

var(--i) 是 CSS 自定义属性（在 HTML 中设置）：
  <span style="--i: 0">L</span>  → delay = 0 * 0.15 = 0s
  <span style="--i: 1">O</span>  → delay = 1 * 0.15 = 0.15s
  <span style="--i: 2">A</span>  → delay = 2 * 0.15 = 0.30s
  ...

效果：
  L 先亮 → 0.15s 后 O 也亮 → 0.30s 后 A 也亮 → ...
  看起来像是波浪依次亮起
```

## 2.5 加载屏幕的 JS 控制

```js
// main.js

// 获取加载屏幕元素
const loaderScreen = document.getElementById('loader-screen')

// 资源加载完成后（假设 3 秒）
setTimeout(() => {
  // 添加 hollow 类，触发 CSS 过渡动画
  loaderScreen.classList.add('hollow')

  // 1.5 秒后（CSS transition 结束后）卸载元素
  // 这里不需要手动卸载，因为 visibility:hidden 已经让元素不可见了
}, 3000)
```

## 2.6 Three.js Canvas 挂载

```js
// main.js

// 挂载点
const sketchEl = document.getElementById('sketch')

// 后续创建的 renderer.domElement 会自动插入到 #sketch 中
// renderer = new THREE.WebGLRenderer({ canvas: ... })
// this.container.appendChild(renderer.domElement)
```

## 2.7 为什么需要加载屏幕？

| 原因 | 说明 |
|------|------|
| 资源大 | HDR 贴图（2MB+）+ GLTF 模型（10MB+）需要几秒加载 |
| 体验 | 加载过程中显示动画，避免用户看到空白或部分加载的页面 |
| 品牌感 | 精心设计的加载动画可以给用户留下好印象 |
| 时机控制 | 进场动画需要在所有资源就绪后才能播放 |

## 2.8 进阶：添加真实进度条

当前版本使用固定时间（3秒）后切换。更完善的方案是显示真实加载进度：

```js
class AssetManager {
  // ... 原有代码 ...

  // 获取加载进度（0 ~ 1）
  getProgress() {
    return this.loaded / this.total
  }
}

// 在 main.js 中
const progressBar = document.getElementById('progress-bar')

function updateProgress() {
  const progress = assetManager.getProgress()
  progressBar.style.width = `${progress * 100}%`
  requestAnimationFrame(updateProgress)
}

updateProgress()
```

---

[[返回项目文档首页|../index]]

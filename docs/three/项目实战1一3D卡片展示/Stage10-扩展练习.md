# Stage 10：扩展练习与总结

本 Stage 提供多个扩展练习方向，帮助你进一步深化 Three.js 技能。

## 扩展练习

### 练习 1：拖拽排序

让卡片可以被拖拽重新排序：

```js
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

const dragControls = new DragControls(cards, camera, renderer.domElement)
dragControls.addEventListener('dragstart', (event) => {
  controls.enabled = false  // 拖拽时禁用 OrbitControls
})
dragControls.addEventListener('dragend', (event) => {
  controls.enabled = true
  // 重新计算每张卡片的索引和位置
  updateLayout()
})
```

### 练习 2：卡片展开态

点击后卡片放大到屏幕中央：

```js
function expandCard(card) {
  const tl = gsap.timeline()
  tl.to(card.position, { x: 0, y: 0, z: 3, duration: 0.5 })
  tl.to(card.scale, { x: 2, y: 2, z: 2, duration: 0.5 }, '-=0.3')
  // 添加更多信息面板...
}
```

### 练习 3：3D 卡片画廊

加载真实图片作为纹理：

```js
const textureLoader = new THREE.TextureLoader()
textureLoader.load('/path/to/image.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshStandardMaterial({ map: texture })
  // 应用到卡片正面...
})
```

### 练习 4：多状态切换

在「正面 → 翻转 → 展开 → 收起」之间切换：

```js
const STATES = { FRONT: 0, BACK: 1, EXPANDED: 2 }
let currentState = STATES.FRONT

function nextState() {
  currentState = (currentState + 1) % 3
  // 根据状态更新目标位置、旋转、缩放...
}
```

### 练习 5：音效反馈

点击时播放音效：

```js
const audio = new Audio('/click.mp3')
window.addEventListener('click', () => {
  audio.currentTime = 0
  audio.play()
})
```

## 项目总结

### 技术要点回顾

| 知识点 | 应用 |
|--------|------|
| Scene / Camera / Renderer | 3D 场景基础 |
| AmbientLight / DirectionalLight / PointLight | 光照系统 |
| BoxGeometry + MeshStandardMaterial | 3D 物体创建 |
| CanvasTexture | 程序化纹理生成 |
| Raycaster | 鼠标交互检测 |
| Lerp 插值 | 平滑动画过渡 |
| requestAnimationFrame | 动画循环 |
| devicePixelRatio | 高清屏适配 |

### 进一步学习方向

- **着色器（GLSL）**：自定义材质效果
- **GLTFLoader**：加载 Blender 导出的 3D 模型
- **EffectComposer**：Bloom、模糊等后处理
- **GSAP**：更强大的动画库
- **物理引擎（cannon.js）**：刚体碰撞

## 下一步

恭喜完成 3D 卡片展示项目！推荐继续学习：

- [[项目实战二：汽车展示网站|../../项目实战2一汽车展示网站/index]] — 更复杂的交互与动画

[[返回项目首页|../index]]

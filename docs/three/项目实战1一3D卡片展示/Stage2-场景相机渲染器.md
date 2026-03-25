# Stage 2：场景、相机、渲染器

本 Stage 实现 Three.js 的核心三件套：场景（Scene）、相机（Camera）、渲染器（Renderer）。

## 核心概念

### Scene（场景）

场景是所有 3D 对象的容器，类似一个"舞台"：

```js
const scene = new THREE.Scene()
```


### Camera（相机）

相机决定"从哪个角度看舞台"。本项目使用透视相机：

```js
const camera = new THREE.PerspectiveCamera(
  45,                                    // FOV（视野角度）
  window.innerWidth / window.innerHeight, // 宽高比
  0.1,                                   // 近裁切面
  1000                                   // 远裁切面
)
camera.position.set(0, 0, 8)  // 相机位置：z=8，俯视 XY 平面
```


**透视相机的特点**：近大远小，符合人眼视觉习惯。

### Renderer（渲染器）

渲染器将 3D 场景绘制到 Canvas 上：

```js
const renderer = new THREE.WebGLRenderer({
  canvas,          // 绑定 HTML 中的 canvas 元素
  antialias: true, // 抗锯齿，边缘更平滑
  alpha: true,     // 透明背景（配合 CSS 渐变）
})
renderer.setSize(window.innerWidth, window.innerHeight)        // 设置画布尺寸
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制高清屏像素比
renderer.shadowMap.enabled = true                           // 开启阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap           // 柔和阴影
```


## 完整初始化代码

```js
import * as THREE from 'three'

// 获取 canvas 元素
const canvas = document.getElementById('canvas')

// 创建场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 8)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 响应式：当窗口大小改变时，重新设置画布尺寸
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// 简单的渲染循环（每帧绘制一次）
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
```


## Three.js 坐标系统

```

        +Y（上方）
         |
         |
         |  / +Z（朝外）
         | /
         |/
  -------+-------- +X（右侧）
        /
       /
      /
   -Y（下方）
```


- 相机默认朝向 **-Z** 方向
- `camera.position.set(0, 0, 8)` 表示相机在 z=8 的位置，向 z=0 的方向看

## 相机参数详解

| 参数 | 本项目值 | 说明 |
|------|----------|------|
| FOV | 45° | 视野角度，越大看到的东西越多但越小 |
| 近裁切面 | 0.1 | 距离相机小于此值的物体不渲染 |
| 远裁切面 | 1000 | 距离相机大于此值的物体不渲染 |
| 相机位置 | (0, 0, 8) | Z=8 表示相机离屏幕较远，卡片在 Z=0 |

## 常见问题

### Q: 画布尺寸不对或模糊？
> 检查 `renderer.setSize()` 是否在 `resize` 事件中正确调用，或 `devicePixelRatio` 是否过高。

### Q: 场景不显示？
> 确认 `renderer.render(scene, camera)` 在 `animate()` 循环中调用。


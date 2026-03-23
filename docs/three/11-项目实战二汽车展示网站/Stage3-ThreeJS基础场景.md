# Stage 3：Three.js 基础场景

> 本节实现 Three.js 的核心组件：场景、相机、渲染器，以及窗口大小自适应

## 3.1 Three.js 核心三要素

Three.js 的 3D 场景由三个核心组件构成：

```
┌─────────────────────────────────────┐
│           Scene（场景）               │
│   放置所有 3D 物体的容器               │
│   - 添加物体（mesh）                   │
│   - 添加光源                         │
│   - 设置背景色                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Camera（相机）               │
│   决定「从哪里看」「看多广」           │
│   - 位置（position）                 │
│   - 朝向（lookAt）                   │
│   - 视野角度（FOV）                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Renderer（渲染器）           │
│   将场景渲染到 Canvas                 │
│   - WebGLRenderer                   │
│   - 输出到屏幕                       │
└─────────────────────────────────────┘
```

## 3.2 创建场景

```js
// 1. 创建场景对象
const scene = new THREE.Scene()

// 2. 设置背景色（黑色）
scene.background = new THREE.Color('#000000')

// 3. 设置雾效果（远距离物体逐渐融入背景色）
scene.fog = new THREE.Fog('#000000', 15, 60)
// Fog(color, near, far)
// near=15：15米以内的物体不受雾影响
// far=60：60米以外的物体完全被雾遮挡
```

## 3.3 创建相机

```js
// 透视相机（PerspectiveCamera）
// 特点：近大远小，符合人眼视觉效果
// 常用于游戏、3D 展示

const camera = new THREE.PerspectiveCamera(
  33.4,                          // FOV（视野角度）
                                    // 角度越大，看到的范围越广（广角）
                                    // 角度越小，看到的范围越窄（长焦）
                                    // 33.4° 接近人眼的自然视野

  width / height,                  // 宽高比（aspect ratio）
                                    // 必须与 Canvas 一致，否则画面会拉伸

  0.1,                            // 近裁切面（near）
                                    // 距离相机小于 0.1 米的物体会被隐藏
                                    // 防止物体距离相机太近时「穿模」

  1000                            // 远裁切面（far）
                                    // 距离相机大于 1000 米的物体会被隐藏
)

// 相机位置（在 3D 空间中的坐标）
// (x, y, z) = (0, 0.8, -11)
// 含义：在车身正前方 11 米远处，高度 0.8 米处
camera.position.set(0, 0.8, -11)

// 相机朝向：看向车身中心
// 车身中心大概在 (0, 0.8, 0)
camera.lookAt(0, 0.8, 0)
```

## 3.4 创建渲染器

```js
// WebGL 渲染器
// 负责将 Three.js 场景绘制到 Canvas 上

const renderer = new THREE.WebGLRenderer({
  antialias: true,    // 抗锯齿
                        // 让 3D 物体的边缘更平滑
                        // 性能开销较小，建议开启

  // canvas: document.getElementById('canvas'),  // 可指定 canvas
})

// 设置渲染尺寸（全屏）
renderer.setSize(width, height)

// 设置像素比（适配高清屏）
// window.devicePixelRatio：普通屏幕=1，Retina=2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Math.min 限制最大为 2，防止 4K 屏性能开销过大

// 开启阴影
renderer.shadowMap.enabled = true

// 阴影类型
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// PCFSoftShadowMap：柔和阴影，边缘平滑
// PCFShadowMap：普通阴影，边缘较硬
// BasicShadowMap：最简单，性能最好但效果差

// 色调映射（决定颜色的「风格」）
renderer.toneMapping = THREE.ACESFilmicToneMapping
// ACES：类似电影的调色风格，对比度高，颜色鲜艳
// 其他选项：THREE.ReinhardToneMapping、THREE.CineonToneMapping 等

renderer.toneMappingExposure = 1.0
// 曝光度：值越大整体越亮，值越小整体越暗

// 将 Canvas 添加到页面
container.appendChild(renderer.domElement)
```

## 3.5 色调映射对比

```
Reinhard：     较暗，细节保留好，但整体偏暗
ACES Filmic：  对比度高，色彩鲜艳，电影感强 ← 本项目使用
Cineon：       类似胶片感，亮部柔和
None (Linear)：不做处理，最真实但视觉效果较差
```

## 3.6 窗口大小自适应

```js
// 监听窗口大小变化
window.addEventListener('resize', () => {
  // 1. 更新相机的宽高比
  camera.aspect = window.innerWidth / window.innerHeight

  // 2. 更新投影矩阵（必须调用，否则比例不变）
  camera.updateProjectionMatrix()

  // 3. 更新渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 4. 更新后处理尺寸（如有）
  postprocessing.composer.setSize(window.innerWidth, window.innerHeight)
})
```

## 3.7 坐标系统

Three.js 使用右手坐标系：

```
        +Y (上)
         │
         │
         │
         ─────── +X (右)
        ╱
       ╱
      ╱
    +Z (朝向屏幕外)

相机默认朝向 -Z 方向
```

## 3.8 渲染循环

```js
// 渲染循环（每帧执行，约 60fps）
function animate() {
  requestAnimationFrame(animate)  // 告诉浏览器「下次重绘前」执行 animate

  // 1. 更新相机位置（根据 params 动画）
  if (params.isCameraMoving) {
    camera.position.set(params.cameraPos.x, params.cameraPos.y, params.cameraPos.z)
    camera.lookAt(0, 0.8, 0)
  }

  // 2. FOV 平滑过渡（加速时广角效果）
  if (Math.abs(camera.fov - params.cameraFov) > 0.01) {
    // 每次移动 5% 的差距
    camera.fov += (params.cameraFov - camera.fov) * 0.05
    camera.updateProjectionMatrix()
  }

  // 3. 更新组件
  if (world) world.update()

  // 4. 更新后处理
  if (postprocessing) postprocessing.update()

  // 5. 渲染（经过后处理的最终画面）
  postprocessing.composer.render()
}

animate()  // 启动循环
```

## 3.9 相机参数详解

本项目使用的相机参数：

| 参数 | 值 | 说明 |
|------|-----|------|
| FOV | 33.4° | 接近人眼自然视角 |
| 初始位置 | (0, 0.8, -11) | 远处正对车身 |
| 终点位置 | (0, 0.8, -7) | 推进后距车身 7 米 |
| lookAt | (0, 0.8, 0) | 始终看向车身中心 |
| 加速时 FOV | 36° | 增大到 36° 产生「加速感」 |

**FOV 与「速度感」的关系：**
- 小 FOV（长焦）：压缩纵深，物体看起来更远 → 速度感弱
- 大 FOV（广角）：拉伸纵深，环境快速掠过 → 速度感强

---

[[返回项目文档首页|../index]]

# Three.js 3D 图形库

> Three.js 是一个在 WebGL 基础上封装的 3D 图形库，用于在浏览器中创建和展示 3D 图形

## 📚 目录

| 章节 | 内容 |
|------|------|
| [引入 Three.js](./引入three) | Three.js 的引入方式与基础示例 |

## 什么是 Three.js

Three.js 是最流行的 WebGL 封装库之一，它将 WebGL 的复杂性屏蔽掉，提供了一套简洁易用的 API，让我们能够更轻松地创建 3D 图形。

## 核心概念

### 场景（Scene）
```js
import * as THREE from 'three'

// 创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)
```

### 相机（Camera）
```js
// 透视相机
const camera = new THREE.PerspectiveCamera(
  75,                                      // 视野角度
  window.innerWidth / window.innerHeight,  // 宽高比
  0.1,                                     // 近裁切面
  1000                                     // 远裁切面
)
camera.position.z = 5
```

### 渲染器（Renderer）
```js
// WebGL 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 渲染场景
renderer.render(scene, camera)
```

### 几何体（Geometry）
```js
// 立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// 平面
const planeGeometry = new THREE.PlaneGeometry(5, 5)
```

### 材质（Material）
```js
// 基础材质
const material = new THREE.MeshBasicMaterial({ color: 0xff6b6b })

// 漫反射材质
const material = new THREE.MeshStandardMaterial({
  color: 0x4ecdc4,
  roughness: 0.5,
  metalness: 0.5
})
```

### 网格（Mesh）
```js
// 网格 = 几何体 + 材质
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

## 常用几何体

| 类型 | 说明 |
|------|------|
| BoxGeometry | 立方体 |
| SphereGeometry | 球体 |
| PlaneGeometry | 平面 |
| CylinderGeometry | 圆柱体 |
| TorusGeometry | 圆环 |
| ConeGeometry | 圆锥体 |
| CircleGeometry | 圆面 |
| TetrahedronGeometry | 正四面体 |
| IcosahedronGeometry | 正十二面体 |

## 光照

```js
// 环境光
const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
scene.add(ambientLight)

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight)

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-5, 5, 5)
spotLight.target.position.set(0, 0, 0)
scene.add(spotLight)
```

## 动画循环

```js
function animate() {
  requestAnimationFrame(animate)

  // 旋转
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

## 轨道控制器（OrbitControls）

```bash
pnpm add three @types/three
```

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true  // 阻尼效果
controls.dampingFactor = 0.05
controls.autoRotate = true     // 自动旋转
controls.autoRotateSpeed = 2
```

## 常用库

- **@three/examples** - 官方示例和工具
- **OrbitControls** - 轨道控制器（鼠标控制相机）
- **GLTFLoader** - 加载 GLTF/GLB 模型
- **DRACOLoader** - 解压 Draco 压缩的模型
- **EffectComposer** - 后期处理效果

## 入门建议

1. 理解 场景、相机、渲染器 的关系
2. 学习几何体和材质的基本使用
3. 掌握光照和阴影
4. 学习轨道控制器实现交互
5. 尝试加载外部 3D 模型（GLTF 格式）

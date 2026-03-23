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

Scene 是所有 3D 对象的容器。

```js
import * as THREE from 'three'

// 创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

// 添加雾效
scene.fog = new THREE.Fog(0x1a1a2e, 0.1, 50)
```

### 相机（Camera）

相机决定了观察场景的视角。

```js
// 透视相机（适合人眼视觉效果）
const camera = new THREE.PerspectiveCamera(
  75,                                      // 视野角度
  window.innerWidth / window.innerHeight,  // 宽高比
  0.1,                                     // 近裁切面
  1000                                     // 远裁切面
)
camera.position.set(0, 0, 5)

// 正交相机（适合 2D UI 等）
const orthoCamera = new THREE.OrthographicCamera(
  -10, 10, 10, -10, 0.1, 1000
)
```

### 渲染器（Renderer）

渲染器将场景绘制到屏幕上。

```js
import * as THREE from 'three'

// WebGL 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio) // 支持高清屏
renderer.shadowMap.enabled = true // 开启阴影
document.body.appendChild(renderer.domElement)

// 渲染场景
renderer.render(scene, camera)
```

### 几何体（Geometry）

Three.js 内置了多种几何体：

```js
// 立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// 平面
const planeGeometry = new THREE.PlaneGeometry(5, 5)

// 圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32)

// 圆环
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100)

// 圆锥体
const coneGeometry = new THREE.ConeGeometry(1, 2, 32)
```

### 材质（Material）

材质决定了物体的外观。

```js
// 基础材质（不受光照影响）
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b })

// 漫反射材质（需要光照）
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0x4ecdc4,
  roughness: 0.5,   // 粗糙度（0=光滑，1=粗糙）
  metalness: 0.5    // 金属度（0=非金属，1=金属）
})

// 法线材质
const normalMaterial = new THREE.MeshNormalMaterial()

// 深度材质（用于后期处理）
const depthMaterial = new THREE.MeshDepthMaterial()
```

### 网格（Mesh）

网格 = 几何体 + 材质

```js
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
const cube = new THREE.Mesh(geometry, material)

cube.position.x = 1
cube.position.y = 0.5
cube.rotation.y = Math.PI / 4

scene.add(cube)
```

## 常用几何体一览

| 几何体 | 类名 | 适用场景 |
|--------|------|---------|
| 立方体 | BoxGeometry | 房屋、箱子 |
| 球体 | SphereGeometry | 星球、弹珠 |
| 平面 | PlaneGeometry | 地面、墙面 |
| 圆柱体 | CylinderGeometry | 柱子、管道 |
| 圆环 | TorusGeometry | 圆环、轮胎 |
| 圆锥体 | ConeGeometry | 帐篷、树 |
| 圆面 | CircleGeometry | 圆盘、太阳 |
| 正四面体 | TetrahedronGeometry | 宝石 |
| 正十二面体 | IcosahedronGeometry | 球体近似 |

## 光照

### 光照类型

```js
// 环境光（均匀照亮所有物体）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// 点光源（像灯泡，向四周发光）
const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// 平行光（像太阳，光线平行）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7)
directionalLight.castShadow = true // 开启阴影
scene.add(directionalLight)

// 聚光灯（像手电筒，有方向和范围）
const spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(-5, 5, 5)
spotLight.target.position.set(0, 0, 0)
spotLight.angle = Math.PI / 6 // 光束角度
spotLight.penumbra = 0.3 // 半影
scene.add(spotLight)

// 半球光（天空色+地面色）
const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.5)
scene.add(hemisphereLight)
```

### 开启阴影

```js
// 渲染器开启阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // 软阴影

// 投射阴影的光源
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

// 投射阴影的物体
cube.castShadow = true

// 接收阴影的平面
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)
```

## 动画循环

```js
function animate() {
  requestAnimationFrame(animate)

  // 旋转物体
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

### 使用 Clock 精确计时

```js
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  cube.rotation.y = elapsedTime
  cube.position.y = Math.sin(elapsedTime) * 0.5

  renderer.render(scene, camera)
}
```

## 轨道控制器（OrbitControls）

鼠标控制相机旋转、缩放、平移。

```bash
pnpm add three
```

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true  // 阻尼效果
controls.dampingFactor = 0.05
controls.autoRotate = true     // 自动旋转
controls.autoRotateSpeed = 2
controls.minDistance = 2       // 最小缩放距离
controls.maxDistance = 50      // 最大缩放距离

// 在动画循环中更新
function animate() {
  requestAnimationFrame(animate)
  controls.update() // 配合 damping 使用
  renderer.render(scene, camera)
}
```

## 加载外部模型

### GLTF/GLB 模型（最常用）

```bash
pnpm add three
```

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

loader.load(
  './model.glb',  // 模型路径
  (gltf) => {
    const model = gltf.scene
    model.scale.set(0.5, 0.5, 0.5)
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    scene.add(model)
  },
  (progress) => {
    console.log('加载进度:', (progress.loaded / progress.total * 100) + '%')
  },
  (error) => {
    console.error('加载失败:', error)
  }
)
```

## 常用工具库

| 库 | 用途 |
|----|------|
| @three/examples | 官方示例和工具 |
| OrbitControls | 轨道控制器（鼠标控制相机） |
| GLTFLoader | 加载 GLTF/GLB 模型 |
| DRACOLoader | 解压 Draco 压缩的模型 |
| EffectComposer | 后期处理效果 |
| UnrealBloomPass | 泛光效果 |

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Three.js 入门</title>
  <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
  <script type="module">
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // 相机
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    )
    camera.position.z = 5

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    // 立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // 动画
    function animate() {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // 响应窗口变化
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
  </script>
</body>
</html>
```

## 入门建议

1. 理解 **场景、相机、渲染器** 的关系
2. 学习几何体和材质的基本使用
3. 掌握光照和阴影
4. 学习轨道控制器实现交互
5. 尝试加载外部 3D 模型（GLTF 格式）

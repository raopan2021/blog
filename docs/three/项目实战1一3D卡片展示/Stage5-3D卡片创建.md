# Stage 5：3D 卡片创建与布局

本 Stage 介绍如何使用 BoxGeometry 创建卡片网格，以及材质数组的原理。

## BoxGeometry（盒子几何体）

Three.js 的 `BoxGeometry` 创建一个矩形盒子，有 6 个面：

```js
// 宽 2，高 1.25，厚 0.1（薄盒子效果）
const geometry = new THREE.BoxGeometry(2, 1.25, 0.1)
```

## MeshStandardMaterial 物理渲染材质

Three.js 推荐使用 PBR（基于物理的渲染）材质：

```js
const material = new THREE.MeshStandardMaterial({
  map: frontTexture,   // 颜色贴图
  roughness: 0.3,      // 粗糙度（0=镜面反射，1=完全漫反射）
  metalness: 0.1,      // 金属度（金属材质更光滑）
})
```

## 材质数组（6个面）

`BoxGeometry` 的材质可以是数组，依次对应 6 个面：

```js
// 材质数组索引对应关系
// [右面(+X), 左面(-X), 上面(+Y), 下面(-Y), 前面(+Z), 后面(-Z)]

const materials = [
  sideMaterial,  // 右面
  sideMaterial,  // 左面
  sideMaterial,  // 上面
  sideMaterial,  // 下面
  frontMaterial, // 前面（正面）
  backMaterial   // 后面（背面）
]

const mesh = new THREE.Mesh(geometry, materials)
```

## 卡片创建函数

```js
const cards = []  // 存储所有卡片对象

function createCard(config, index) {
  const { title, subtitle, icon, front, back } = config

  // 1. 创建几何体
  const geometry = new THREE.BoxGeometry(2, 1.25, 0.1)

  // 2. 创建材质
  const frontTexture = createCardFrontTexture(title, subtitle, front[0], front[1], icon)
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.3,
    metalness: 0.1,
  })

  const backTexture = createCardBackTexture(back)
  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.5,
    metalness: 0.2,
  })

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x222233,
    roughness: 0.8,
    metalness: 0.3,
  })

  // 3. 组合材质（6个面）
  const materials = [
    sideMaterial, sideMaterial, sideMaterial, sideMaterial,
    frontMaterial, backMaterial
  ]

  // 4. 创建网格
  const mesh = new THREE.Mesh(geometry, materials)

  // 5. 网格布局（3列 × 2行）
  const cols = 3
  const row = Math.floor(index / cols)
  const col = index % cols
  const spacingX = 2.5
  const spacingY = 1.8

  mesh.position.set(
    (col - 1) * spacingX,     // X：根据列号偏移
    -row * spacingY + 0.9,    // Y：行号偏移（向上为正）
    0                         // Z：全部在 Z=0 平面
  )

  // 6. 启用阴影
  mesh.castShadow = true
  mesh.receiveShadow = true

  // 7. 存储状态数据
  mesh.userData = {
    isFlipped: false,
    targetRotationY: 0,
    currentRotationY: 0,
    basePositionY: mesh.position.y,
  }

  scene.add(mesh)
  cards.push(mesh)
}

// 8. 根据配置批量创建
cardConfigs.forEach((config, index) => createCard(config, index))
```

## 布局示意图

```
第0行 (index 0,1,2)
[ 卡片0 ]  [ 卡片1 ]  [ 卡片2 ]
   col=0     col=1     col=2

第1行 (index 3,4,5)
[ 卡片3 ]  [ 卡片4 ]  [ 卡片5 ]
   col=0     col=1     col=2

X轴 →  (col-1) * 2.5
Y轴 ↓  -row * 1.8 + 0.9
```

## userData 的作用

`mesh.userData` 可以自由附加任意数据，用于存储每张卡片的状态：

```js
mesh.userData.isFlipped        // 是否已翻转
mesh.userData.targetRotationY  // 目标旋转角度
mesh.userData.currentRotationY // 当前旋转角度
mesh.userData.basePositionY    // 初始 Y 坐标
```


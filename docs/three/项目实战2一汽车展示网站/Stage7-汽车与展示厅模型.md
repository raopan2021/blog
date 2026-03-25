# Stage 7：汽车与展示厅模型

> 本节介绍 GLTF 模型的加载、材质配置、以及贴图应用

## 7.1 GLTF 格式简介

GLTF（GL Transmission Format）是 Web 3D 的「JPG」格式：

| 特点 | 说明 |
|------|------|
| 自包含 | 几何体 + 材质 + 动画都在一个文件 |
| 高效 | 支持 Draco 压缩，减少加载时间 |
| 广泛支持 | Three.js、Babylon.js、Blender 等都原生支持 |
| PBR 材质 | 支持金属度/粗糙度等真实材质 |

## 7.2 加载 GLTF 模型

```js
// GLTFLoader 返回的对象结构
const gltf = {
  scene: THREE.Group,        // 根节点（包含所有子物体）
  animations: AnimationClip[], // 动画片段
  cameras: Camera[],           // 相机（如果有）
  scenes: Scene[],            // 场景（如果有）
  asset: { ... },            // 元数据
}

// 加载
const gltf = await loader.loadAsync('mesh/sm_car.gltf')

// 添加到场景
scene.add(gltf.scene)

// 遍历所有网格
gltf.scene.traverse((child) => {
  if (child.isMesh) {
    console.log(child.name, child.geometry.type)
  }
})
```

## 7.3 汽车模型配置

```js
/**
 * configureCar - 配置汽车模型
 *
 * 遍历 GLTF 模型的所有子节点（mesh），
 * 找到车身材质并设置颜色和贴图
 */
function configureCar() {
  const scene = carModel.scene

  scene.traverse((child) => {
    // 只处理网格
    if (!child.isMesh || !child.material) return
    const mat = child.material

    // 判断是否是车身材质
    // 方法：通过颜色判断（非黑色的就是车身）
    if (mat.isMeshStandardMaterial) {
      // 检测到非黑色材质 → 可能是车身
      if (!carBodyMat && mat.color?.getHex() !== 0x111111) {
        carBodyMat = mat

        // 设置为小米 SU7 蓝色
        mat.color.set(0x26d6e9)

        // 环境反射强度（加速时会暴增）
        mat.envMapIntensity = params.carBodyEnvIntensity
      }

      // 所有网格都应用 AO 贴图
      mat.aoMap = am.items.carBodyAO
      mat.aoMapIntensity = 1.0
    }
  })
}
```

## 7.4 展示厅模型配置

展示厅包含两种重要物体：

```
展示厅结构：
├── 地面（PlaneGeometry）
│   └── MeshPhysicalMaterial
│       ├── aoMap（环境光遮蔽）
│       ├── lightMap（光照贴图）
│       ├── normalMap（法线贴图）
│       ├── roughnessMap（粗糙度贴图）
│       └── envMapIntensity（反射强度）
│
└── 灯带（各种形状的 Geometry）
    └── MeshStandardMaterial
        ├── emissive（自发光）
        └── toneMapped = false（不经过色调映射）
```

```js
/**
 * configureStartRoom - 配置展示厅
 */
function configureStartRoom() {
  const scene = startroomModel.scene

  scene.traverse((child) => {
    if (!child.isMesh || !child.material) return
    const mat = child.material

    // ===== 灯带材质（自发光）=====
    if (mat.isMeshStandardMaterial &&
        mat.emissive &&
        mat.emissiveIntensity > 0) {

      // 初始：黑色（无光）
      mat.emissive.set(0x000000)
      mat.emissiveIntensity = 0

      // 不经过色调映射，保持发光
      mat.toneMapped = false

      // 支持透明
      mat.transparent = true
      mat.alphaTest = 0.1  // Alpha 测试，<0.1 的像素被丢弃

      // 保存引用（后续动画会修改）
      startRoomLightMat = mat
    }

    // ===== 地面材质（MeshPhysicalMaterial）=====
    if (mat.isMeshPhysicalMaterial) {
      // 应用贴图
      mat.aoMap = am.items.startroomAO           // 环境光遮蔽
      mat.lightMap = am.items.startroomLight     // 光照贴图
      mat.normalMap = am.items.floorNormal       // 法线贴图
      mat.roughnessMap = am.items.floorRoughness // 粗糙度贴图

      // 初始反射强度为 0
      mat.envMapIntensity = 0

      // 粗糙度低 → 反射强
      mat.roughness = 0.05   // 很光滑
      mat.metalness = 0.9    // 高金属感

      startRoomFloorMat = mat
    }
  })

  // 添加到场景
  scene.add(startroomModel.scene)
}
```

## 7.5 MeshPhysicalMaterial vs MeshStandardMaterial

| 属性 | MeshStandardMaterial | MeshPhysicalMaterial |
|------|-------------------|---------------------|
| 基础 | PBR 标准 | 扩展的 PBR |
| 适用 | 金属、塑料、木材 | 玻璃、水、宝石 |
| transmission | ❌ | ✅ 透光率 |
| ior | ❌ | ✅ 折射率 |
| clearcoat | ❌ | ✅ 清漆层 |
| sheen | ❌ | 丝绸感 |

本项目使用情况：
- **汽车玻璃** → `MeshPhysicalMaterial`（使用 transmission）
- **地面** → `MeshPhysicalMaterial`（更好的反射效果）
- **车灯、灯带** → `MeshStandardMaterial`（使用 emissive）

## 7.6 贴图详解

### AO 贴图（Ambient Occlusion）

```
作用：模拟物体凹陷处的阴影

原理：
┌─────────────┐
│ ▓▓░░░░░░░ │  ← 物体表面
│ ▓▓░░░░░░░ │
│ ░░░░░░░░░ │  ← 缝隙处无法被环境光照到
│ ░░░░░░░░░ │    AO 贴图在这里画上深色
└─────────────┘

效果：增加层次感和立体感
```

### 法线贴图（Normal Map）

```
作用：用 RGB 值存储法线方向，让平面看起来有凹凸

原理：
┌─────────────────────┐
│   平面几何体           │   ← 只有 2 个三角形
│     ╱╲               │
│    ╱  ╲              │
│   ╱    ╲             │
├─────────────────────┤
│   法线贴图            │   ← RGB = 法线方向
│  (红=右, 绿=上, 蓝=前) │
└─────────────────────┘

效果：看起来有凹凸，但实际几何体是平的
```

### 粗糙度/金属度贴图

```
粗糙度（Roughness）：表面有多「粗糙」
  白色 = 光滑（镜子）→ 强反射
  黑色 = 粗糙（石头）→ 漫反射

金属度（Metalness）：表面是金属还是非金属
  白色 = 金属 → 反射强，颜色随视角变化
  黑色 = 非金属 → 反射弱，颜色固定
```

## 7.7 地面反射实现

```js
// 地面材质配置
mat.metalness = 0.9    // 高金属感 → 反射强
mat.roughness = 0.05    // 很光滑 → 倒影清晰
mat.envMapIntensity = 0 // 初始为 0，进场动画中渐增到 25

// 反射的是什么？
// scene.environment = dynamicEnv.envmap
// 所以地面反射的是 DynamicEnv 输出的混合 HDR
```

---


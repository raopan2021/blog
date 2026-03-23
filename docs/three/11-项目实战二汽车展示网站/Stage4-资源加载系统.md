# Stage 4：资源加载系统

> 本节实现一个统一的资源管理器，负责加载 GLTF 模型、HDR 贴图、纹理贴图

## 4.1 为什么需要资源管理器？

```
传统方式（不推荐）：
  loadGLTF('car', () => { ... })
  loadGLTF('room', () => {
    loadHDR('night', () => {  // 嵌套回调地狱
      loadTexture(() => { ... })
    })
  })

资源管理器（推荐）：
  am.loadGLTF('car', 'path')
  am.loadGLTF('room', 'path')
  am.loadHDR('night', 'path')
  am.loadTexture('floor', 'path')

am.onReady(() => {
  // 所有资源加载完成后统一执行
  init()
})
```

## 4.2 AssetManager 类

```js
/**
 * AssetManager - 统一资源管理器
 * 负责加载所有类型的资源，并提供统一的完成回调
 */
class AssetManager {
  constructor() {
    this.items = {}        // 已加载的资源 { name: object }
    this.total = 0        // 总资源数
    this.loaded = 0       // 已加载数
    this.readyCallbacks = [] // 加载完成回调
  }

  /**
   * 加载 GLTF 3D 模型
   * @param {string} name - 资源名称（用于 this.items[name] 访问）
   * @param {string} path - 相对于 public/ 的路径
   */
  loadGLTF(name, path) {
    this.total++
    new GLTFLoader().load(path, (gltf) => {
      // GLTFLoader 返回一个 GLTF 对象
      // 包含 .scene（根场景节点）、.animations（动画）等
      this.items[name] = gltf
      this.onAssetLoaded()
    })
  }

  /**
   * 加载 HDR 环境贴图
   * @param {string} name - 资源名称
   * @param {string} path - 文件路径
   *
   * HDR（High Dynamic Range）:
   *   - 存储亮度信息，范围远超 0~255
   *   - 用于环境反射（Environment Map）
   *   - 文件格式：.hdr 或 .exr
   */
  loadHDR(name, path) {
    this.total++
    new RGBELoader().load(path, (texture) => {
      // 设置映射模式
      // EquirectangularReflectionMapping 适用于 360° 全景 HDR
      texture.mapping = THREE.EquirectangularReflectionMapping
      this.items[name] = texture
      this.onAssetLoaded()
    })
  }

  /**
   * 加载普通图片纹理
   * @param {string} name - 资源名称
   * @param {string} path - 文件路径
   */
  loadTexture(name, path) {
    this.total++
    new THREE.TextureLoader().load(path, (texture) => {
      this.items[name] = texture
      this.onAssetLoaded()
    })
  }

  /** 每加载完成一个资源调用一次 */
  onAssetLoaded() {
    this.loaded++
    console.log(`[资源加载] ${this.loaded}/${this.total}`)

    // 所有资源加载完成？
    if (this.loaded >= this.total) {
      this.readyCallbacks.forEach((cb) => cb())
    }
  }

  /**
   * 注册加载完成后的回调
   * @param {Function} cb - 回调函数
   */
  onReady(cb) {
    if (this.loaded >= this.total) {
      // 已经加载完了，直接执行
      cb()
    } else {
      // 还没加载完，存入队列
      this.readyCallbacks.push(cb)
    }
  }

  /** 获取已加载的资源 */
  get(name) {
    return this.items[name]
  }
}
```

## 4.3 资源路径配置

```js
/**
 * ASSETS - 资源路径配置
 * 集中管理所有资源的路径，方便修改
 */
const ASSETS = {
  // ===== GLTF 3D 模型 =====
  car:       'mesh/sm_car.gltf',          // 汽车模型
  startroom: 'mesh/sm_startroom.raw.gltf', // 展示厅
  speedup:   'mesh/sm_speedup.gltf',       // 加速特效（Speed Lines）

  // ===== HDR 环境贴图 =====
  // HDR 用于环境反射，让物体表面能反射出环境的光照和颜色
  envNight:  'texture/t_env_night.hdr',   // 夜晚 HDR（深蓝、暗）
  envLight:  'texture/t_env_light.hdr',    // 白天 HDR（明亮）

  // ===== 纹理贴图 =====
  // AO = Ambient Occlusion（环境光遮蔽）
  // 模拟物体凹陷处「光线进不去」的自然阴影
  carBodyAO:      'texture/t_car_body_AO.raw.jpg',
  startroomAO:    'texture/t_startroom_ao.raw.jpg',
  startroomLight: 'texture/t_startroom_light.raw.jpg',

  // 法线贴图：用 RGB 存储法线方向，制造凹凸感
  // 不需要真正的几何体就能有凹凸效果
  floorNormal:    'texture/t_floor_normal.webp',

  // 粗糙度贴图：白色=光滑（强反射），黑色=粗糙（漫反射）
  floorRoughness:  'texture/t_floor_roughness.webp',

  // ===== 音频 =====
  bgm: 'audio/bgm.mp3',
}
```

## 4.4 使用方式

```js
// 创建资源管理器
const am = new AssetManager()

// 注册所有资源
am.loadGLTF('car', ASSETS.car)
am.loadGLTF('startroom', ASSETS.startroom)
am.loadGLTF('speedup', ASSETS.speedup)
am.loadHDR('envNight', ASSETS.envNight)
am.loadHDR('envLight', ASSETS.envLight)
am.loadTexture('carBodyAO', ASSETS.carBodyAO)
am.loadTexture('floorNormal', ASSETS.floorNormal)
am.loadTexture('floorRoughness', ASSETS.floorRoughness)
am.loadTexture('startroomAO', ASSETS.startroomAO)
am.loadTexture('startroomLight', ASSETS.startroomLight)

// 所有资源加载完成后
am.onReady(() => {
  console.log('✅ 全部加载完成！')

  // 获取资源
  const carModel = am.items.car        // GLTF 对象
  const carScene = am.items.car.scene  // Three.js 场景节点

  const envTexture = am.items.envNight // THREE.Texture

  // 初始化场景
  initScene()
})
```

## 4.5 纹理预处理

加载后的纹理通常需要「预处理」才能正确显示：

```js
/**
 * preprocessTextures - 纹理预处理
 * 加载后的纹理需要设置正确的颜色空间、过滤方式等
 */
function preprocessTextures() {
  const i = am.items

  // ===== 汽车车身 AO 贴图 =====
  // AO 贴图只用 R（红）通道存储灰度信息
  i.carBodyAO.flipY = false
  // flipY：纹理是否沿 Y 轴翻转
  // GLTF 规范要求纹理 flipY=false，否则 UV 对应关系会错
  i.carBodyAO.colorSpace = THREE.LinearSRGBColorSpace
  // colorSpace：颜色空间
  // LinearSRGBColorSpace = 线性颜色空间（计算时用）
  // SRGBColorSpace = sRGB 颜色空间（显示时用）
  i.carBodyAO.minFilter = THREE.NearestFilter
  i.carBodyAO.magFilter = THREE.NearestFilter
  // minFilter/magFilter：缩小/放大时的过滤方式
  // NearestFilter = 最近邻过滤（像素风，清晰）
  // LinearFilter = 双线性过滤（平滑）
  // NearestFilter 用于 AO 贴图可以保持 AO 边缘锐利
  i.carBodyAO.channel = 1
  // channel：使用第几个通道（0=R, 1=G, 2=B）
  // 这里设为 1 表示使用 G 通道（但实际要看具体贴图格式）

  // ===== 展示厅 AO 贴图 =====
  i.startroomAO.flipY = false
  i.startroomAO.colorSpace = THREE.LinearSRGBColorSpace
  i.startroomAO.channel = 1

  // ===== 展示厅光照贴图 =====
  // 光照贴图需要 sRGB 颜色空间（用于显示）
  i.startroomLight.flipY = false
  i.startroomLight.colorSpace = THREE.SRGBColorSpace
  i.startroomLight.channel = 1

  // ===== 地面法线贴图 =====
  i.floorNormal.flipY = false
  i.floorNormal.colorSpace = THREE.LinearSRGBColorSpace
  i.floorNormal.wrapS = THREE.RepeatWrapping
  i.floorNormal.wrapT = THREE.RepeatWrapping
  // wrapS/wrapT：纹理在 U/V 方向的包裹方式
  // RepeatWrapping = 超过 0~1 范围时重复平铺
  // 本项目中地面较大，需要平铺多个贴图

  // ===== 地面粗糙度贴图 =====
  i.floorRoughness.flipY = false
  i.floorRoughness.colorSpace = THREE.LinearSRGBColorSpace
  i.floorRoughness.wrapS = THREE.RepeatWrapping
  i.floorRoughness.wrapT = THREE.RepeatWrapping
}
```

## 4.6 纹理过滤方式对比

```
NearestFilter（最近邻）:
  每个像素直接取最近的一个纹理像素
  ✓ 优点：锐利、清晰
  ✗ 缺点：有锯齿感
  适用：AO 贴图、像素风格

LinearFilter（双线性过滤）:
  取周围4个像素做加权平均
  ✓ 优点：平滑
  ✗ 缺点：稍模糊
  适用：普通纹理

Mipmap（多级渐远）:
  自动生成缩小后的版本（1/2, 1/4, 1/8...）
  优点：远处不会闪烁，性能好
```

## 4.7 从 HDR 创建环境贴图

HDR 贴图不能直接用于环境反射，需要转换为「PMREM」格式：

```js
/**
 * createEnvmap - 从 HDR 创建环境贴图
 * @param {THREE.Texture} hdrTexture - HDR 纹理
 * @returns {THREE.Texture} - 可用于环境反射的纹理
 */
function createEnvmap(hdrTexture) {
  // PMREMGenerator = Pre-filtered Environment Map Generator
  // 预过滤环境贴图生成器
  const pmrem = new THREE.PMREMGenerator(renderer)

  // 编译着色器（首次调用需要）
  pmrem.compileEquirectangularShader()

  // 从等距矩形 HDR 贴图生成环境贴图
  const envmap = pmrem.fromEquirectangular(hdrTexture).texture

  // 清理 PMREM 生成器（释放内存）
  pmrem.dispose()

  return envmap
}
```

## 4.8 资源清单

本项目加载的所有资源：

| 序号 | 名称 | 类型 | 用途 |
|------|------|------|------|
| 1 | envNight | HDR | 环境反射（夜晚） |
| 2 | envLight | HDR | 环境反射（白天） |
| 3 | car | GLTF | 汽车模型 |
| 4 | startroom | GLTF | 展示厅 |
| 5 | speedup | GLTF | 加速特效 |
| 6 | carBodyAO | JPG | 汽车 AO |
| 7 | startroomAO | JPG | 展厅 AO |
| 8 | startroomLight | JPG | 展厅光照 |
| 9 | floorNormal | WebP | 地面法线 |
| 10 | floorRoughness | WebP | 地面粗糙度 |

---

[[返回项目文档首页|../index]]

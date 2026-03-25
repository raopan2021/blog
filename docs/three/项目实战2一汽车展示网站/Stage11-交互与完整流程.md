# Stage 11：交互与完整流程

> 本节实现点击交互、背景音乐、以及整体的初始化流程

## 11.1 射线检测（Raycasting）

射线检测 = 从相机发射一条「射线」，检测它与哪些物体相交：

```
原理：

相机
  │
  │ 射线
  ▼
  ╲
   ╲  ← 从 mouse 位置发射
    ╲
     ╲
      ──────────────── ← 平面
         ● ← 交点

Three.js 会返回：
1. 是否有交点
2. 交点的距离
3. 交点的物体
4. 交点的 UV 坐标
```

```js
/**
 * setupInteraction - 设置点击交互
 */
function setupInteraction() {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  window.addEventListener('click', (event) => {
    // 交互禁用时不响应
    if (params.disableInteract) return

    // 将鼠标坐标归一化到 [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 从相机位置发射射线
    raycaster.setFromCamera(mouse, camera)

    // 检测是否与汽车模型相交
    // true = 检测所有后代节点
    const intersects = raycaster.intersectObject(carModel.scene, true)

    if (intersects.length > 0) {
      // 点击到了汽车
      rush()
    }
  })
}
```

## 11.2 背景音乐

```js
/**
 * playBGM - 播放背景音乐
 */
function playBGM() {
  try {
    // Howl.js：Web Audio API 的封装
    const bgm = new Howl({
      src: [ASSETS.bgm],  // 音频文件路径
      loop: true,          // 循环播放
      volume: 0.5,         // 音量 50%
    })

    bgm.play()
  } catch (e) {
    console.warn('背景音乐播放失败:', e)
  }
}
```

## 11.3 完整初始化流程

```js
/**
 * App - 主应用类
 * 整合所有组件，协调初始化顺序
 */
class App {
  constructor() {
    // 1. 获取 DOM 元素
    this.container = document.getElementById('sketch')
    this.loaderScreen = document.getElementById('loader-screen')

    // 2. 创建 Three.js 基础组件
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#000000')
    this.camera = new THREE.PerspectiveCamera(33.4, w/h, 0.1, 1000)
    this.camera.position.set(params.cameraPos.x, params.cameraPos.y, params.cameraPos.z)
    this.camera.lookAt(0, 0.8, 0)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    // ... 更多配置

    // 3. 创建后处理
    this.postprocessing = new Postprocessing(this)

    // 4. 创建资源管理器
    this.am = new AssetManager()

    // 5. 开始加载资源
    this.loadAssets()

    // 6. 设置交互
    this.setupInteraction()
  }

  /** 加载所有资源 */
  loadAssets() {
    this.am.loadHDR('envNight', ASSETS.envNight)
    this.am.loadHDR('envLight', ASSETS.envLight)
    this.am.loadGLTF('car', ASSETS.car)
    this.am.loadGLTF('startroom', ASSETS.startroom)
    this.am.loadGLTF('speedup', ASSETS.speedup)
    this.am.loadTexture('carBodyAO', ASSETS.carBodyAO)
    this.am.loadTexture('startroomAO', ASSETS.startroomAO)
    this.am.loadTexture('startroomLight', ASSETS.startroomLight)
    this.am.loadTexture('floorNormal', ASSETS.floorNormal)
    this.am.loadTexture('floorRoughness', ASSETS.floorRoughness)

    // 所有资源加载完成后
    this.am.onReady(() => {
      console.log('✅ 全部加载完成')
      this.onReady()
    })
  }

  /** 资源加载完成后的初始化 */
  onReady() {
    // 1. 预处理贴图
    this.preprocessTextures()

    // 2. 创建 HDR 环境贴图
    const envmapNight = this.createEnvmap(this.am.items.envNight)
    const envmapLight = this.createEnvmap(this.am.items.envLight)

    // 3. 创建动态环境
    this.dynamicEnv = new DynamicEnv(this, {
      envmap1: envmapNight,
      envmap2: envmapLight,
    })
    this.scene.environment = this.dynamicEnv.envmap

    // 4. 配置并添加汽车模型
    this.carModel = this.am.items.car
    this.configureCar()

    // 5. 配置并添加展厅模型
    this.startroomModel = this.am.items.startroom
    this.configureStartRoom()

    // 6. 添加加速特效
    this.speedupModel = this.am.items.speedup
    if (this.speedupModel) {
      this.scene.add(this.speedupModel.scene)
    }

    // 7. 创建相机抖动
    this.cameraShake = new CameraShake(this)

    // 8. 播放背景音乐
    this.playBGM()

    // 9. 播放进场动画
    this.enter()

    // 10. 开始渲染循环
    this.animate()
  }

  /** 渲染循环 */
  animate() {
    requestAnimationFrame(() => this.animate())

    // 1. 相机跟随（动画中）
    if (params.isCameraMoving) {
      this.camera.position.set(
        params.cameraPos.x,
        params.cameraPos.y,
        params.cameraPos.z
      )
      this.camera.lookAt(0, 0.8, 0)
    }

    // 2. FOV 平滑过渡
    if (Math.abs(this.camera.fov - params.cameraFov) > 0.01) {
      this.camera.fov += (params.cameraFov - this.camera.fov) * 0.05
      this.camera.updateProjectionMatrix()
    }

    // 3. 更新各组件
    if (this.dynamicEnv) this.dynamicEnv.update()
    if (this.cameraShake) this.cameraShake.update()

    // 4. 渲染
    this.postprocessing.composer.render()
  }
}

// 启动应用
new App()
```

## 11.4 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                        App                              │
│  (主应用，协调所有组件)                                  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Asset     │  │  Post-     │  │   Camera    │     │
│  │  Manager    │  │  processing │  │  Controls   │     │
│  │             │  │             │  │             │     │
│  │ • GLTF      │  │ • Bloom    │  │ • Position  │     │
│  │ • HDR       │  │ • Output   │  │ • FOV       │     │
│  │ • Texture   │  │             │  │ • Shake     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │                │                │              │
│         ▼                ▼                ▼              │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Scene                         │   │
│  │                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │   Car    │  │StartRoom │  │ Speedup  │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘    │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────┐      │   │
│  │  │         DynamicEnv                    │      │   │
│  │  │  (HDR Night ◄──────────► HDR Light)  │      │   │
│  │  └──────────────────────────────────────┘      │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│              ┌─────────────────────┐                  │
│              │     Renderer        │                  │
│              │  (WebGL Canvas)     │                  │
│              └─────────────────────┘                  │
└─────────────────────────────────────────────────────────┘

交互流程：
  Click Event → Raycaster → intersectObject(car)
                                         │
                                         ▼
                                     rush() / rushDone()
                                         │
                                         ▼
                              GSAP Timeline（多段时间线）
                                         │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
              Speed Up               Bloom Up            Shake Start
```

## 11.5 状态机

```js
// 两种状态
params.isRushing = false  // 正常
params.isRushing = true   // 加速中

// 状态转换
正常 ──点击汽车──→ 加速中 ──再次点击──→ 正常

// 禁用交互标志
params.disableInteract = true  // 动画进行中，不响应点击
params.disableInteract = false // 可交互
```

---


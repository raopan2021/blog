/**
 * ============================================================
 * 小米 SU7 网站特效 - 主入口文件
 * ============================================================
 *
 * 参考项目：https://github.com/alphardex/su7-replica
 *
 * 本项目复刻了小米 SU7 官网的以下特效：
 * 1. LOADING 过渡动画
 * 2. 进场动画（相机推进 + 灯光渐亮）
 * 3. 点击汽车触发「加速模式」
 * 4. Speed Lines（速度线）特效
 * 5. 相机抖动
 * 6. HDR 环境图动态切换
 * 7. Bloom 后处理发光
 * 8. 地面反射
 * 9. 背景音乐
 *
 * 目录结构：
 * ├── index.html              # 入口 HTML（加载动画）
 * ├── public/
 * │   ├── audio/bgm.mp3      # 背景音乐
 * │   ├── mesh/sm_car.gltf   # 汽车 3D 模型
 * │   ├── mesh/sm_startroom.gltf  # 展示厅模型
 * │   ├── mesh/sm_speedup.gltf     # 加速特效模型
 * │   ├── texture/t_env_*.hdr     # HDR 环境贴图
 * │   └── texture/t_*.jpg|webp   # 各类纹理贴图
 * └── src/
 *     └── main.js               # 主入口（单文件版）
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import gsap from 'gsap'

// =============================================================
// 资源路径配置
// =============================================================
const ASSETS = {
  car: 'mesh/sm_car.gltf',
  startroom: 'mesh/sm_startroom.raw.gltf',
  speedup: 'mesh/sm_speedup.gltf',
  envNight: 'texture/t_env_night.hdr',
  envLight: 'texture/t_env_light.hdr',
  carBodyAO: 'texture/t_car_body_AO.raw.jpg',
  startroomAO: 'texture/t_startroom_ao.raw.jpg',
  startroomLight: 'texture/t_startroom_light.raw.jpg',
  floorNormal: 'texture/t_floor_normal.webp',
  floorRoughness: 'texture/t_floor_roughness.webp',
  bgm: 'audio/bgm.mp3',
}

// =============================================================
// 全局动画参数（GSAP 动画会修改这些值）
// =============================================================
const params = {
  // 相机位置
  cameraPos: { x: 0, y: 0.8, z: -11 },
  cameraFov: 33.4,

  // 速度（0=静止，10=全速）
  speed: 0,

  // 灯光
  lightAlpha: 0,         // 颜色插值（0=黑，1=白）
  lightIntensity: 0,     // 发光强度
  lightOpacity: 1,       // 灯带透明度

  // 环境贴图
  envIntensity: 0,       // 环境贴图强度
  envWeight: 0,          // 两个 HDR 之间的权重

  // 地面
  reflectIntensity: 0,  // 反射强度
  floorLerpColor: 0,   // 地面颜色（0=白，1=黑）

  // 车身
  carBodyEnvIntensity: 1,

  // 相机抖动
  cameraShakeIntensity: 0,

  // Bloom
  bloomLuminanceSmoothing: 1.6,
  bloomIntensity: 1,

  // 加速特效
  speedUpOpacity: 0,

  // 状态标志
  isCameraMoving: false,
  isRushing: false,
  disableInteract: false,
}

// =============================================================
// 资源加载器
// =============================================================

class AssetManager {
  constructor() {
    this.items = {}
    this.total = 0
    this.loaded = 0
    this.readyCallbacks = []
  }

  loadGLTF(name, path) {
    this.total++
    new GLTFLoader().load(path, (gltf) => {
      this.items[name] = gltf
      this.onLoaded()
    })
  }

  loadHDR(name, path) {
    this.total++
    new RGBELoader().load(path, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      this.items[name] = texture
      this.onLoaded()
    })
  }

  loadTexture(name, path) {
    this.total++
    new THREE.TextureLoader().load(path, (texture) => {
      this.items[name] = texture
      this.onLoaded()
    })
  }

  onLoaded() {
    this.loaded++
    console.log(`[资源加载] ${this.loaded}/${this.total}`)
    if (this.loaded >= this.total) {
      this.readyCallbacks.forEach((cb) => cb())
    }
  }

  onReady(cb) {
    if (this.loaded >= this.total) cb()
    else this.readyCallbacks.push(cb)
  }
}

// =============================================================
// 后处理（Bloom 发光）
// =============================================================

class Postprocessing {
  constructor(experience) {
    this.experience = experience
    this.composer = new EffectComposer(experience.renderer)

    const renderPass = new RenderPass(experience.scene, experience.camera)
    this.composer.addPass(renderPass)

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(experience.width, experience.height),
      0.8,   // strength - 发光强度
      0.4,   // radius - 发光半径
      0.85   // threshold - 发光阈值
    )
    this.composer.addPass(this.bloomPass)
  }

  setIntensity(value) {
    this.bloomPass.strength = value
  }

  setLuminanceSmoothing(value) {
    this.bloomPass.luminanceMaterial.smoothing = value
  }

  update() {}
}

// =============================================================
// 动态环境贴图
// 在两个 HDR 环境贴图之间切换
// =============================================================

class DynamicEnv {
  constructor(experience, config = {}) {
    this.experience = experience

    // 创建 FBO（Framebuffer Object）用于存储渲染结果
    this.fbo = new THREE.WebGLRenderTarget(1024, 1024)

    // 创建着色器材质，实现两个环境贴图的加权混合
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uEnvmap1: { value: config.envmap1 || null },
        uEnvmap2: { value: config.envmap2 || null },
        uWeight: { value: 0 },    // 混合权重
        uIntensity: { value: 1 }, // 强度
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uEnvmap1;
        uniform sampler2D uEnvmap2;
        uniform float uWeight;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          vec4 c1 = texture2D(uEnvmap1, vUv);
          vec4 c2 = texture2D(uEnvmap2, vUv);
          // 根据权重混合两个环境贴图
          vec4 color = mix(c1, c2, uWeight) * uIntensity;
          gl_FragColor = color;
        }
      `,
    })

    // 全屏四边形
    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.material
    )

    this._envmap = this.fbo.texture
  }

  /** 获取混合后的环境贴图 */
  get envmap() {
    return this._envmap
  }

  /** 设置两个 HDR 之间的混合权重 */
  setWeight(value) {
    this.material.uniforms.uWeight.value = value
  }

  /** 设置环境强度 */
  setIntensity(value) {
    this.material.uniforms.uIntensity.value = value
  }

  /** 每帧渲染到 FBO */
  update() {
    this.experience.renderer.setRenderTarget(this.fbo)
    this.experience.renderer.render(this.quad, this.experience.camera)
    this.experience.renderer.setRenderTarget(null)
  }
}

// =============================================================
// 相机抖动
// 使用 Simplex Noise 实现平滑的随机抖动
// =============================================================

function createNoise2D() {
  // Permutation table
  const p = []
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256)

  return function (x, y) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = fade(x)
    const v = fade(y)
    const a = p[X] + Y
    const b = p[X + 1] + Y
    return lerp(
      v,
      lerp(u, grad(p[a & 255], x, y), grad(p[b & 255], x - 1, y)),
      lerp(u, grad(p[(a + 1) & 255], x, y - 1), grad(p[(b + 1) & 255], x - 1, y - 1))
    )
  }
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(t, a, b) { return a + t * (b - a) }
function grad(hash, x, y) {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

class CameraShake {
  constructor(experience) {
    this.experience = experience
    this.intensity = 0
    this.tweenedOffset = new THREE.Vector3()
    this.noise2D = createNoise2D()
  }

  setIntensity(value) {
    this.intensity = value
  }

  update() {
    if (this.intensity <= 0) return

    const t = performance.now() * 0.001

    // 用噪声生成偏移量
    const offset = new THREE.Vector3(
      this.noise2D(t * 0.5, 0) * 2,
      this.noise2D(t * 0.5, 100) * 2,
      this.noise2D(t * 0.5, 200) * 2
    )

    // 平滑插值到目标偏移
    offset.multiplyScalar(0.1 * this.intensity)
    this.tweenedOffset.lerp(offset, 0.1)

    // 添加到相机位置
    this.experience.camera.position.add(this.tweenedOffset)
  }
}

// =============================================================
// 主应用类
// =============================================================

class App {
  constructor() {
    // DOM 元素
    this.container = document.getElementById('sketch')
    this.loaderScreen = document.getElementById('loader-screen')

    // 尺寸
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight

    // 场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#000000')

    // 相机
    this.camera = new THREE.PerspectiveCamera(33.4, this.width / this.height, 0.1, 1000)
    this.camera.position.set(params.cameraPos.x, params.cameraPos.y, params.cameraPos.z)
    this.camera.lookAt(0, 0.8, 0)

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.container.appendChild(this.renderer.domElement)

    // 后处理
    this.postprocessing = new Postprocessing(this)

    // 资源管理器
    this.am = new AssetManager()

    // GSAP 时间线
    this.tweens = []

    // 组件引用
    this.dynamicEnv = null
    this.startRoomModel = null
    this.carModel = null
    this.speedupModel = null
    this.cameraShake = null

    // 加载资源
    this.loadAssets()

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.onResize())

    // 监听点击
    this.setupInteraction()
  }

  /** 加载所有资源 */
  loadAssets() {
    // HDR 环境贴图
    this.am.loadHDR('envNight', ASSETS.envNight)
    this.am.loadHDR('envLight', ASSETS.envLight)

    // GLTF 模型
    this.am.loadGLTF('car', ASSETS.car)
    this.am.loadGLTF('startroom', ASSETS.startroom)
    this.am.loadGLTF('speedup', ASSETS.speedup)

    // 纹理
    this.am.loadTexture('carBodyAO', ASSETS.carBodyAO)
    this.am.loadTexture('startroomAO', ASSETS.startroomAO)
    this.am.loadTexture('startroomLight', ASSETS.startroomLight)
    this.am.loadTexture('floorNormal', ASSETS.floorNormal)
    this.am.loadTexture('floorRoughness', ASSETS.floorRoughness)

    // 资源加载完成
    this.am.onReady(() => {
      console.log('✅ 所有资源加载完成')
      this.onReady()
    })
  }

  /** 资源加载完成后初始化 */
  onReady() {
    // 预处理贴图
    this.preprocessTextures()

    // 创建 HDR 环境贴图
    const envmapNight = this.createEnvmap(this.am.items.envNight)
    const envmapLight = this.createEnvmap(this.am.items.envLight)

    // 动态环境
    this.dynamicEnv = new DynamicEnv(this, { envmap1: envmapNight, envmap2: envmapLight })
    this.scene.environment = this.dynamicEnv.envmap

    // 展示厅
    this.startRoomModel = this.am.items.startroom
    this.configureStartRoom()

    // 汽车
    this.carModel = this.am.items.car
    this.configureCar()

    // 加速特效
    this.speedupModel = this.am.items.speedup
    if (this.speedupModel) {
      this.scene.add(this.speedupModel.scene)
    }

    // 相机抖动
    this.cameraShake = new CameraShake(this)

    // 背景音乐
    this.playBGM()

    // 播放进场动画
    this.enter()

    // 开始渲染循环
    this.animate()
  }

  /** 从 HDR 创建环境贴图 */
  createEnvmap(hdrTexture) {
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    pmrem.compileEquirectangularShader()
    const envmap = pmrem.fromEquirectangular(hdrTexture).texture
    pmrem.dispose()
    return envmap
  }

  /** 预处理贴图 */
  preprocessTextures() {
    const i = this.am.items

    // 汽车车身 AO 贴图
    i.carBodyAO.flipY = false
    i.carBodyAO.colorSpace = THREE.LinearSRGBColorSpace
    i.carBodyAO.minFilter = THREE.NearestFilter
    i.carBodyAO.magFilter = THREE.NearestFilter
    i.carBodyAO.channel = 1

    // 展示厅 AO
    i.startroomAO.flipY = false
    i.startroomAO.colorSpace = THREE.LinearSRGBColorSpace
    i.startroomAO.channel = 1

    // 展示厅光照贴图
    i.startroomLight.flipY = false
    i.startroomLight.colorSpace = THREE.SRGBColorSpace
    i.startroomLight.channel = 1

    // 地面法线
    i.floorNormal.flipY = false
    i.floorNormal.colorSpace = THREE.LinearSRGBColorSpace
    i.floorNormal.wrapS = THREE.RepeatWrapping
    i.floorNormal.wrapT = THREE.RepeatWrapping

    // 地面粗糙度
    i.floorRoughness.flipY = false
    i.floorRoughness.colorSpace = THREE.LinearSRGBColorSpace
    i.floorRoughness.wrapS = THREE.RepeatWrapping
    i.floorRoughness.wrapT = THREE.RepeatWrapping
  }

  /** 配置展示厅模型 */
  configureStartRoom() {
    const scene = this.startRoomModel.scene

    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return
      const mat = child.material

      // 灯带材质
      if (mat.isMeshStandardMaterial && mat.emissive && mat.emissiveIntensity > 0) {
        mat.emissive.set(0x000000)
        mat.emissiveIntensity = 0
        mat.toneMapped = false
        mat.transparent = true
        mat.alphaTest = 0.1
        // 保存引用后续修改
        this.startRoomLightMat = mat
      }

      // 地面材质
      if (mat.isMeshPhysicalMaterial) {
        mat.aoMap = this.am.items.startroomAO
        mat.lightMap = this.am.items.startroomLight
        mat.normalMap = this.am.items.floorNormal
        mat.roughnessMap = this.am.items.floorRoughness
        mat.envMapIntensity = 0
        mat.roughness = 0.05
        mat.metalness = 0.9
        this.startRoomFloorMat = mat
      }
    })

    this.scene.add(scene)
  }

  /** 配置汽车模型 */
  configureCar() {
    const scene = this.carModel.scene

    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return
      const mat = child.material

      if (mat.isMeshStandardMaterial) {
        // 检测是否是车身
        if (!this.carBodyMat && mat.color?.getHex() !== 0x111111) {
          this.carBodyMat = mat
          mat.color.set(0x26d6e9)  // 小米 SU7 蓝色
          mat.envMapIntensity = 1
        }
        mat.aoMap = this.am.items.carBodyAO
      }
    })

    this.scene.add(scene)
  }

  /** 背景音乐 */
  playBGM() {
    try {
      const bgm = new Howl({ src: [ASSETS.bgm], loop: true })
      bgm.play()
    } catch (e) {
      console.warn('背景音乐播放失败:', e)
    }
  }

  /** 设置点击交互 */
  setupInteraction() {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    window.addEventListener('click', (event) => {
      if (params.disableInteract) return

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, this.camera)
      const intersects = raycaster.intersectObject(this.carModel.scene, true)

      if (intersects.length > 0) {
        this.rush()
      }
    })
  }

  /** 进场动画 */
  enter() {
    params.disableInteract = true

    // 初始状态：全黑
    this.dynamicEnv.setWeight(0)
    this.dynamicEnv.setIntensity(0)
    if (this.startRoomLightMat) {
      this.startRoomLightMat.emissive.set(0x000000)
      this.startRoomLightMat.emissiveIntensity = 0
    }
    if (this.startRoomFloorMat) {
      this.startRoomFloorMat.color.set(0x000000)
      this.startRoomFloorMat.envMapIntensity = 0
    }

    // 加载屏幕淡出
    setTimeout(() => {
      this.loaderScreen?.classList.add('hollow')
    }, 1000)

    // ========== 相机推进 ==========
    const t1 = gsap.timeline()
    this.tweens.push(t1)
    t1.to(params.cameraPos, {
      x: 0, y: 0.8, z: -7,
      duration: 4,
      ease: 'power2.inOut',
      onComplete: () => {
        params.isCameraMoving = false
        params.disableInteract = false
      },
    })

    // ========== 灯光渐亮 ==========
    const t2 = gsap.timeline()
    this.tweens.push(t2)
    const blackColor = new THREE.Color(0x000000)
    const whiteColor = new THREE.Color(0xffffff)
    const lightColor = new THREE.Color()

    t2.to(params, {
      lightAlpha: 1,
      lightIntensity: 1,
      reflectIntensity: 25,
      duration: 4,
      delay: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        lightColor.copy(blackColor).lerp(whiteColor, params.lightAlpha)
        if (this.startRoomLightMat) {
          this.startRoomLightMat.emissive.set(lightColor)
          this.startRoomLightMat.emissiveIntensity = params.lightIntensity
        }
        if (this.startRoomFloorMat) {
          this.startRoomFloorMat.color.set(lightColor)
          this.startRoomFloorMat.envMapIntensity = params.reflectIntensity * 0.01
        }
      },
    })

    // ========== 环境贴图 ==========
    const t3 = gsap.timeline()
    this.tweens.push(t3)
    t3.to(params, {
      envIntensity: 1,
      duration: 4,
      delay: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.dynamicEnv.setIntensity(params.envIntensity)
      },
    }).to(params, {
      envWeight: 1,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.dynamicEnv.setWeight(params.envWeight)
      },
    }, '-=2.5')
  }

  /** 加速模式 */
  rush() {
    if (params.isRushing) {
      this.rushDone()
      return
    }

    params.disableInteract = true
    params.isRushing = true
    this.clearAllTweens()

    // ========== 速度上升 ==========
    const t4 = gsap.timeline()
    this.tweens.push(t4)
    t4.to(params, {
      speed: 4,
      duration: 2,
      ease: 'power2.out',
      onComplete: () => {
        params.isRushing = true
        params.disableInteract = false
      },
    }).to(params, {
      speed: 10,
      duration: 4,
      ease: 'power2.out',
    })

    // ========== 灯带渐暗 ==========
    const t5 = gsap.timeline()
    this.tweens.push(t5)
    t5.to(params, {
      lightOpacity: 0,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.startRoomLightMat) {
          this.startRoomLightMat.opacity = params.lightOpacity
        }
      },
    })

    // ========== 地面变暗 ==========
    const t6 = gsap.timeline()
    this.tweens.push(t6)
    t6.to(params, {
      floorLerpColor: 1,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.startRoomFloorMat) {
          const c = new THREE.Color(0xffffff).lerp(new THREE.Color(0x000000), params.floorLerpColor)
          this.startRoomFloorMat.color.set(c)
        }
      },
    })

    // ========== 环境贴图变暗 ==========
    const t7 = gsap.timeline()
    this.tweens.push(t7)
    t7.to(params, {
      envIntensity: 0.01,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        this.dynamicEnv.setIntensity(params.envIntensity)
      },
    })

    // ========== FOV + 加速特效 ==========
    const t8 = gsap.timeline()
    this.tweens.push(t8)
    t8.to(params, {
      speedUpOpacity: 1,
      cameraFov: 36,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.speedupModel?.scene) {
          this.speedupModel.scene.visible = params.speedUpOpacity > 0
        }
      },
    })

    // ========== Bloom + 抖动 ==========
    setTimeout(() => {
      this.scene.environment = this.dynamicEnv.envmap

      const t9 = gsap.timeline()
      this.tweens.push(t9)
      t9.to(params, {
        carBodyEnvIntensity: 10,
        cameraShakeIntensity: 1,
        bloomLuminanceSmoothing: 0.4,
        bloomIntensity: 2,
        duration: 4,
        ease: 'power2.out',
        onUpdate: () => {
          if (this.carBodyMat) this.carBodyMat.envMapIntensity = params.carBodyEnvIntensity
          if (this.cameraShake) this.cameraShake.setIntensity(params.cameraShakeIntensity)
          this.postprocessing.setLuminanceSmoothing(params.bloomLuminanceSmoothing)
          this.postprocessing.setIntensity(params.bloomIntensity)
        },
      })
    }, 1000)
  }

  /** 取消加速模式 */
  rushDone() {
    if (!params.isRushing) return
    params.disableInteract = true
    params.isRushing = false
    this.clearAllTweens()

    const t4 = gsap.timeline()
    this.tweens.push(t4)
    t4.to(params, {
      speed: 0,
      duration: 2,
      ease: 'power2.out',
      onComplete: () => { params.disableInteract = false },
    })

    const t5 = gsap.timeline()
    this.tweens.push(t5)
    t5.to(params, {
      lightOpacity: 1,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.startRoomLightMat) this.startRoomLightMat.opacity = params.lightOpacity
      },
    })

    const t6 = gsap.timeline()
    this.tweens.push(t6)
    t6.to(params, {
      floorLerpColor: 0,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.startRoomFloorMat) {
          const c = new THREE.Color(0xffffff).lerp(new THREE.Color(0x000000), 1 - params.floorLerpColor)
          this.startRoomFloorMat.color.set(c)
        }
      },
    })

    const t7 = gsap.timeline()
    this.tweens.push(t7)
    t7.to(params, {
      envIntensity: 1,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => { this.dynamicEnv.setIntensity(params.envIntensity) },
    })

    const t8 = gsap.timeline()
    this.tweens.push(t8)
    t8.to(params, {
      speedUpOpacity: 0,
      cameraFov: 33.4,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.speedupModel?.scene) this.speedupModel.scene.visible = params.speedUpOpacity > 0
      },
    })

    const t9 = gsap.timeline()
    this.tweens.push(t9)
    t9.to(params, {
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.carBodyMat) this.carBodyMat.envMapIntensity = params.carBodyEnvIntensity
        if (this.cameraShake) this.cameraShake.setIntensity(params.cameraShakeIntensity)
        this.postprocessing.setLuminanceSmoothing(params.bloomLuminanceSmoothing)
        this.postprocessing.setIntensity(params.bloomIntensity)
      },
    })

    this.scene.environment = this.dynamicEnv.envmap
  }

  /** 清除所有时间线 */
  clearAllTweens() {
    this.tweens.forEach((t) => t.kill())
    this.tweens = []
  }

  /** 窗口大小变化 */
  onResize() {
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
    this.postprocessing.composer.setSize(this.width, this.height)
  }

  /** 渲染循环 */
  animate() {
    requestAnimationFrame(() => this.animate())

    // 相机跟随
    if (params.isCameraMoving) {
      this.camera.position.set(params.cameraPos.x, params.cameraPos.y, params.cameraPos.z)
      this.camera.lookAt(0, 0.8, 0)
    }

    // FOV 平滑过渡
    if (Math.abs(this.camera.fov - params.cameraFov) > 0.01) {
      this.camera.fov += (params.cameraFov - this.camera.fov) * 0.05
      this.camera.updateProjectionMatrix()
    }

    // 更新组件
    if (this.dynamicEnv) this.dynamicEnv.update()
    if (this.cameraShake) this.cameraShake.update()

    // 渲染
    this.postprocessing.composer.render()
  }
}

// =============================================================
// 启动
// =============================================================
new App()

console.log('✅ 小米 SU7 网站特效已启动')
console.log('📌 操作说明：')
console.log('   - 等待 LOADING 动画完成（约3秒）')
console.log('   - 进场动画自动播放（相机推进 + 灯光渐亮）')
console.log('   - 点击汽车：触发「加速模式」')
console.log('   - 再次点击：取消加速模式')
console.log('   - 背景音乐自动播放')

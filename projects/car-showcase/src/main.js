/**
 * 汽车展示网站 - 增强版
 * 参考: https://github.com/alphardex/su7-replica
 *
 * 新增功能：
 * 1. 加载动画（LOADING 文字动画）
 * 2. 进场动画（相机推进 + 灯光渐亮）
 * 3. 点击汽车触发「加速模式」
 * 4. 加速特效（Speed Lines 着色器 + 相机抖动）
 * 5. FOV 动态变化 + Bloom 增强
 * 6. 地面反射增强
 * 7. 环境光动态变化
 */

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import gsap from 'gsap'

// ============================================================
// 全局变量
// ============================================================
let scene, camera, renderer, composer
let carGroup, wheels = [], headlights = [], taillights = []
let floor, floorMirror
let scrollProgress = 0
let currentSection = 0
let targetCarRotationY = 0
let currentCarRotationY = 0
let mouseX = 0, mouseY = 0

// 增强版新增
let speedLinesMesh      // 加速线条
let cameraShakeOffset   // 相机抖动
let roomLights = []     // 环境灯光组
let spotLightGroup      // 聚光灯组
let emissiveMaterials = [] // 所有发光材质

// 加速模式状态
let isRushing = false
let rushProgress = 0
let speed = 0

// 加载状态
let isLoading = true
let loadingProgress = 0

// ============================================================
// 初始化
// ============================================================
function init() {
  // 场景
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 15, 60)

  // 相机
  camera = new THREE.PerspectiveCamera(33.4, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0.8, -11)
  camera.lookAt(0, 0.8, 0)

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true,
    alpha: false,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0

  // 后处理
  setupPostProcessing()

  // 构建场景
  createFloor()
  createShowroom()
  createCar()
  createSpeedLines()

  // 事件
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)

  // 点击汽车触发加速
  setupInteraction()

  // 开始动画循环
  animate()

  // 模拟加载完成后播放进场动画
  simulateLoading()
}

// ============================================================
// 加载动画
// ============================================================

/**
 * 模拟资源加载（3秒后完成）
 * 实际项目中这里应该加载模型、纹理等资源
 */
function simulateLoading() {
  const loaderScreen = document.getElementById('loader-screen')
  const loadingText = document.getElementById('loading-text')
  const letters = 'LOADING'.split('')

  // 字母依次出现动画
  letters.forEach((letter, i) => {
    setTimeout(() => {
      if (loadingText) {
        loadingText.textContent = 'L' + 'O'.repeat(i + 1) + 'ADING'.slice(i + 1)
      }
    }, i * 150)
  })

  // 3秒后完成加载
  setTimeout(() => {
    isLoading = false
    if (loaderScreen) {
      loaderScreen.classList.add('hollow')
    }
    playIntroAnimation()
  }, 3000)
}

/**
 * 进场动画（参考 su7-replica 的 enter() 时间线）
 * 相机从远处推进，灯光逐渐亮起，地面逐渐反射
 */
function playIntroAnimation() {
  // 1. 相机推进 (4秒)
  gsap.to(camera.position, {
    x: 0,
    y: 0.8,
    z: -7,
    duration: 4,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(0, 0.8, 0)
    },
  })

  // 2. 灯光渐亮 (4秒，延迟1秒)
  roomLights.forEach((light, i) => {
    gsap.to(light, {
      intensity: light.userData.originalIntensity,
      duration: 4,
      delay: 1 + i * 0.2,
      ease: 'power2.inOut',
    })
  })

  // 环境光强度
  gsap.to(scene, {
    fogNear: 15,
    fogFar: 60,
    duration: 4,
    delay: 1,
    ease: 'power2.inOut',
  })

  // 3. 地面反射强度渐强
  if (floorMirror) {
    gsap.to(floorMirror, {
      blur: 0.3,
      duration: 4,
      delay: 1,
      ease: 'power2.inOut',
    })
  }
}

// ============================================================
// 后处理（Bloom）
// ============================================================
let bloomPass, renderPass

function setupPostProcessing() {
  composer = new EffectComposer(renderer)

  renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,   // strength
    0.4,   // radius
    0.85   // threshold
  )
  composer.addPass(bloomPass)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)
}

// ============================================================
// 地面（带反射）
// ============================================================
function createFloor() {
  // 主地面
  const floorGeometry = new THREE.PlaneGeometry(100, 100)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.05,
    metalness: 0.9,
  })
  floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.5
  floor.receiveShadow = true
  scene.add(floor)

  // 网格
  const gridHelper = new THREE.GridHelper(40, 40, 0x222222, 0x111111)
  gridHelper.position.y = -0.49
  scene.add(gridHelper)

  // 简单反射平面
  const mirrorGeometry = new THREE.PlaneGeometry(30, 30)
  const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.0,
    metalness: 1.0,
    transparent: true,
    opacity: 0.3,
  })
  floorMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
  floorMirror.rotation.x = -Math.PI / 2
  floorMirror.position.y = -0.48
  scene.add(floorMirror)
}

// ============================================================
// 展示厅（灯光 + 墙面暗示）
// ============================================================
function createShowroom() {
  // 顶部主聚光灯（模拟展厅射灯）
  const spotLight1 = new THREE.SpotLight(0xffffff, 0, 50, Math.PI / 8, 0.5)
  spotLight1.position.set(0, 12, 0)
  spotLight1.target.position.set(0, 0, 0)
  spotLight1.castShadow = true
  spotLight1.shadow.mapSize.width = 2048
  spotLight1.shadow.mapSize.height = 2048
  spotLight1.userData.originalIntensity = 50
  scene.add(spotLight1)
  scene.add(spotLight1.target)
  roomLights.push(spotLight1)

  // 左右补光
  const leftLight = new THREE.PointLight(0xffffff, 0, 20)
  leftLight.position.set(-8, 3, 0)
  leftLight.userData.originalIntensity = 5
  scene.add(leftLight)
  roomLights.push(leftLight)

  const rightLight = new THREE.PointLight(0xffffff, 0, 20)
  rightLight.position.set(8, 3, 0)
  rightLight.userData.originalIntensity = 5
  scene.add(rightLight)
  roomLights.push(rightLight)

  // 环境光（非常暗）
  const ambientLight = new THREE.AmbientLight(0x111111, 0)
  ambientLight.userData.originalIntensity = 0.3
  scene.add(ambientLight)
  roomLights.push(ambientLight)

  // 发光灯带（模拟展厅天花板灯带）
  createLightStrips()
}

function createLightStrips() {
  // 横向灯带
  const stripMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0, // 初始为0，进场动画中渐亮
    toneMapped: false,
  })
  emissiveMaterials.push(stripMaterial)

  const stripGeometry = new THREE.BoxGeometry(12, 0.05, 0.1)

  // 前灯带
  const frontStrip = new THREE.Mesh(stripGeometry, stripMaterial)
  frontStrip.position.set(0, 5, -5)
  scene.add(frontStrip)

  // 后灯带
  const backStrip = new THREE.Mesh(stripGeometry, stripMaterial)
  backStrip.position.set(0, 5, 5)
  scene.add(backStrip)

  // 侧灯带
  const sideStripGeometry = new THREE.BoxGeometry(0.1, 0.05, 12)
  const leftStrip = new THREE.Mesh(sideStripGeometry, stripMaterial.clone())
  leftStrip.position.set(-6, 5, 0)
  scene.add(leftStrip)
  emissiveMaterials.push(leftStrip.material)

  const rightStrip = new THREE.Mesh(sideStripGeometry, stripMaterial.clone())
  rightStrip.position.set(6, 5, 0)
  scene.add(rightStrip)
  emissiveMaterials.push(rightStrip.material)
}

// ============================================================
// 创建汽车（更精致的版本）
// ============================================================
function createCar() {
  carGroup = new THREE.Group()

  // ---- 车身主体 ----
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x26d9e9,  // 小米 SU7 蓝色
    roughness: 0.3,
    metalness: 0.85,
    envMapIntensity: 1.0,
  })
  emissiveMaterials.push(bodyMaterial)

  // 车身底部（深色）
  const underbodyGeometry = new THREE.BoxGeometry(3.6, 0.15, 1.5)
  const underbodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.8,
  })
  const underbody = new THREE.Mesh(underbodyGeometry, underbodyMaterial)
  underbody.position.set(0, 0.05, 0)
  underbody.castShadow = true
  carGroup.add(underbody)

  // 车身主体（流线型，使用多个几何体）
  const bodyMainGeometry = new THREE.BoxGeometry(3.4, 0.5, 1.5)
  const bodyMain = new THREE.Mesh(bodyMainGeometry, bodyMaterial)
  bodyMain.position.set(0, 0.5, 0)
  bodyMain.castShadow = true
  carGroup.add(bodyMain)

  // 前舱盖（倾斜）
  const hoodGeometry = new THREE.BoxGeometry(1.2, 0.15, 1.35)
  const hood = new THREE.Mesh(hoodGeometry, bodyMaterial)
  hood.position.set(-1.5, 0.75, 0)
  hood.rotation.z = 0.15
  hood.castShadow = true
  carGroup.add(hood)

  // 后备箱
  const trunkGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.35)
  const trunk = new THREE.Mesh(trunkGeometry, bodyMaterial)
  trunk.position.set(1.4, 0.9, 0)
  trunk.castShadow = true
  carGroup.add(trunk)

  // 车顶（轿跑弧线）
  const roofGeometry = new THREE.BoxGeometry(1.4, 0.12, 1.3)
  const roof = new THREE.Mesh(roofGeometry, bodyMaterial)
  roof.position.set(0.2, 1.15, 0)
  roof.rotation.z = 0.05
  roof.castShadow = true
  carGroup.add(roof)

  // A柱（倾斜）
  const aPillarGeometry = new THREE.BoxGeometry(0.08, 0.5, 1.3)
  const aPillarLeft = new THREE.Mesh(aPillarGeometry, bodyMaterial)
  aPillarLeft.position.set(-0.55, 1.0, 0)
  aPillarLeft.rotation.z = -0.4
  carGroup.add(aPillarLeft)

  const aPillarRight = aPillarLeft.clone()
  aPillarRight.position.z = 0
  carGroup.add(aPillarRight)

  // ---- 玻璃 ----
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.25,
    roughness: 0,
    metalness: 0.1,
    transmission: 0.95,
    ior: 1.5,
  })

  // 前风挡
  const windshieldGeometry = new THREE.PlaneGeometry(1.35, 0.55)
  const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial)
  windshield.position.set(-0.7, 1.05, 0)
  windshield.rotation.z = -0.5
  carGroup.add(windshield)

  // 后窗
  const rearWindowGeometry = new THREE.PlaneGeometry(1.0, 0.35)
  const rearWindow = new THREE.Mesh(rearWindowGeometry, glassMaterial)
  rearWindow.position.set(0.9, 1.0, 0)
  rearWindow.rotation.z = 0.35
  carGroup.add(rearWindow)

  // 侧窗
  const sideWindowGeometry = new THREE.PlaneGeometry(1.1, 0.32)
  const sideWindowLeft = new THREE.Mesh(sideWindowGeometry, glassMaterial)
  sideWindowLeft.position.set(0.1, 1.05, 0.66)
  sideWindowLeft.rotation.y = 0
  carGroup.add(sideWindowLeft)

  const sideWindowRight = new THREE.Mesh(sideWindowGeometry, glassMaterial)
  sideWindowRight.position.set(0.1, 1.05, -0.66)
  sideWindowRight.rotation.y = Math.PI
  carGroup.add(sideWindowRight)

  // ---- 大灯 ----
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2,
    toneMapped: false,
  })
  emissiveMaterials.push(headlightMaterial)

  const headlightGeometry = new THREE.CircleGeometry(0.1, 16)
  const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightLeft.position.set(-1.72, 0.5, 0.5)
  headlightLeft.rotation.y = Math.PI / 2
  headlights.push(headlightLeft)
  carGroup.add(headlightLeft)

  const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightRight.position.set(-1.72, 0.5, -0.5)
  headlightRight.rotation.y = Math.PI / 2
  headlights.push(headlightRight)
  carGroup.add(headlightRight)

  // LED 日行灯带（贯穿式）
  const drlGeometry = new THREE.BoxGeometry(0.04, 0.03, 1.2)
  const drlMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00f5ff,
    emissiveIntensity: 3,
    toneMapped: false,
  })
  emissiveMaterials.push(drlMaterial)
  const drl = new THREE.Mesh(drlGeometry, drlMaterial)
  drl.position.set(-1.73, 0.45, 0)
  headlights.push(drl)
  carGroup.add(drl)

  // ---- 尾灯 ----
  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2,
    toneMapped: false,
  })
  emissiveMaterials.push(taillightMaterial)

  const taillightGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.35)
  const taillightLeft = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightLeft.position.set(1.72, 0.55, 0.5)
  taillights.push(taillightLeft)
  carGroup.add(taillightLeft)

  const taillightRight = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightRight.position.set(1.72, 0.55, -0.5)
  taillights.push(taillightRight)
  carGroup.add(taillightRight)

  // 尾灯贯穿灯带
  const tailDrlGeometry = new THREE.BoxGeometry(0.04, 0.04, 1.3)
  const tailDrlMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    emissive: 0xff3333,
    emissiveIntensity: 2,
    toneMapped: false,
  })
  emissiveMaterials.push(tailDrlMaterial)
  const tailDrl = new THREE.Mesh(tailDrlGeometry, tailDrlMaterial)
  tailDrl.position.set(1.73, 0.55, 0)
  taillights.push(tailDrl)
  carGroup.add(tailDrl)

  // ---- 轮毂 ----
  const wheelPositions = [
    { x: -1.15, z: 0.78 },
    { x: -1.15, z: -0.78 },
    { x: 1.15, z: 0.78 },
    { x: 1.15, z: -0.78 },
  ]

  wheelPositions.forEach((pos) => {
    const wheel = createDetailedWheel()
    wheel.position.set(pos.x, -0.18, pos.z)
    wheels.push(wheel)
    carGroup.add(wheel)
  })

  // 车底裙边（深色塑料件）
  const skirtGeometry = new THREE.BoxGeometry(3.2, 0.1, 1.6)
  const skirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
  })
  const skirt = new THREE.Mesh(skirtGeometry, skirtMaterial)
  skirt.position.set(0, 0.15, 0)
  carGroup.add(skirt)

  scene.add(carGroup)
}

function createDetailedWheel() {
  const wheelGroup = new THREE.Group()

  // 轮胎
  const tireGeometry = new THREE.TorusGeometry(0.3, 0.12, 16, 32)
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
  })
  const tire = new THREE.Mesh(tireGeometry, tireMaterial)
  tire.rotation.y = Math.PI / 2
  wheelGroup.add(tire)

  // 轮毂（铝合金质感）
  const rimGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 20)
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.15,
    metalness: 0.95,
  })
  const rim = new THREE.Mesh(rimGeometry, rimMaterial)
  rim.rotation.z = Math.PI / 2
  wheelGroup.add(rim)

  // 中心盖
  const capGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16)
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8,
  })
  const cap = new THREE.Mesh(capGeometry, capMaterial)
  cap.rotation.z = Math.PI / 2
  wheelGroup.add(cap)

  // 5条幅
  for (let i = 0; i < 5; i++) {
    const spokeGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.15)
    const spoke = new THREE.Mesh(spokeGeometry, rimMaterial)
    const angle = (i / 5) * Math.PI * 2
    spoke.position.set(0.05, Math.cos(angle) * 0.1, Math.sin(angle) * 0.1)
    spoke.rotation.x = angle
    wheelGroup.add(spoke)
  }

  // 刹车盘（内侧，通风盘样式）
  const diskGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 20)
  const diskMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.6,
    metalness: 0.3,
  })
  const disk = new THREE.Mesh(diskGeometry, diskMaterial)
  disk.rotation.z = Math.PI / 2
  disk.position.x = -0.04
  wheelGroup.add(disk)

  return wheelGroup
}

// ============================================================
// 速度线特效（Speed Lines）
// 使用自定义着色器在屏幕空间绘制速度线
// ============================================================
function createSpeedLines() {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uSpeed: { value: 0.0 },
      uOpacity: { value: 0.0 },
      uTime: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uSpeed;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        if (uSpeed < 0.01) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec2 uv = vUv;

        // 中心点（汽车消失点，通常在画面中心偏下）
        vec2 center = vec2(0.5, 0.35);

        // 计算从中心到当前像素的方向
        vec2 dir = uv - center;
        float dist = length(dir);

        // 速度线：沿径向方向拉长
        float angle = atan(dir.y, dir.x);
        float speedLine = sin(angle * 30.0 + uTime * 10.0) * 0.5 + 0.5;

        // 线条粗细（远处细，近处粗）
        float thickness = 0.002 * (1.0 - dist * 0.5);

        // 径向渐变（中心亮，边缘暗）
        float radialFade = smoothstep(0.8, 0.0, dist);

        // 随机性
        float noise = random(vec2(angle * 0.1, floor(uTime * 5.0)));

        // 最终线条强度
        float line = speedLine * radialFade * noise * uSpeed;
        line = smoothstep(thickness, thickness + 0.01, line);

        // 颜色（白色带点青色）
        vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.96, 1.0), dist * 0.5);

        gl_FragColor = vec4(color, line * uOpacity);
      }
    `,
  })

  speedLinesMesh = new THREE.Mesh(geometry, material)
  speedLinesMesh.renderOrder = 999
  speedLinesMesh.frustumCulled = false

  // 添加到场景但不使用普通渲染路径
  scene.add(speedLinesMesh)
}

// ============================================================
// 交互
// ============================================================
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function setupInteraction() {
  window.addEventListener('click', onMouseClick)
}

function onMouseClick(event) {
  if (isLoading) return

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(carGroup.children, true)

  if (intersects.length > 0) {
    triggerRush()
  }
}

// ============================================================
// 加速模式
// ============================================================
function triggerRush() {
  if (isRushing) {
    cancelRush()
    return
  }

  isRushing = true

  // 1. 加速线条出现
  gsap.to(speedLinesMesh.material.uniforms.uOpacity, {
    value: 0.8,
    duration: 1,
    ease: 'power2.out',
  })

  // 2. 速度值上升
  gsap.to({ speed: 0 }, {
    speed: 10,
    duration: 4,
    ease: 'power2.out',
    onUpdate: function () {
      speed = this.targets()[0].speed
      speedLinesMesh.material.uniforms.uSpeed.value = speed / 10
    },
  })

  // 3. FOV 增大（模拟加速感）
  gsap.to(camera, {
    fov: 45,
    duration: 3,
    ease: 'power2.out',
    onUpdate: () => {
      camera.updateProjectionMatrix()
    },
  })

  // 4. Bloom 增强
  gsap.to(bloomPass, {
    strength: 1.8,
    duration: 3,
    ease: 'power2.out',
  })

  // 5. 地面变暗
  if (floor.material) {
    gsap.to(floor.material, {
      roughness: 0.8,
      duration: 3,
    })
  }

  // 6. 灯带强度降低
  emissiveMaterials.forEach((mat) => {
    gsap.to(mat, {
      emissiveIntensity: mat.emissiveIntensity * 0.3,
      duration: 2,
      ease: 'power2.out',
    })
  })

  // 7. 相机抖动开始
  cameraShakeOffset = { x: 0, y: 0 }
}

function cancelRush() {
  if (!isRushing) return
  isRushing = false

  // 取消所有动画
  gsap.killTweensOf(speedLinesMesh.material.uniforms.uOpacity)
  gsap.killTweensOf(camera)
  gsap.killTweensOf(bloomPass)
  gsap.killTweensOf(floor?.material)

  // 恢复
  gsap.to(speedLinesMesh.material.uniforms.uOpacity, {
    value: 0,
    duration: 1,
  })
  gsap.to(speedLinesMesh.material.uniforms.uSpeed, {
    value: 0,
    duration: 1,
  })
  gsap.to(camera, {
    fov: 33.4,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      camera.updateProjectionMatrix()
    },
  })
  gsap.to(bloomPass, {
    strength: 0.8,
    duration: 2,
  })
  if (floor?.material) {
    gsap.to(floor.material, {
      roughness: 0.05,
      duration: 2,
    })
  }
  emissiveMaterials.forEach((mat) => {
    gsap.to(mat, {
      emissiveIntensity: mat.userData?.originalEmissiveIntensity || mat.emissiveIntensity,
      duration: 2,
    })
  })
}

// ============================================================
// 事件
// ============================================================
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

// ============================================================
// 动画循环
// ============================================================
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  const delta = clock.getDelta()

  // 加载时不渲染复杂场景
  if (isLoading) {
    renderer.render(scene, camera)
    return
  }

  // ---- 基础动画 ----
  // 汽车轻微浮动
  if (carGroup) {
    carGroup.position.y = Math.sin(elapsed * 0.8) * 0.02
    carGroup.rotation.y = currentCarRotationY + Math.sin(elapsed * 0.3) * 0.02
  }

  // 车轮自转（加速模式下更快）
  const wheelSpeed = isRushing ? speed * 0.1 : 0.02
  wheels.forEach((wheel) => {
    wheel.children.forEach((child) => {
      if (child.geometry?.type === 'TorusGeometry') {
        child.rotation.x += wheelSpeed
      }
    })
  })

  // 呼吸灯效果
  const breathe = Math.sin(elapsed * 2) * 0.5 + 0.5
  headlights.forEach((light) => {
    if (light.material?.emissive) {
      light.material.emissiveIntensity = 1.5 + breathe * 1.0
    }
  })
  taillights.forEach((light) => {
    if (light.material?.emissive) {
      light.material.emissiveIntensity = 1.5 + breathe * 0.5
    }
  })

  // ---- 加速模式特效 ----
  if (speedLinesMesh) {
    speedLinesMesh.material.uniforms.uTime.value = elapsed
  }

  // 相机抖动
  if (isRushing && cameraShakeOffset) {
    const shakeIntensity = 0.05 * Math.min(speed / 10, 1)
    cameraShakeOffset.x = (Math.random() - 0.5) * shakeIntensity
    cameraShakeOffset.y = (Math.random() - 0.5) * shakeIntensity
    camera.position.x += cameraShakeOffset.x
    camera.position.y += cameraShakeOffset.y
  }

  // ---- 鼠标跟随相机 ----
  if (!isRushing) {
    const targetRotY = mouseX * 0.15
    currentCarRotationY += (targetRotY - currentCarRotationY) * 0.02
  }

  composer.render()
}

// ============================================================
// 启动
// ============================================================
init()

console.log('✅ 汽车展示网站（增强版）已启动')
console.log('📌 操作说明：')
console.log('   - 等待 LOADING 动画完成（约3秒）')
console.log('   - 进场动画自动播放（相机推进 + 灯光亮起）')
console.log('   - 点击汽车：触发「加速模式」（Speed Lines + 抖动 + FOV变化）')
console.log('   - 再次点击：取消加速模式')
console.log('   - 鼠标移动：轻微跟随视角')

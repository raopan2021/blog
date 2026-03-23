/**
 * 汽车展示网站 - Three.js + Scroll Animation
 *
 * 功能：
 * 1. 滚动驱动 3D 场景变化（相机位置、物体颜色、光照强度）
 * 2. 用 Three.js 基本几何体构建一辆低多边形风格汽车
 * 3. 每个章节（Section）对应不同的视觉主题
 * 4. 汽车随滚动缓慢旋转，鼠标可交互
 * 5. Bloom 后处理效果（发光）
 */

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

// ============================================================
// 全局变量
// ============================================================
let scene, camera, renderer, composer
let carGroup, wheels = [], headlights = [], taillights = []
let floor
let scrollProgress = 0       // 0 ~ 1，滚动进度
let currentSection = 0        // 当前章节索引
let targetCarRotationY = 0    // 汽车目标旋转角度
let currentCarRotationY = 0
let mouseX = 0, mouseY = 0    // 归一化鼠标坐标

// 章节颜色主题
const sectionColors = [
  { bg: 0x0a0a0a, accent: 0xffffff, light: 0xffffff, ambient: 0x111111 },   // Section 1: 黑白
  { bg: 0x000811, accent: 0x00f5ff, light: 0x00f5ff, ambient: 0x002233 },  // Section 2: 科技蓝
  { bg: 0x0a0000, accent: 0xff6b6b, light: 0xff4444, ambient: 0x220000 },  // Section 3: 烈焰红
  { bg: 0x0a0a00, accent: 0xffd93d, light: 0xffd700, ambient: 0x222200 },  // Section 4: 金色
]

// ============================================================
// 初始化场景
// ============================================================
function init() {
  // 场景
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(sectionColors[0].bg, 10, 50)

  // 相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(6, 2.5, 8)

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true,
    alpha: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // 后处理（Bloom 发光效果）
  setupPostProcessing()

  // 创建内容
  createFloor()
  createCar()
  createLights()

  // 事件监听
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('scroll', onScroll)

  // 右侧指示器点击
  document.querySelectorAll('.indicator-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const section = dot.dataset.section
      const target = document.getElementById(section)
      target.scrollIntoView({ behavior: 'smooth' })
    })
  })

  animate()
}

// ============================================================
// 后处理（Bloom 发光）
// ============================================================
function setupPostProcessing() {
  composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // Bloom 发光通道
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,   // 强度
    0.4,   // 半径
    0.85   // 阈值（低于此值不发光）
  )
  composer.addPass(bloomPass)

  // 输出通道（确保颜色正确）
  const outputPass = new OutputPass()
  composer.addPass(outputPass)
}

// ============================================================
// 创建地面
// ============================================================
function createFloor() {
  // 反射地面
  const floorGeometry = new THREE.PlaneGeometry(100, 100)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.8,
  })
  floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.5
  floor.receiveShadow = true
  scene.add(floor)

  // 网格线（科技感）
  const gridHelper = new THREE.GridHelper(40, 40, 0x222222, 0x111111)
  gridHelper.position.y = -0.49
  scene.add(gridHelper)
}

// ============================================================
// 创建汽车（低多边形风格）
// 使用基本几何体组合：车身、车顶、车窗、车灯、轮毂等
// ============================================================
function createCar() {
  carGroup = new THREE.Group()

  // ---- 车身 ----
  // 主车身（流线型，使用多个几何体组合）
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.8,
  })

  // 车身主体（侧面看是一个梯形截面的流线型）
  const bodyShape = new THREE.Shape()
  bodyShape.moveTo(-2.2, 0)
  bodyShape.lineTo(2.2, 0)
  bodyShape.lineTo(2.0, 0.5)
  bodyShape.lineTo(-2.0, 0.5)
  bodyShape.lineTo(-2.2, 0)

  const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
    steps: 1,
    depth: 1.6,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
  })

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.set(0, 0, -0.8)
  body.castShadow = true
  carGroup.add(body)

  // ---- 车顶（轿跑弧线）----
  const roofGeometry = new THREE.BoxGeometry(1.6, 0.4, 1.4)
  roofGeometry.translate(0, 0.25, 0)
  const roof = new THREE.Mesh(roofGeometry, bodyMaterial)
  roof.position.set(0.1, 0.95, 0)
  roof.castShadow = true
  carGroup.add(roof)

  // 车顶前倾（营造运动感）
  roof.rotation.z = 0.08

  // ---- 前风挡玻璃 ----
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4,
    roughness: 0,
    metalness: 0.1,
    transmission: 0.9,
  })

  const windshieldGeometry = new THREE.PlaneGeometry(1.5, 0.5)
  const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial)
  windshield.position.set(-0.7, 1.0, 0)
  windshield.rotation.z = -0.5
  windshield.rotation.y = 0
  carGroup.add(windshield)

  // ---- 后窗玻璃 ----
  const rearGlassGeometry = new THREE.PlaneGeometry(1.2, 0.35)
  const rearGlass = new THREE.Mesh(rearGlassGeometry, glassMaterial)
  rearGlass.position.set(0.95, 0.95, 0)
  rearGlass.rotation.z = 0.3
  carGroup.add(rearGlass)

  // ---- 侧面车窗 ----
  const sideWindowGeometry = new THREE.PlaneGeometry(1.2, 0.35)
  const sideWindow1 = new THREE.Mesh(sideWindowGeometry, glassMaterial)
  sideWindow1.position.set(0.1, 1.0, 0.81)
  carGroup.add(sideWindow1)

  const sideWindow2 = new THREE.Mesh(sideWindowGeometry, glassMaterial)
  sideWindow2.position.set(0.1, 1.0, -0.81)
  sideWindow2.rotation.y = Math.PI
  carGroup.add(sideWindow2)

  // ---- 前大灯 ----
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2,
  })

  const headlightGeometry = new THREE.CircleGeometry(0.12, 16)
  const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightLeft.position.set(-2.15, 0.4, 0.55)
  headlightLeft.rotation.y = Math.PI / 2
  headlights.push(headlightLeft)
  carGroup.add(headlightLeft)

  const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial)
  headlightRight.position.set(-2.15, 0.4, -0.55)
  headlightRight.rotation.y = Math.PI / 2
  headlights.push(headlightRight)
  carGroup.add(headlightRight)

  // 前灯带（贯穿式 LED 日行灯）
  const drlGeometry = new THREE.BoxGeometry(0.05, 0.04, 1.0)
  const drlMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00f5ff,
    emissiveIntensity: 3,
  })
  const drl = new THREE.Mesh(drlGeometry, drlMaterial)
  drl.position.set(-2.2, 0.45, 0)
  headlights.push(drl)
  carGroup.add(drl)

  // ---- 后尾灯 ----
  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2,
  })

  const taillightGeometry = new THREE.BoxGeometry(0.05, 0.08, 0.4)
  const taillightLeft = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightLeft.position.set(2.2, 0.5, 0.5)
  taillightLeft.rotation.y = Math.PI / 2
  taillights.push(taillightLeft)
  carGroup.add(taillightLeft)

  const taillightRight = new THREE.Mesh(taillightGeometry, taillightMaterial)
  taillightRight.position.set(2.2, 0.5, -0.5)
  taillightRight.rotation.y = Math.PI / 2
  taillights.push(taillightRight)
  carGroup.add(taillightRight)

  // 尾灯贯穿灯带
  const tailDrlGeometry = new THREE.BoxGeometry(0.05, 0.04, 1.2)
  const tailDrlMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    emissive: 0xff3333,
    emissiveIntensity: 2,
  })
  const tailDrl = new THREE.Mesh(tailDrlGeometry, tailDrlMaterial)
  tailDrl.position.set(2.22, 0.5, 0)
  taillights.push(tailDrl)
  carGroup.add(tailDrl)

  // ---- 轮毂 ----
  const wheelPositions = [
    { x: -1.3, z: 0.85 },   // 左前
    { x: -1.3, z: -0.85 },  // 右前
    { x: 1.3, z: 0.85 },    // 左后
    { x: 1.3, z: -0.85 },   // 右后
  ]

  wheelPositions.forEach((pos) => {
    const wheel = createWheel()
    wheel.position.set(pos.x, -0.2, pos.z)
    wheels.push(wheel)
    carGroup.add(wheel)
  })

  // ---- 车底（略暗）----
  const underbodyGeometry = new THREE.BoxGeometry(3.8, 0.1, 1.6)
  const underbodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
  })
  const underbody = new THREE.Mesh(underbodyGeometry, underbodyMaterial)
  underbody.position.set(0, -0.1, 0)
  carGroup.add(underbody)

  // 整体调整
  carGroup.position.set(0, 0, 0)
  scene.add(carGroup)
}

/**
 * 创建单个车轮
 * 轮胎 + 轮毂组合
 */
function createWheel() {
  const wheelGroup = new THREE.Group()

  // 轮胎
  const tireGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32)
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.9,
  })
  const tire = new THREE.Mesh(tireGeometry, tireMaterial)
  tire.rotation.y = Math.PI / 2
  wheelGroup.add(tire)

  // 轮毂
  const rimGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16)
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.2,
    metalness: 0.9,
  })
  const rim = new THREE.Mesh(rimGeometry, rimMaterial)
  rim.rotation.z = Math.PI / 2
  wheelGroup.add(rim)

  // 轮毂装饰（5条幅）
  for (let i = 0; i < 5; i++) {
    const spokeGeometry = new THREE.BoxGeometry(0.02, 0.06, 0.18)
    const spoke = new THREE.Mesh(spokeGeometry, rimMaterial)
    const angle = (i / 5) * Math.PI * 2
    spoke.position.set(0.04, Math.cos(angle) * 0.1, Math.sin(angle) * 0.1)
    spoke.rotation.x = angle
    wheelGroup.add(spoke)
  }

  return wheelGroup
}

// ============================================================
// 创建光照
// ============================================================
let ambientLight, mainLight, rimLight1, rimLight2, spotLight

function createLights() {
  // 环境光
  ambientLight = new THREE.AmbientLight(0x111111, 1)
  scene.add(ambientLight)

  // 主光源（Key Light）
  mainLight = new THREE.DirectionalLight(0xffffff, 2)
  mainLight.position.set(5, 8, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.1
  mainLight.shadow.camera.far = 50
  scene.add(mainLight)

  // 边缘光 1（制造轮廓光）
  rimLight1 = new THREE.PointLight(0x00f5ff, 3, 20)
  rimLight1.position.set(-5, 3, 0)
  scene.add(rimLight1)

  // 边缘光 2
  rimLight2 = new THREE.PointLight(0xff6b6b, 2, 20)
  rimLight2.position.set(5, 2, 0)
  scene.add(rimLight2)

  // 聚光灯（照亮车身）
  spotLight = new THREE.SpotLight(0xffffff, 5, 30, Math.PI / 6, 0.5)
  spotLight.position.set(0, 10, 0)
  spotLight.target = carGroup
  spotLight.castShadow = true
  scene.add(spotLight)
}

// ============================================================
// 事件处理
// ============================================================

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(event) {
  // 归一化鼠标坐标
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress = Math.min(scrollTop / docHeight, 1)

  // 更新进度条
  document.getElementById('progressBar').style.width = `${scrollProgress * 100}%`

  // 计算当前章节
  const sections = document.querySelectorAll('.section')
  const sectionHeight = docHeight / (sections.length - 1)
  const newSection = Math.min(Math.floor(scrollTop / sectionHeight), sections.length - 1)

  if (newSection !== currentSection) {
    currentSection = newSection
    updateActiveIndicator()
    updateSectionActive()
  }
}

function updateActiveIndicator() {
  document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSection)
  })
}

function updateSectionActive() {
  document.querySelectorAll('.section').forEach((section, index) => {
    section.classList.toggle('active', index === currentSection)
  })
}

// ============================================================
// 动画循环
// ============================================================
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  const delta = clock.getDelta()

  // 1. 章节驱动的颜色过渡
  const colors = sectionColors[currentSection]
  const nextColors = sectionColors[Math.min(currentSection + 1, sectionColors.length - 1)]
  const t = (scrollProgress * (sectionColors.length - 1)) % 1

  // 插值背景色
  const bgColor = new THREE.Color(colors.bg).lerp(new THREE.Color(nextColors.bg), t)
  scene.background = bgColor
  scene.fog.color = bgColor

  // 插值光照
  const accentColor = new THREE.Color(colors.accent).lerp(new THREE.Color(nextColors.accent), t)
  rimLight1.color = accentColor

  // 2. 汽车旋转（基于滚动 + 鼠标）
  // 目标旋转：每个章节转 90°，加上鼠标微调
  targetCarRotationY = currentSection * (Math.PI / 2) + mouseX * 0.3
  currentCarRotationY += (targetCarRotationY - currentCarRotationY) * 0.03
  carGroup.rotation.y = currentCarRotationY

  // 3. 相机位置随滚动变化
  // Section 0: 侧面视角 (6, 2.5, 8)
  // Section 1: 45° 视角 (5, 1.5, 5)
  // Section 2: 正面视角 (-5, 2, 0)
  // Section 3: 俯视角度 (0, 8, 0.1)
  const cameraPositions = [
    { x: 6, y: 2.5, z: 8 },
    { x: 5, y: 1.5, z: 5 },
    { x: -5, y: 2, z: 0 },
    { x: 0, y: 8, z: 0.1 },
  ]
  const nextCamIdx = Math.min(currentSection + 1, cameraPositions.length - 1)
  const camT = (scrollProgress * (cameraPositions.length - 1)) % 1

  const camPos = {
    x: lerp(cameraPositions[currentSection].x, cameraPositions[nextCamIdx].x, camT),
    y: lerp(cameraPositions[currentSection].y, cameraPositions[nextCamIdx].y, camT),
    z: lerp(cameraPositions[currentSection].z, cameraPositions[nextCamIdx].z, camT),
  }
  camera.position.set(camPos.x, camPos.y, camPos.z)
  camera.lookAt(0, 0.5, 0)

  // 4. 车轮自转
  wheels.forEach((wheel) => {
    wheel.rotation.x += 0.02
  })

  // 5. 发光强度随章节变化
  const emissiveIntensity = 1 + Math.sin(elapsed * 3) * 0.5
  headlights.forEach((light) => {
    if (light.material && light.material.emissiveIntensity !== undefined) {
      // 仅对有 emissiveIntensity 属性的材质操作
    }
  })
  taillights.forEach((light) => {
    if (light.material) {
      light.material.emissiveIntensity = 1.5 + emissiveIntensity * 0.5
    }
  })

  // 6. 大灯闪烁（模拟呼吸灯）
  headlights.forEach((light) => {
    if (light.material && light.material.emissive) {
      light.material.emissiveIntensity = 1.5 + Math.sin(elapsed * 2) * 0.5
    }
  })

  // 7. 车身颜色随章节变化
  const carBodyMaterial = carGroup.children[0]?.material
  if (carBodyMaterial) {
    const targetColor = new THREE.Color(colors.accent).multiplyScalar(0.3).add(new THREE.Color(0x111111))
    carBodyMaterial.color.lerp(targetColor, 0.02)
  }

  // 8. 地面网格颜色变化
  if (floor && floor.material) {
    floor.material.color.lerp(new THREE.Color(colors.accent).multiplyScalar(0.05), 0.02)
  }

  composer.render()
}

// 线性插值
function lerp(a, b, t) {
  return a + (b - a) * t
}

// ============================================================
// 启动
// ============================================================
init()

console.log('✅ 汽车展示网站已启动')
console.log('📌 操作说明：')
console.log('   - 滚动页面：切换章节，汽车旋转，相机移动')
console.log('   - 点击右侧指示器：跳转章节')
console.log('   - 大灯和尾灯有呼吸灯效果')
console.log('   - 颜色主题随章节自动变化')

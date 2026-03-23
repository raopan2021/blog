/**
 * 3D 卡片展示项目 - Three.js
 *
 * 功能：
 * 1. 多个 3D 卡片网格排列
 * 2. 鼠标悬浮时卡片向鼠标方向倾斜
 * 3. 点击卡片触发翻转动画（180°旋转）
 * 4. 卡片正反面使用不同的材质和纹理
 * 5. 环境光 + 点光源照明
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ============================================================
// 场景初始化
// ============================================================
const canvas = document.getElementById('canvas')
const scene = new THREE.Scene()

// 透视相机（近大远小效果）
const camera = new THREE.PerspectiveCamera(
  45,                                    // FOV 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1,                                   // 近裁切面
  1000                                   // 远裁切面
)
camera.position.set(0, 0, 8)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,     // 抗锯齿
  alpha: true,         // 透明背景
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 适配高清屏
renderer.shadowMap.enabled = true                           // 开启阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap           // 柔和阴影

// 轨道控制器（可拖拽旋转场景）
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = false // 禁止缩放

// ============================================================
// 光照设置
// ============================================================

// 环境光（柔和的基础照明）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// 主光源（从上方照射）
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
mainLight.position.set(5, 5, 5)
mainLight.castShadow = true
mainLight.shadow.mapSize.width = 1024
mainLight.shadow.mapSize.height = 1024
scene.add(mainLight)

// 补光（消除阴影死区）
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3)
fillLight.position.set(-5, 0, 5)
scene.add(fillLight)

// 点光源（制造卡片边缘高光）
const pointLight = new THREE.PointLight(0x00ffff, 0.5, 20)
pointLight.position.set(0, 3, 3)
scene.add(pointLight)

// ============================================================
// 创建卡片纹理（使用 Canvas 绘制）
// ============================================================

/**
 * 绘制卡片正面纹理
 * @param {string} title - 卡片标题
 * @param {string} subtitle - 副标题
 * @param {string} gradientStart - 渐变起始色
 * @param {string} gradientEnd - 渐变结束色
 * @param {string} icon - 图标 emoji
 */
function createCardFrontTexture(title, subtitle, gradientStart, gradientEnd, icon) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, gradientStart)
  gradient.addColorStop(1, gradientEnd)

  // 圆角矩形背景
  ctx.fillStyle = gradient
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 20)
  ctx.fill()

  // 顶部装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 20)
  ctx.lineTo(492, 20)
  ctx.stroke()

  // 图标
  ctx.font = '80px serif'
  ctx.textAlign = 'center'
  ctx.fillText(icon, canvas.width / 2, 120)

  // 标题
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = 'white'
  ctx.fillText(title, canvas.width / 2, 200)

  // 副标题
  ctx.font = '20px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(subtitle, canvas.width / 2, 240)

  // 底部装饰
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fillRect(200, 280, 112, 4)

  return new THREE.CanvasTexture(canvas)
}

/**
 * 绘制卡片背面纹理
 */
function createCardBackTexture(number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // 深色背景
  ctx.fillStyle = '#1a1a2e'
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 20)
  ctx.fill()

  // 装饰性几何图案
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, i * 30, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 编号
  ctx.font = 'bold 80px monospace'
  ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(number.toString().padStart(2, '0'), canvas.width / 2, canvas.height / 2 + 20)

  // 说明文字
  ctx.font = '16px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('点击翻转回正面', canvas.width / 2, canvas.height - 40)

  return new THREE.CanvasTexture(canvas)
}

/**
 * 绘制圆角矩形（辅助函数）
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// ============================================================
// 创建 3D 卡片
// ============================================================

const cards = []   // 存储所有卡片对象
const cardConfigs = [
  { title: 'Mountain', subtitle: '自然风光', icon: '🏔️', front: ['#667eea', '#764ba2'], back: '01' },
  { title: 'Ocean', subtitle: '碧海蓝天', icon: '🌊', front: ['#06b6d4', '#3b82f6'], back: '02' },
  { title: 'Forest', subtitle: '翠绿森林', icon: '🌲', front: ['#10b981', '#059669'], back: '03' },
  { title: 'Sunset', subtitle: '落日余晖', icon: '🌅', front: ['#f59e0b', '#ef4444'], back: '04' },
  { title: 'Galaxy', subtitle: '浩瀚星空', icon: '🌌', front: ['#8b5cf6', '#6366f1'], back: '05' },
  { title: 'Aurora', subtitle: '极光之舞', icon: '🌌', front: ['#14b8a6', '#06b6d4'], back: '06' },
]

/**
 * 创建单张 3D 卡片
 * 使用 BoxGeometry（厚度很薄），正面和背面使用不同的材质
 */
function createCard(config, index) {
  const { title, subtitle, icon, front, back } = config

  // 卡片几何体（薄盒子）
  const geometry = new THREE.BoxGeometry(2, 1.25, 0.1)

  // 正面材质（带纹理）
  const frontTexture = createCardFrontTexture(title, subtitle, front[0], front[1], icon)
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.3,
    metalness: 0.1,
  })

  // 背面材质
  const backTexture = createCardBackTexture(back)
  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.5,
    metalness: 0.2,
  })

  // 侧面材质（深灰色边框效果）
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x222233,
    roughness: 0.8,
    metalness: 0.3,
  })

  // 组合材质：[右面, 左面, 上面, 下面, 正面, 背面]
  const materials = [
    sideMaterial, sideMaterial, sideMaterial, sideMaterial,
    frontMaterial, backMaterial
  ]

  const mesh = new THREE.Mesh(geometry, materials)

  // 网格布局（3列 × 2行）
  const cols = 3
  const row = Math.floor(index / cols)
  const col = index % cols
  const spacingX = 2.5
  const spacingY = 1.8

  mesh.position.set(
    (col - (cols - 1) / 2) * spacingX,  // X：根据列号计算
    -(row - 0.5) * spacingY,             // Y：根据行号计算
    0
  )

  mesh.castShadow = true
  mesh.receiveShadow = true

  // 存储翻转状态
  mesh.userData = {
    isFlipped: false,
    targetRotationY: 0,
    currentRotationY: 0,
    basePositionY: mesh.position.y,
  }

  scene.add(mesh)
  cards.push(mesh)
}

cardConfigs.forEach((config, index) => createCard(config, index))

// ============================================================
// 鼠标交互
// ============================================================

const mouse = new THREE.Vector2()    // 归一化的鼠标坐标
const raycaster = new THREE.Raycaster()
let hoveredCard = null               // 当前悬浮的卡片

// 鼠标移动监听
window.addEventListener('mousemove', (event) => {
  // 归一化鼠标坐标 (-1 到 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

// 点击监听
window.addEventListener('click', (event) => {
  // 发射射线检测点击的是哪张卡片
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)

  if (intersects.length > 0) {
    const card = intersects[0].object
    flipCard(card)
  }
})

/**
 * 翻转卡片
 * 原理：通过修改 targetRotationY，在动画循环中逐步插值到目标角度
 */
function flipCard(card) {
  card.userData.isFlipped = !card.userData.isFlipped
  card.userData.targetRotationY = card.userData.isFlipped ? Math.PI : 0
}

// ============================================================
// 动画循环
// ============================================================

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()

  // 1. 更新每张卡片的翻转动画（插值旋转）
  cards.forEach((card, index) => {
    // 平滑插值到目标角度（Lerp = Linear Interpolation）
    const lerp = (start, end, t) => start + (end - start) * t
    card.userData.currentRotationY = lerp(
      card.userData.currentRotationY,
      card.userData.targetRotationY,
      0.1  // 插值系数，越小越慢
    )

    // 应用翻转角度
    card.rotation.y = card.userData.currentRotationY

    // 悬浮效果：根据鼠标位置让卡片微微倾斜
    if (hoveredCard === card) {
      // 鼠标在屏幕中央时卡片恢复，偏离时倾斜
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, mouse.y * 0.3, 0.05)
      card.rotation.y = card.userData.currentRotationY + mouse.x * 0.3
    } else {
      // 非悬浮状态时平滑恢复
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, 0, 0.05)
    }

    // 悬浮时卡片轻微上浮
    const targetY = hoveredCard === card
      ? card.userData.basePositionY + 0.2
      : card.userData.basePositionY
    card.position.y = THREE.MathUtils.lerp(card.position.y, targetY, 0.1)

    // 轻微的上下浮动动画
    card.position.y += Math.sin(elapsed * 2 + index) * 0.001
  })

  // 2. 射线检测检测悬浮的卡片
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)
  hoveredCard = intersects.length > 0 ? intersects[0].object : null

  // 3. 点光源随时间移动，制造光影变化
  pointLight.position.x = Math.sin(elapsed * 0.5) * 3
  pointLight.position.z = Math.cos(elapsed * 0.5) * 3

  controls.update()
  renderer.render(scene, camera)
}

animate()

// ============================================================
// 响应式
// ============================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

console.log('✅ 3D 卡片展示项目已启动')
console.log('📌 操作说明：')
console.log('   - 鼠标悬浮：卡片跟随鼠标倾斜')
console.log('   - 点击卡片：触发 180° 翻转动画')
console.log('   - 拖拽空白处：旋转整个场景')

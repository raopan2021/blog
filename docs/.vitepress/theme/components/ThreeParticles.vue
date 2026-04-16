<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)
let animationId = null
let scene, camera, renderer, particles, particlePositions

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.querySelector('.VPContent')?.classList.contains('dark') || false

  const observer = new MutationObserver(() => {
    isDark.value = document.querySelector('.VPContent')?.classList.contains('dark') || false
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  initThree()
  animate()

  return () => observer.disconnect()
})

function initThree() {
  const canvas = canvasRef.value
  if (!canvas) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.z = 400

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Particles
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const colorPalette = [
    new THREE.Color('#bd34fe'),
    new THREE.Color('#41d1ff'),
    new THREE.Color('#ff6b6b'),
    new THREE.Color('#ffd93d'),
    new THREE.Color('#6bcb77'),
  ]

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  particlePositions = positions.slice()

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // Mouse interaction
  const onMouseMove = (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1

    if (particles) {
      particles.rotation.y = mouseX * 0.2
      particles.rotation.x = mouseY * 0.1
    }
  }
  window.addEventListener('mousemove', onMouseMove)

  // Resize
  const onResize = () => {
    if (!canvas) return
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  }
  window.addEventListener('resize', onResize)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  if (particles) {
    particles.rotation.y += 0.0003
    particles.rotation.x += 0.0001
  }

  renderer.render(scene, camera)
}

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="three-canvas" />
</template>

<style scoped>
.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>

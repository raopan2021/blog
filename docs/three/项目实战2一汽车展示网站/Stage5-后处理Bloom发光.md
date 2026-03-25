# Stage 5：后处理 — Bloom 发光

> 本节实现 UnrealBloomPass 后处理，让车灯产生真实的发光效果

## 5.1 什么是后处理？

后处理（Post-processing）是指在场景渲染完成后、对画面进行额外处理的技术：

```
渲染流程：

1. 渲染场景 → 2D 图像（基础渲染）
                    ↓
2. 后处理通道 → 各种视觉效果（Bloom、景深、泛光...）
                    ↓
3. 输出到屏幕
```

## 5.2 EffectComposer

Three.js 使用 `EffectComposer` 管理多个后处理通道：

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

/**
 * Postprocessing - 后处理管理器
 */
class Postprocessing {
  constructor(experience) {
    this.experience = experience

    // 1. 创建效果合成器
    this.composer = new EffectComposer(experience.renderer)

    // 2. 添加基础渲染通道（必须）
    const renderPass = new RenderPass(experience.scene, experience.camera)
    this.composer.addPass(renderPass)

    // 3. 添加 Bloom 发光通道
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.8,   // strength（发光强度）
      0.4,   // radius（发光半径）
      0.85   // threshold（发光阈值）
    )
    this.composer.addPass(this.bloomPass)

    // 4. 添加输出通道（确保颜色正确）
    const outputPass = new OutputPass()
    this.composer.addPass(outputPass)
  }

  // 动态调整发光强度
  setIntensity(value) {
    this.bloomPass.strength = value
  }

  // 调整发光平滑度
  setLuminanceSmoothing(value) {
    this.bloomPass.luminanceMaterial.smoothing = value
  }
}
```

## 5.3 Bloom 原理

Bloom（泛光）效果让画面中「亮的地方」向周围「溢出」：

```
原理步骤：

原始画面          高亮检测           高斯模糊          混合输出
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ ░░░░░░░ │     │ ░░░░░░░ │     │ ░░░░░░░ │     │ ░░░░░░░ │
│ ░█░░░░░ │     │ ░░░░░░░ │     │░░░░░░░░│     │░░░░░░░░│
│ ░░░░░░░ │  →  │ ░░░░░░░ │  →  │░░░░░░░░░│  →  │░░▒▒▒░░░│
│ ░░░░░░░ │     │ ░░░░░░░ │     │░░░░░░░░░│     │░░▒███▒░░│
│ ░░░░░░░ │     │ ░░░░░░░ │     │ ░░░░░░░ │     │░░░▒▒▒░░░│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                (提取亮点)      (模糊扩散)       (叠加混合)

█ = 原图亮点（车灯）
▒ = 模糊后的光晕
```

## 5.4 UnrealBloomPass 参数详解

```js
new UnrealBloomPass(
  new THREE.Vector2(width, height),  // 分辨率
  0.8,   // strength（发光强度）
            // 值越大，光晕越亮、范围越大
            // 0.5 = 微弱发光
            // 1.0 = 正常发光
            // 2.0 = 强烈发光（过曝感）
            // 本项目加速时：0.8 → 2.0

  0.4,   // radius（发光半径）
            // 亮点周围多大范围产生光晕
            // 0.0 = 只有像素本身发光
            // 1.0 = 周围较大范围发光

  0.85   // threshold（发光阈值）
            // 只有亮度超过这个值的像素才会发光
            // 0.0 = 所有像素都发光
            // 1.0 = 只有最亮的像素发光
            // 0.85 = 略低于白色的像素才会发光
            // 这样可以避免让暗部也产生光晕
)
```

## 5.5 为什么要用 emissive 材质？

要让 Bloom 生效，物体必须使用「自发光材质」：

```js
// 普通材质（不会发光）
const normalMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
})

// 自发光材质（会发光，被 Bloom 检测到）
const emissiveMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,           // 基础颜色
  emissive: 0xffffff,       // 发光颜色
  emissiveIntensity: 2.0,    // 发光强度
  toneMapped: false,         // 不经过色调映射（保持发光）
})
```

本项目中的发光物体：

| 物体 | emissive 颜色 | 初始强度 |
|------|-------------|---------|
| 前大灯 | 白色 | 2.0 |
| 日行灯带 | 青色 (0x00f5ff) | 3.0 |
| 尾灯 | 红色 | 2.0 |
| 展厅灯带 | 白色 | 1.0（进场时 0→1） |

## 5.6 toneMapped: false 的作用

```js
// toneMapped: true（默认）
// emissive 颜色会经过渲染器的色调映射
// 优点：颜色准确
// 缺点：过亮的 emissive 会被「压暗」，发光效果不明显

// toneMapped: false
// emissive 颜色直接输出，不经过色调映射
// 优点：发光效果强烈、真实
// 缺点：颜色可能偏白、偏亮
emissiveMaterial.toneMapped = false
```

## 5.7 动态调整 Bloom

在加速模式中，Bloom 参数会动态变化：

```js
// 正常状态
bloomPass.strength = 0.8       // 微弱发光
bloomPass.luminanceMaterial.smoothing = 1.6  // 平滑

// 加速状态
bloomPass.strength = 2.0       // 强烈发光
bloomPass.luminanceMaterial.smoothing = 0.4  // 更锐利
```

## 5.8 后处理链

EffectComposer 可以添加多个后处理通道：

```js
composer.addPass(renderPass)      // 1. 基础渲染
composer.addPass(bloomPass)       // 2. Bloom 发光
composer.addPass(outputPass)       // 3. 色彩输出

// 还可以添加更多：
// composer.addPass(new ShaderPass(myCustomShader))  // 自定义着色器
// composer.addPass(new BokehPass())               // 景深
// composer.addPass(new GlitchPass())               // 故障艺术
```

## 5.9 性能考虑

| 问题 | 解决方案 |
|------|---------|
| Bloom 性能开销大 | 分辨率设为 Canvas 的 1/2 或 1/4 |
| 多通道叠加慢 | 减少不必要的通道 |
| 手机性能差 | 使用较低分辨率或简化效果 |

```js
// 降低 Bloom 分辨率提升性能
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(width * 0.5, height * 0.5), // 半分辨率
  0.8, 0.4, 0.85
)
```

---


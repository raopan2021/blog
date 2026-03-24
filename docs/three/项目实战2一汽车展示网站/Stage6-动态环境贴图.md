# Stage 6：动态环境贴图

> 本节实现两个 HDR 环境贴图之间的实时动态混合

## 6.1 为什么需要动态环境贴图？

静态环境贴图的问题：

```
场景需求：
- 进场时：环境从全黑 → 逐渐亮起
- 正常状态：明亮的展厅
- 加速时：环境突然变暗（聚焦在车身上）

解决方案：
- 方案A：准备多个 HDR，在不同阶段切换
  ✗ 切换时会有「跳变」感，不够平滑

- 方案B：两个 HDR 之间插值混合
  ✓ 平滑过渡，效果自然 ← 本项目采用
```

## 6.2 FBO 工作原理

```
Framebuffer Object (FBO) = 渲染到纹理

正常渲染：
  场景 → GPU → 显示器

FBO 渲染：
  场景 → GPU → 显存中的纹理（FrameBuffer）
                    ↓
          这张纹理可以作为输入再次渲染
```

## 6.3 DynamicEnv 实现

```js
/**
 * DynamicEnv - 动态环境贴图
 *
 * 在两个 HDR 环境贴图之间平滑切换
 * 原理：用着色器实时混合两个 HDR，渲染到 FBO，
 *       然后把 FBO 的纹理作为场景的环境贴图
 */
class DynamicEnv {
  constructor(experience, config = {}) {
    this.experience = experience

    // 1. 创建 FBO（渲染目标）
    // 尺寸 1024x1024，可以根据需要调整
    this.fbo = new THREE.WebGLRenderTarget(1024, 1024, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    })

    // 2. 创建着色器材质
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // 两个 HDR 环境贴图
        uEnvmap1: { value: config.envmap1 || null },  // 夜晚（初始用这个）
        uEnvmap2: { value: config.envmap2 || null },  // 白天

        // 混合参数（GSAP 会修改这些值）
        uWeight: { value: 0 },    // 0=只用 envmap1，1=只用 envmap2
        uIntensity: { value: 1 }, // 整体强度
      },

      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          // 输出顶点在 NDC 坐标（覆盖全屏）
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
          // 采样两个 HDR 贴图
          vec4 c1 = texture2D(uEnvmap1, vUv);
          vec4 c2 = texture2D(uEnvmap2, vUv);

          // mix(a, b, t) = a * (1-t) + b * t
          // 当 uWeight=0 时，结果 = c1（只用夜晚）
          // 当 uWeight=1 时，结果 = c2（只用白天）
          // 当 uWeight=0.5 时，结果 = 两者各一半
          vec4 color = mix(c1, c2, uWeight);

          // 乘以强度
          gl_FragColor = color * uIntensity;
        }
      `,
    })

    // 3. 全屏四边形（用于渲染到 FBO）
    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),  // 全屏大小的平面
      this.material
    )

    // 4. 对外暴露为「纹理」
    this._envmap = this.fbo.texture
  }

  /** 获取混合后的环境贴图 */
  get envmap() {
    return this._envmap
  }

  /** 设置混合权重（0=只用HDR1，1=只用HDR2） */
  setWeight(value) {
    this.material.uniforms.uWeight.value = value
  }

  /** 设置整体强度 */
  setIntensity(value) {
    this.material.uniforms.uIntensity.value = value
  }

  /** 每帧渲染到 FBO */
  update() {
    // 保存当前渲染目标
    const previousTarget = this.experience.renderer.getRenderTarget()

    // 切换到 FBO
    this.experience.renderer.setRenderTarget(this.fbo)

    // 渲染四边形（用着色器混合两个 HDR）
    this.experience.renderer.render(this.quad, this.experience.camera)

    // 恢复渲染目标
    this.experience.renderer.setRenderTarget(previousTarget)
  }
}
```

## 6.4 混合原理图解

```
uWeight = 0              uWeight = 0.5             uWeight = 1
(只用夜晚)               (50% 混合)               (只用白天)

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ ░░░░░░░░░░░░ │       │ ▒▒░░░░░░░▒▒ │       │ ▒▒▒▒▒▒▒▒▒▒▒ │
│ ░░░░░░░░░░░░ │       │ ▒▒░░░░░░░▒▒ │       │ ▒▒▒▒▒▒▒▒▒▒▒ │
│ ░░░ TH ░░░░ │       │▒░░ TH ░░░▒ │       │ ▒▒ TH ▒▒▒▒ │
│ ░░░░░░░░░░░░ │       │ ▒▒░░░░░░░▒▒ │       │ ▒▒▒▒▒▒▒▒▒▒▒ │
│ ░░░░░░░░░░░░ │       │ ▒▒░░░░░░░▒▒ │       │ ▒▒▒▒▒▒▒▒▒▒▒ │
└──────────────┘       └──────────────┘       └──────────────┘
H = 夜晚（深蓝）         T = 白天（明亮）
mix(night, light, 0) = night
mix(night, light, 1) = light
```

## 6.5 在场景中使用

```js
// 1. 创建 DynamicEnv
const dynamicEnv = new DynamicEnv(experience, {
  envmap1: envmapNight,  // 夜晚 HDR
  envmap2: envmapLight,  // 白天 HDR
})

// 2. 设置为场景的环境贴图
// 所有使用 envMap 的材质都会反射这个贴图
scene.environment = dynamicEnv.envmap

// 3. 初始：只用夜晚 HDR
dynamicEnv.setWeight(0)
dynamicEnv.setIntensity(0)  // 完全黑

// 4. 进场动画中：强度逐渐增强
gsap.to(params, {
  envIntensity: 1,
  duration: 4,
  onUpdate: () => {
    dynamicEnv.setIntensity(params.envIntensity)
  }
})

// 5. 白天 HDR 逐渐加入
gsap.to(params, {
  envWeight: 1,
  duration: 4,
  onUpdate: () => {
    dynamicEnv.setWeight(params.envWeight)
  }
})

// 6. 加速模式：环境突然变暗
gsap.to(params, {
  envIntensity: 0.01,
  duration: 1,
  onUpdate: () => {
    dynamicEnv.setIntensity(params.envIntensity)
  }
})
```

## 6.6 全屏四边形渲染

```
正常场景渲染：
      相机视角
         ↓
    ┌─────────┐
    │  场景   │  ← 只有场景中的物体被渲染
    └─────────┘

渲染到 FBO（使用全屏四边形）：
    ┌─────────┐
    │  全屏   │  ← 着色器输出的整个画面
    │  四边形 │
    └─────────┘
         ↓
    FBO 纹理
```

## 6.7 性能优化

| 优化项 | 方法 |
|-------|------|
| FBO 尺寸 | 1024x1024 足够，不需要 2048 |
| 更新频率 | 每帧都更新（必须，因为参数在变化） |
| 精度 | 使用 HalfFloat 或 Float（如果支持） |

```js
// HalfFloat 精度（更快）
this.fbo = new THREE.WebGLRenderTarget(1024, 1024, {
  type: THREE.HalfFloatType,  // 或 THREE.FloatType
})
```

---


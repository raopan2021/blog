# Stage 10：相机抖动

> 本节实现 Simplex Noise 算法驱动的平滑相机抖动

## 10.1 为什么需要相机抖动？

```
真实感：高速运动时画面一定会抖动
速度感：抖动让玩家感受到「速度」和「力量」
沉浸感：完全稳定的画面反而显得「假」
```

纯随机抖动的问题：

```js
// ❌ 纯随机：抖动突兀、不自然
camera.position.x += (Math.random() - 0.5) * 0.1
camera.position.y += (Math.random() - 0.5) * 0.1
// 缺点：每帧都大幅跳变，看起来像是「故障」而不是「抖动」
```

Simplex Noise 抖动：

```js
// ✅ Simplex Noise：平滑连续的噪声
// 每帧微小变化，连续帧看起来是「平滑抖动」
offset.x = noise2D(t, 0) * 2
offset.y = noise2D(t, 100) * 2
offset.z = noise2D(t, 200) * 2
```

## 10.2 Simplex Noise 算法

```js
/**
 * createNoise2D - Simplex 2D Noise 实现
 *
 * Simplex Noise 是 Perlin Noise 的优化版本
 * 特点：
 * 1. 输出值域 [-1, 1]，连续平滑
 * 2. 相邻点的值相近，不会突变
 * 3. 比 Perlin 更少方向性伪影
 */
function createNoise2D() {
  // Permutation table（排列表）
  // 打乱的 0~255，用于哈希
  const p = []
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256)

  return function noise2D(x, y) {
    // 网格单元坐标
    const X = Math.floor(x) & 255  // 取整并限制在 [0, 255]
    const Y = Math.floor(y) & 255

    // 单元内相对坐标
    x -= Math.floor(x)
    y -= Math.floor(y)

    // 缓和曲线（ease curve）
    // 6t^5 - 15t^4 + 10t^3
    const u = fade(x)
    const v = fade(y)

    // 哈希并梯度向量
    const a = p[X] + Y
    const b = p[X + 1] + Y

    // 双线性插值
    return lerp(v,
      lerp(u, grad(p[a & 255], x, y), grad(p[b & 255], x - 1, y)),
      lerp(u, grad(p[(a + 1) & 255], x, y - 1), grad(p[(b + 1) & 255], x - 1, y - 1))
    )
  }
}

// 缓和曲线（5t^3 - 15t^4 + 10t^5）
// 作用：让过渡更平滑（导数在端点为0）
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

// 线性插值
function lerp(t, a, b) {
  return a + t * (b - a)
}

// 梯度函数
// 根据哈希值选择梯度方向，然后计算点积
function grad(hash, x, y) {
  const h = hash & 15  // 取低4位，得到16种方向
  const u = h < 8 ? x : y  // 选择 u 方向
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0  // 选择 v 方向
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}
```

## 10.3 CameraShake 类实现

```js
/**
 * CameraShake - 相机抖动组件
 *
 * 原理：
 * 1. 每帧用 Simplex Noise 生成 3D 随机向量
 * 2. 乘以强度系数
 * 3. 用 lerp 平滑过渡到目标偏移
 * 4. 添加到相机位置
 */
class CameraShake {
  constructor(experience) {
    this.experience = experience
    this.intensity = 0                    // 当前强度
    this.tweenedOffset = new THREE.Vector3()  // 平滑后的偏移
    this.noise2D = createNoise2D()        // Simplex Noise 实例
  }

  /** 设置抖动强度 */
  setIntensity(value) {
    this.intensity = value
  }

  /** 每帧更新 */
  update() {
    // 强度为 0 时不抖动
    if (this.intensity <= 0) return

    // 时间（秒）
    const t = performance.now() * 0.001

    // 用 Simplex Noise 生成 3D 随机偏移
    // 不同种子（0, 100, 200）确保三个轴的噪声不相关
    const offset = new THREE.Vector3(
      this.noise2D(t * 0.5, 0) * 2,
      this.noise2D(t * 0.5, 100) * 2,
      this.noise2D(t * 0.5, 200) * 2
    )

    // 乘以强度（加速模式中 = 1，正常状态 = 0）
    offset.multiplyScalar(0.1 * this.intensity)

    // 平滑插值（避免抖动太突兀）
    // lerp(当前, 目标, 0.1) = 每次移动 10% 的差距
    this.tweenedOffset.lerp(offset, 0.1)

    // 添加到相机位置
    this.experience.camera.position.add(this.tweenedOffset)
  }
}
```

## 10.4 抖动效果可视化

```
时间 →  0s    1s    2s    3s    4s
      ───────────────────────────────→
噪声值    0.2   0.8  -0.3   0.5  -0.1

相机 X  ──┬────┬────┬────┬────┬──
轴       ╱    ╱╲   ╱╲  ╱    ╲
        ╱    ╱  ╲  ╱  ╲╱    ╲
       ╱    ╱    ╲╱    ╲    ╲

intensity 从 0 → 1：
      ───────────────────────────────→ 加速时间
抖动幅度  小 ──────────────────────→ 大
```

## 10.5 为什么用 lerp 做平滑？

```js
// 直接赋值（不推荐）
this.camera.position.add(offset)

// lerp 平滑（推荐）
this.tweenedOffset.lerp(offset, 0.1)  // 每次靠近 10%
this.camera.position.add(this.tweenedOffset)

/*
对比：

直接赋值：
  帧1: 0 → 0.1（跳变）
  帧2: 0.1 → -0.05（跳变）
  帧3: -0.05 → 0.08（跳变）
  画面「颤抖」

lerp 平滑：
  帧1: 0 → 0.01
  帧2: 0.01 → 0.025
  帧3: 0.025 → 0.042
  帧4: 0.042 → 0.065
  ...
  画面「平滑抖动」
*/
```

## 10.6 抖动强度参数

| 参数 | 正常状态 | 加速状态 |
|------|---------|---------|
| cameraShakeIntensity | 0 | 1 |
| offset.multiplyScalar | 0 | 0.1 |
| 每帧最大偏移 | 0 | ±0.2 单位 |

---


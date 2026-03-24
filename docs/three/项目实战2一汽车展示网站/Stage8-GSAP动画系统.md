# Stage 8：GSAP 动画系统

> 本节实现动画参数系统和 GSAP 时间线进场动画

## 8.1 为什么需要动画库？

手写动画的问题：

```js
// ❌ 手写动画：复杂、容易出错
let progress = 0
function animate() {
  progress += 0.01

  // 每帧都要手动计算
  camera.position.z = -11 + progress * 4
  light.intensity = progress
  floor.color.r = 1 - progress

  // 不同属性变化速度不同？很难协调
  // 暂停/恢复？很难
  // 时间控制？很难

  requestAnimationFrame(animate)
}
```

GSAP 的优势：

```js
// ✅ GSAP 动画：简洁、强大、可控
gsap.to(params.cameraPos, {
  z: -7,          // 目标值
  duration: 4,     // 持续 4 秒
  ease: 'power2.inOut',  // 缓动函数
})
```

## 8.2 动画参数对象

所有需要动画的属性都集中在一个对象里：

```js
/**
 * params - 全局动画参数
 * 所有 GSAP 动画都会修改这个对象的属性
 */
const params = {
  // ===== 相机 =====
  cameraPos: { x: 0, y: 0.8, z: -11 },  // 初始：远处
  cameraFov: 33.4,           // 视野角度

  // ===== 速度 =====
  speed: 0,                  // 0=静止，10=全速

  // ===== 灯光 =====
  lightAlpha: 0,              // 灯光颜色：0=黑，1=白
  lightIntensity: 0,          // 灯光强度
  lightOpacity: 1,            // 灯带透明度

  // ===== 环境 =====
  envIntensity: 0,            // 环境贴图强度
  envWeight: 0,             // 两个 HDR 之间的权重

  // ===== 地面 =====
  reflectIntensity: 0,       // 地面反射强度
  floorLerpColor: 0,        // 地面颜色插值

  // ===== 车身 =====
  carBodyEnvIntensity: 1,    // 车身环境反射强度

  // ===== 相机抖动 =====
  cameraShakeIntensity: 0,   // 抖动强度

  // ===== 后处理 =====
  bloomLuminanceSmoothing: 1.6,
  bloomIntensity: 1,

  // ===== 加速特效 =====
  speedUpOpacity: 0,         // Speed Lines 透明度

  // ===== 状态标志 =====
  isCameraMoving: false,     // 相机是否在自动移动
  isRushing: false,         // 是否在加速模式
  disableInteract: false,    // 是否禁用交互
}
```

## 8.3 GSAP Timeline

Timeline = 时间线，可以编排多个动画的顺序和重叠：

```js
// 创建时间线
const tl = gsap.timeline()

// 添加动画（默认在上一个动画结束后开始）
tl.to(params.cameraPos, { z: -7, duration: 4 })
tl.to(params.lightIntensity, { value: 1, duration: 4 })

// 相对定位
tl.to(params, { a: 1, duration: 2 }, '<')     // '<' = 与上一个同时开始
tl.to(params, { b: 1, duration: 2 }, '+=1')   // '+1' = 延迟 1 秒
tl.to(params, { c: 1, duration: 2 }, '-=1')   // '-=1' = 提前 1 秒
```

## 8.4 进场动画

```js
/**
 * enter - 进场动画
 *
 * 时序：
 * t=0s    ：LOADING 屏幕消失
 * t=1s    ：灯光开始渐亮
 * t=1s    ：相机开始推进
 * t=1.5s  ：环境贴图开始增强
 * t=4s    ：相机推进到终点
 * t=5s    ：灯光达到最亮
 */
function enter() {
  params.disableInteract = true

  // ========== 阶段 1：初始状态（全黑）==========
  dynamicEnv.setWeight(0)
  dynamicEnv.setIntensity(0)
  startRoomLightMat.emissive.set(0x000000)
  startRoomLightMat.emissiveIntensity = 0
  startRoomFloorMat.color.set(0x000000)
  startRoomFloorMat.envMapIntensity = 0

  // 1 秒后加载屏幕淡出
  setTimeout(() => {
    loaderScreen.classList.add('hollow')
  }, 1000)

  // ========== 阶段 2：相机推进 ==========
  const t1 = gsap.timeline()
  tweens.push(t1)  // 存入数组，方便后续清除

  // 相机从 z=-11 移动到 z=-7
  t1.to(params.cameraPos, {
    x: 0, y: 0.8, z: -7,
    duration: 4,
    ease: 'power2.inOut',
    onComplete: () => {
      params.isCameraMoving = false
      params.disableInteract = false  // 动画结束后启用交互
    },
  })

  // ========== 阶段 3：灯光渐亮 ==========
  const t2 = gsap.timeline()
  tweens.push(t2)

  const blackColor = new THREE.Color(0x000000)
  const whiteColor = new THREE.Color(0xffffff)
  const lightColor = new THREE.Color()

  t2.to(params, {
    lightAlpha: 1,           // 颜色：黑→白
    lightIntensity: 1,      // 强度：0→1
    reflectIntensity: 25,   // 反射：0→25
    duration: 4,
    delay: 1,              // 延迟 1 秒开始
    ease: 'power2.inOut',
    onUpdate: () => {
      // 颜色插值
      lightColor.copy(blackColor).lerp(whiteColor, params.lightAlpha)

      // 更新灯带材质
      startRoomLightMat.emissive.set(lightColor)
      startRoomLightMat.emissiveIntensity = params.lightIntensity

      // 更新地面颜色和反射
      startRoomFloorMat.color.set(lightColor)
      startRoomFloorMat.envMapIntensity = params.reflectIntensity * 0.01
    },
  })

  // ========== 阶段 4：环境贴图 ==========
  const t3 = gsap.timeline()
  tweens.push(t3)

  t3.to(params, {
    envIntensity: 1,
    duration: 4,
    delay: 0.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      dynamicEnv.setIntensity(params.envIntensity)
    },
  }).to(params, {
    envWeight: 1,
    duration: 4,
    ease: 'power2.inOut',
    onUpdate: () => {
      dynamicEnv.setWeight(params.envWeight)
    },
  }, '-=2.5')  // 提前 2.5 秒开始（重叠 1.5 秒）
}
```

## 8.5 时间线图解

```
时间轴（秒）：
0     1     2     3     4     5
│     │     │     │     │     │
      ├─────────────────────────┤  ← 相机推进（t1）
      │  ├──────────────────────┤  ← 灯光渐亮（t2）
      │  │      ├──────────────┤  ← 环境强度（t3）
      │  │      ├──────────────────┤  ← 环境权重（t3）

'-=2.5' 相对定位：
t3 的 envWeight 在 t3.envIntensity 开始前 2.5 秒就开始
即 t=1.5s 时 envWeight 开始（而 envIntensity 是 t=0.5s 开始的）
```

## 8.6 缓动函数（Easing）

```js
// GSAP 内置缓动函数

// 线性（机械感）
ease: 'none'

// 慢入慢出（最常用）
ease: 'power1.inOut'

// 更明显的慢入慢出
ease: 'power2.inOut'

// 更快
ease: 'power3.inOut'

// elastic：弹性效果
ease: 'elastic.out'

// bounce：弹跳效果
ease: 'bounce.out'

// 自定义
ease: 'myEase.custom'
```

```
缓动函数图解：

          ease: 'none'           ease: 'power2.inOut'

value     ┤                      ┤
│        ╱                       ╱╲
│       ╱                       ╱   ╲
│      ╱                       ╱     ╲
│     ╱                       ╱       ╲
│    ╱                       ╱         ╲
├───────────────time    ├───────────────time
```

## 8.7 Lerp 插值

颜色插值使用 `THREE.Color.lerp()`：

```js
const black = new THREE.Color(0x000000)
const white = new THREE.Color(0xffffff)
const result = new THREE.Color()

// lerp(target, t) = 当前颜色向 target 插值，t=0 时不变，t=1 时完全等于 target
result.copy(black).lerp(white, 0.5)  // result = 50% 灰

// 常用于动画
onUpdate: () => {
  lightColor.copy(blackColor).lerp(whiteColor, params.lightAlpha)
  mat.emissive.set(lightColor)
}
```

## 8.8 清除动画

```js
// 切换状态前需要清除所有现有动画
function clearAllTweens() {
  tweens.forEach((t) => t.kill())
  tweens = []
}

// 然后重新开始新的动画
rush() {
  clearAllTweens()
  const t4 = gsap.timeline()
  tweens.push(t4)
  // ...
}
```

---


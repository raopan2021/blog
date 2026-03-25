# Stage 9：加速模式

> 本节实现点击汽车触发的「加速模式」及其完整动画时间线

## 9.1 加速模式概述

加速模式是小米 SU7 官网最核心的交互特效。点击汽车后：

```

正常状态 ──点击──→ 加速中 ──再次点击──→ 正常状态
```


| 阶段 | 效果 |
|------|------|
| 正常 | 展厅明亮，车身有环境反射 |
| 点击 | 灯带熄灭、地面变暗、环境变暗 |
| 加速 | Speed Lines 出现、相机抖动、Bloom 增强、车身反射暴增 |
| 再次点击 | 所有效果恢复 |

## 9.2 rush() 完整时间线

```js
/**
 * rush - 触发加速模式
 *
 * 时间线编排（参考 su7-replica）：
 *
 * t=0s    : 速度开始上升
 * t=1s    : 灯带开始变暗
 * t=2s    : FOV 开始增大、Speed Lines 出现
 * t=3s    : 速度达到最大值
 * t=4s    : 环境贴图切换（→亮度最低）
 * t=4s    : Bloom + 车身反射 + 相机抖动开始
 * t=7s    : 全部效果达到峰值
 */
function rush() {
  // 状态检查
  if (params.isRushing) {
    rushDone()  // 已经在加速 → 恢复正常
    return
  }

  params.disableInteract = true
  params.isRushing = true

  // 清除所有现有动画
  clearAllTweens()

  // ========== 时间线 1：速度上升 ==========
  const t4 = gsap.timeline()
  tweens.push(t4)

  t4.to(params, {
    speed: 4,         // 先到中等速度
    duration: 2,
    ease: 'power2.out',
    onComplete: () => {
      params.isRushing = true
      params.disableInteract = false
    },
  }).to(params, {
    speed: 10,        // 再到最大速度
    duration: 4,
  })

  // ========== 时间线 2：灯带渐暗 ==========
  const t5 = gsap.timeline()
  tweens.push(t5)

  t5.to(params, {
    lightOpacity: 0,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      startRoomLightMat.opacity = params.lightOpacity
    },
  })

  // ========== 时间线 3：地面变暗 ==========
  const t6 = gsap.timeline()
  tweens.push(t6)

  t6.to(params, {
    floorLerpColor: 1,
    duration: 4,
    ease: 'power2.out',
    onUpdate: () => {
      // 白色向黑色插值
      const c = new THREE.Color(0xffffff).lerp(
        new THREE.Color(0x000000),
        params.floorLerpColor
      )
      startRoomFloorMat.color.set(c)
    },
  })

  // ========== 时间线 4：环境贴图变暗 ==========
  const t7 = gsap.timeline()
  tweens.push(t7)

  t7.to(params, {
    envIntensity: 0.01,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      dynamicEnv.setIntensity(params.envIntensity)
    },
  })

  // ========== 时间线 5：FOV + 加速特效 ==========
  const t8 = gsap.timeline()
  tweens.push(t8)

  t8.to(params, {
    speedUpOpacity: 1,    // Speed Lines 出现
    cameraFov: 36,        // FOV 增大（广角）
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      // 显示/隐藏加速特效模型
      if (speedupModel.scene) {
        speedupModel.scene.visible = params.speedUpOpacity > 0
      }
    },
  })

  // ========== 时间线 6：Bloom + 抖动（延迟 1 秒）==========
  setTimeout(() => {
    const t9 = gsap.timeline()
    tweens.push(t9)

    // 切换环境贴图（聚焦车身）
    scene.environment = dynamicEnv.envmap

    t9.to(params, {
      carBodyEnvIntensity: 10,    // 车身反射暴增（1→10）
      cameraShakeIntensity: 1,     // 相机开始抖动
      bloomLuminanceSmoothing: 0.4, // Bloom 更锐利
      bloomIntensity: 2,           // Bloom 强度翻倍
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => {
        // 更新车身反射
        if (carBodyMat) {
          carBodyMat.envMapIntensity = params.carBodyEnvIntensity
        }

        // 更新相机抖动
        if (cameraShake) {
          cameraShake.setIntensity(params.cameraShakeIntensity)
        }

        // 更新 Bloom
        postprocessing.setLuminanceSmoothing(params.bloomLuminanceSmoothing)
        postprocessing.setIntensity(params.bloomIntensity)
      },
    })
  }, 1000)  // 延迟 1 秒
}
```


## 9.3 加速效果一览

```

正常状态                                  加速状态
─────────────────────────────────────────────
speed: 0                              speed: 10
lightOpacity: 1                       lightOpacity: 0
floorColor: 白色                       floorColor: 黑色
envIntensity: 1                       envIntensity: 0.01
cameraFov: 33.4°                      cameraFov: 36°
speedUpOpacity: 0                     speedUpOpacity: 1
carBodyEnvIntensity: 1               carBodyEnvIntensity: 10
cameraShakeIntensity: 0               cameraShakeIntensity: 1
bloomIntensity: 1                     bloomIntensity: 2
```


## 9.4 rushDone() 恢复正常

```js
function rushDone() {
  if (!params.isRushing) return

  params.disableInteract = true
  params.isRushing = false
  clearAllTweens()

  // 速度恢复
  const t4 = gsap.timeline()
  tweens.push(t4)
  t4.to(params, {
    speed: 0,
    duration: 2,
    onComplete: () => { params.disableInteract = false },
  })

  // 灯带恢复
  const t5 = gsap.timeline()
  tweens.push(t5)
  t5.to(params, {
    lightOpacity: 1,
    duration: 1,
    onUpdate: () => {
      startRoomLightMat.opacity = params.lightOpacity
    },
  })

  // 地面恢复
  const t6 = gsap.timeline()
  tweens.push(t6)
  t6.to(params, {
    floorLerpColor: 0,
    duration: 4,
    onUpdate: () => {
      const c = new THREE.Color(0xffffff).lerp(
        new THREE.Color(0x000000),
        1 - params.floorLerpColor
      )
      startRoomFloorMat.color.set(c)
    },
  })

  // 环境恢复
  const t7 = gsap.timeline()
  tweens.push(t7)
  t7.to(params, {
    envIntensity: 1,
    duration: 1,
    onUpdate: () => {
      dynamicEnv.setIntensity(params.envIntensity)
    },
  })

  // FOV 恢复
  const t8 = gsap.timeline()
  tweens.push(t8)
  t8.to(params, {
    speedUpOpacity: 0,
    cameraFov: 33.4,
    duration: 2,
    onUpdate: () => {
      if (speedupModel.scene) {
        speedupModel.scene.visible = params.speedUpOpacity > 0
      }
    },
  })

  // Bloom + 抖动恢复
  const t9 = gsap.timeline()
  tweens.push(t9)
  t9.to(params, {
    carBodyEnvIntensity: 1,
    cameraShakeIntensity: 0,
    bloomLuminanceSmoothing: 1.6,
    bloomIntensity: 1,
    duration: 4,
    onUpdate: () => {
      if (carBodyMat) carBodyMat.envMapIntensity = params.carBodyEnvIntensity
      if (cameraShake) cameraShake.setIntensity(params.cameraShakeIntensity)
      postprocessing.setLuminanceSmoothing(params.bloomLuminanceSmoothing)
      postprocessing.setIntensity(params.bloomIntensity)
    },
  })

  scene.environment = dynamicEnv.envmap
}
```


## 9.5 加速模式视觉原理

```

FOV 增大（广角）→ 物体「变小」但视野「变大」
→ 产生「速度感」

carBodyEnvIntensity 增大 → 车身反射「过曝」
→ 产生「速度感」+ 「炫酷感」

cameraShake → 画面轻微抖动
→ 产生「紧张感」

speedUpOpacity → Speed Lines 出现
→ 明确传达「正在加速」
```


---


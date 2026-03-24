# Stage 3：光照系统

本 Stage 介绍 Three.js 的四种光源及其组合使用方式。

## 四种光源类型

### AmbientLight（环境光）

均匀照亮所有物体，无方向，无阴影：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)
```

- 第一个参数：颜色（十六进制）
- 第二个参数：强度（0~1）

### DirectionalLight（方向光）

从特定方向照射的平行光，类似太阳光，制造阴影：

```js
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
mainLight.position.set(5, 5, 5)  // 光源位置
mainLight.castShadow = true      // 开启阴影
mainLight.shadow.mapSize.set(1024, 1024)  // 阴影贴图分辨率
scene.add(mainLight)
```

### PointLight（点光源）

从一点向所有方向发射，模拟灯泡效果：

```js
const pointLight = new THREE.PointLight(0x00ffff, 0.5, 20)
pointLight.position.set(0, 3, 3)
scene.add(pointLight)
```

- 第三个参数 `20`：光照最大距离

### SpotLight（聚光灯）

锥形光束，可制造舞台聚光灯效果（本项目未使用）。

## 本项目的光照组合

```js
// 1. 环境光：基础照明，消除全黑死角
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// 2. 主方向光：主要光源，制造阴影
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
mainLight.position.set(5, 5, 5)
mainLight.castShadow = true
mainLight.shadow.mapSize.set(1024, 1024)
scene.add(mainLight)

// 3. 补光：蓝色调，消除左侧阴影死区
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3)
fillLight.position.set(-5, 0, 5)
scene.add(fillLight)

// 4. 点光源：青色高光，绕 Y 轴旋转制造光影变化
const pointLight = new THREE.PointLight(0x00ffff, 0.5, 20)
pointLight.position.set(0, 3, 3)
scene.add(pointLight)
```

## 光照原理图

```
            主方向光（白色，强度1.2）
                  ↓
    +----------[卡片]----------+
    |           ↑              |
    |           |              |
  补光(蓝)  环境光(白)    点光源(青)
  (-5,0,5)  (均匀分布)    (0,3,3)→绕Y旋转
```

## 为什么需要多种光？

- **环境光**：确保背面、缝隙等位置不会完全漆黑
- **方向光**：提供明确的光源方向和阴影
- **补光**：消除单方向光造成的强烈阴影死区
- **点光源**：模拟真实灯泡的散射效果，高光区域会随时间移动

## 光源参数表

| 光源 | 颜色 | 强度 | 位置 | 阴影 |
|------|------|------|------|------|
| AmbientLight | `0xffffff` | 0.4 | 无 | 无 |
| DirectionalLight | `0xffffff` | 1.2 | (5,5,5) | 有 |
| DirectionalLight(补) | `0x4488ff` | 0.3 | (-5,0,5) | 无 |
| PointLight | `0x00ffff` | 0.5 | (0,3,3) | 无 |


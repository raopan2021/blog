# Stage 6：鼠标交互与射线检测

本 Stage 介绍如何检测鼠标悬浮和点击，实现卡片交互。

## 射线检测原理

Raycaster（射线检测器）从相机发射一条射线，穿过鼠标位置，与场景中的物体求交：

```
相机位置
    ↑
    | 射线
    |
    ↓
鼠标位置(屏幕) ────────────────────────────→ 场景中的卡片
```

## 归一化鼠标坐标

鼠标坐标需要从屏幕像素坐标转换为 NDC 坐标（-1 到 1）：

```js
const mouse = new THREE.Vector2()  // 初始值 (0, 0)

window.addEventListener('mousemove', (event) => {
  // 将屏幕坐标转换为 NDC 坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  // Y 轴翻转（屏幕 Y 向下，Three.js Y 向上）
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})
```

## 射线检测实现

```js
const raycaster = new THREE.Raycaster()
let hoveredCard = null  // 当前悬浮的卡片

function animate() {
  requestAnimationFrame(animate)

  // 发射射线，检测与所有卡片的交点
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)

  // 更新悬浮状态
  hoveredCard = intersects.length > 0 ? intersects[0].object : null

  // ... 其他逻辑
}
```

## 点击检测

```js
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)

  if (intersects.length > 0) {
    const card = intersects[0].object
    flipCard(card)
  }
})
```

## 悬浮效果

当鼠标悬浮在卡片上时，卡片会：
1. 向鼠标方向微微倾斜
2. 轻微上浮

```js
cards.forEach((card) => {
  if (hoveredCard === card) {
    // 鼠标在 X 方向偏移 → 卡片 Y 轴旋转
    card.rotation.y = card.userData.currentRotationY + mouse.x * 0.3

    // 鼠标在 Y 方向偏移 → 卡片 X 轴旋转
    card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, mouse.y * 0.3, 0.05)

    // 悬浮上浮
    card.position.y = THREE.MathUtils.lerp(
      card.position.y,
      card.userData.basePositionY + 0.2,
      0.1
    )
  } else {
    // 非悬浮状态时恢复
    card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, 0, 0.05)
  }
})
```

## Lerp（线性插值）

Three.js 提供内置的 lerp 方法，用于平滑过渡：

```js
THREE.MathUtils.lerp(current, target, t)
// 等价于
current + (target - current) * t
```

- `t = 0.1`：每帧向目标靠近 10%
- `t = 0.05`：每帧向目标靠近 5%，过渡更慢更平滑

## 完整交互代码

```js
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let hoveredCard = null

// 监听鼠标移动
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

// 监听鼠标点击
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)
  if (intersects.length > 0) {
    flipCard(intersects[0].object)
  }
})
```

[[返回项目首页|../index]] | [[上一 Stage|../Stage5-3D卡片创建]] | [[下一 Stage|../Stage6-翻转动画]]

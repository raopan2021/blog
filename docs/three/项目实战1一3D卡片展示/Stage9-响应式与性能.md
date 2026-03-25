# Stage 9：响应式与性能优化

本 Stage 介绍窗口适配、高清屏处理、移动端支持等实用技巧。

## 窗口 resize 适配

当窗口大小改变时，必须更新相机的宽高比和渲染器的尺寸：

```js
window.addEventListener('resize', () => {
  // 1. 更新相机的宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 2. 让相机重新计算投影矩阵
  camera.updateProjectionMatrix()
  // 3. 更新渲染器的画布尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```


**注意**：`camera.updateProjectionMatrix()` 是必须的，否则相机不会立即应用新的宽高比。

## 高清屏适配

`window.devicePixelRatio` 表示屏幕的物理像素比：
- 普通屏幕：1
- Retina：2
- 部分 Android 手机：3

```js
// 限制最大像素比，避免性能问题
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```


## 响应式布局

根据屏幕宽度动态调整网格列数：

```js
function updateLayout() {
  // 根据宽度决定列数
  const width = window.innerWidth
  let cols
  if (width > 1200) {
    cols = 4
  } else if (width > 800) {
    cols = 3
  } else if (width > 500) {
    cols = 2
  } else {
    cols = 1
  }

  // 重新计算每张卡片的位置
  cards.forEach((card, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const spacingX = 2.5
    const spacingY = 1.8

    card.position.x = (col - (cols - 1) / 2) * spacingX
    card.position.y = -row * spacingY + 0.9

    // 同时更新 basePositionY，保证悬浮动画正确
    card.userData.basePositionY = card.position.y
  })
}

// 初始调用 + resize 监听
updateLayout()
window.addEventListener('resize', updateLayout)
```


## 移动端支持

移动端没有 `click` 事件，需要监听 `touchstart`：

```js
// 移动端触摸支持
window.addEventListener('touchstart', (event) => {
  const touch = event.touches[0]
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1

  // 射线检测
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)
  if (intersects.length > 0) {
    flipCard(intersects[0].object)
  }
}, { passive: true })
```


## 性能优化建议

| 优化项 | 方法 |
|--------|------|
| 限制像素比 | `Math.min(devicePixelRatio, 2)` |
| 减少阴影计算 | 阴影只在必要时开启 |
| 避免每帧创建对象 | 在循环外创建，复用对象 |
| 使用 `requestAnimationFrame` | 保证与屏幕刷新同步 |
| 纹理过滤 | `texture.minFilter = THREE.LinearFilter` |

## 调试技巧

在控制台查看当前状态：

```js
function animate() {
  requestAnimationFrame(animate)

  // ... 其他逻辑

  // 打印悬浮状态（避免过多输出）
  if (hoveredCard !== lastHoveredCard) {
    console.log('悬浮卡片变更:', hoveredCard?.userData?.isFlipped ? '背面' : '正面')
    lastHoveredCard = hoveredCard
  }

  renderer.render(scene, camera)
}
```



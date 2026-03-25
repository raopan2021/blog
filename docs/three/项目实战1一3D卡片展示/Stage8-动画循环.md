# Stage 8：动画循环与特效

本 Stage 介绍完整的动画循环，包括正弦波浮动和动态光照。

## requestAnimationFrame

浏览器提供的帧动画 API，与屏幕刷新率同步（约 60fps）：

```js
function animate() {
  requestAnimationFrame(animate)
  // ... 更新逻辑
  renderer.render(scene, camera)
}
animate()
```

## THREE.Clock 计时器

获取自程序启动以来的总运行时间：

```js
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const elapsed = clock.getElapsedTime()  // 总运行秒数
  // ...
}
```

## 正弦波浮动

每张卡片在 Y 轴上做轻微的上下浮动，使用正弦波实现平滑往复：

```js
cards.forEach((card, index) => {
  // 不同卡片使用不同的相位偏移，避免所有卡片同步上下
  card.position.y += Math.sin(elapsed * 2 + index) * 0.001
})
```

**原理**：
- `Math.sin(time)` 输出 [-1, 1] 的平滑周期值
- 乘以 `0.001` 控制浮动幅度（很小，避免明显位移）
- `+ index` 使每张卡片相位错开

## 点光源旋转

点光源绕 Y 轴缓慢旋转，卡片上的高光区域随之移动：

```js
pointLight.position.x = Math.sin(elapsed * 0.5) * 3
pointLight.position.z = Math.cos(elapsed * 0.5) * 3
```

- 旋转速度：`0.5`（可调整）
- 旋转半径：`3`（与 pointLight 创建时的距离一致）

## 完整动画循环

```js
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()

  // 1. 更新每张卡片的动画
  cards.forEach((card, index) => {
    // 翻转插值
    card.userData.currentRotationY += (
      card.userData.targetRotationY - card.userData.currentRotationY
    ) * 0.1
    card.rotation.y = card.userData.currentRotationY

    // 悬浮效果
    if (hoveredCard === card) {
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, mouse.y * 0.3, 0.05)
      card.rotation.y = card.userData.currentRotationY + mouse.x * 0.3
      card.position.y = THREE.MathUtils.lerp(card.position.y, card.userData.basePositionY + 0.2, 0.1)
    } else {
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, 0, 0.05)
    }

    // 正弦波浮动
    card.position.y += Math.sin(elapsed * 2 + index) * 0.001
  })

  // 2. 点光源旋转
  pointLight.position.x = Math.sin(elapsed * 0.5) * 3
  pointLight.position.z = Math.cos(elapsed * 0.5) * 3

  // 3. 更新控制器（如使用了 OrbitControls）
  controls.update()

  // 4. 渲染
  renderer.render(scene, camera)
}

animate()
```

## 性能考虑

- 60fps 下每帧约 16.7ms，应尽量避免每帧创建对象
- `clock.getElapsedTime()` 内部缓存，多次调用无性能损失
- 卡片的正弦波浮动使用加法而非重新计算位置


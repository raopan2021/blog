# Stage 7：翻转动画与 Lerp 插值

本 Stage 介绍卡片翻转的实现原理，以及如何在动画循环中驱动翻转。

## 翻转原理

卡片翻转本质上是绕 Y 轴旋转 180°（π 弧度）：

- **正面**：`rotation.y = 0`
- **背面**：`rotation.y = Math.PI`（180°）

## 翻转状态切换

```js
function flipCard(card) {
  card.userData.isFlipped = !card.userData.isFlipped
  card.userData.targetRotationY = card.userData.isFlipped ? Math.PI : 0
}
```

## Lerp 插值动画

不是瞬间旋转到目标角度，而是每帧向目标靠近一部分：

```js
// 每帧调用此函数
card.userData.currentRotationY += (
  card.userData.targetRotationY - card.userData.currentRotationY
) * 0.1

card.rotation.y = card.userData.currentRotationY
```

## Lerp 工作原理

以 `t = 0.1` 为例，从 `0` 旋转到 `π` 的过程：

```
帧数    currentRotationY    target    差值 * 0.1    新 current
0       0.000               π         0.314        0.314
1       0.314               π         0.283        0.597
2       0.597               π         0.255        0.852
3       0.852               π         0.229        1.081
...     ...                  ...       ...          ...
∞       3.142 (=π)          π         0.000        3.142
```

**特点**：
- 初始快（差值大），后期慢（逐渐逼近目标）
- 永远不会overshoot（超过目标值）
- `t` 越小越平滑，越大越快

## 翻转与悬浮的叠加

翻转角度和悬浮角度可以叠加：

```js
card.rotation.y = card.userData.currentRotationY + mouse.x * 0.3
```

这意味着：
- 卡片翻转后，鼠标左右移动仍然可以让它微微倾斜
- 倾斜方向与翻转状态无关，始终跟随鼠标

## 翻转动画流程图

```mermaid
graph LR
    A[点击卡片] --> B{isFlipped?}
    B -->|false| C[target = π<br/>开始翻转]
    B -->|true| D[target = 0<br/>翻回正面]
    C --> E{current ≈ target?}
    D --> E
    E -->|否| F[每帧 current +=<br/>(target-current)*0.1]
    F --> E
    E -->|是| G[翻转完成]
```

## 关键参数

| 参数 | 值 | 说明 |
|------|---|------|
| 翻转角度 | `Math.PI` | 180°，CardGeometry 的 +Z 面翻到前面 |
| 插值系数 | `0.1` | 越小翻转越慢越平滑 |
| 悬浮倾斜系数 | `0.3` | 鼠标偏移的最大倾斜角（弧度） |


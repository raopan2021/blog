# 腾讯地图组件（tlbs-map-vue）使用经验总结

## 一、BaseMap 及子组件用法

### 基础结构

```html
<BaseMap
  ref="mapRef"
  :api-key="apiKey"
  :center="mapCenter"
  :zoom="zoom"
  :control="control"
  :style="{ width: '100%', height: '100%' }"
  @map_inited="onMapInited"
>
  <MultiPolygon :geometries="polygonGeometries" :styles="polygonStyles" :options="{ zIndex: 1 }" />
  <MultiMarker :geometries="centerMarkerGeometries" :styles="centerMarkerStyles" :options="{ minZoom: 10, maxZoom: 20 }" />
  <MarkerCluster :geometries="clusterGeometries" :options="{ zIndex: 1 }" :enable-default-style="false" @clusterchange="onClusterChange" />
  <DomOverlay :position="item.center" :offset="{ x: 0, y: 30 }">
    <!-- 自定义内容 -->
  </DomOverlay>
</BaseMap>
```

### BaseMap

腾讯地图的根容器。必要 props：

| prop      | 说明                                                               |
| --------- | ------------------------------------------------------------------ |
| `api-key` | 腾讯地图 key                                                       |
| `center`  | `{ lat, lng }`                                                     |
| `zoom`    | 缩放级别（支持小数，如 13.5）                                      |
| `control` | 右上角控件配置，如 `{ scale: {}, zoom: { position: 'topRight' } }` |

事件：`@map_inited` — 地图实例初始化完成后触发，用于执行初始操作（如 `fitBounds`）。

**Web 版额外注意**：给 `BaseMap` 加 `:key="centerComputed.lat + centerComputed.lng"` 可在 center 变化时强制销毁重建地图实例，避免中心点更新不及时的问题。

### MultiPolygon

绘制多边形边界。

```ts
const polygonGeometries = computed(() => {
  if (!props.polygon?.length) return []
  return [
    {
      id: "polygon",
      styleId: "polygon",
      paths: props.polygon, // [{ lat, lng }, ...]
      properties: { title: "polygon" }
    }
  ]
})

const polygonStyles = {
  polygon: {
    color: "#3777FF", // 填充色
    showBorder: false,
    borderColor: "#00FFFF"
  }
}
```

> 边界数据源是 `[lng, lat][]` 数组（GeoJSON 格式），传给地图时需要转为 `{ lat, lng }[]`。

### MultiMarker

中心点标记。

```ts
const centerMarkerGeometries = computed(() => {
  if (!props.center) return []
  return [{ styleId: "marker", position: props.center }]
})

const centerMarkerStyles = {
  marker: {
    width: 20,
    height: 30,
    anchor: { x: 10, y: 30 } // 锚点：底部中心
  }
}
```

> `anchor` 的 x 是宽度的一半，y 是高度本身，使标记底部尖角对准坐标点。

### MarkerCluster

点聚合组件，自动对附近标记进行聚类。

| prop                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `geometries`           | `[{ position: { lat, lng } }, ...]` |
| `enable-default-style` | 设为 `false` 使用自定义渲染         |
| `@clusterchange`       | 聚合状态变化事件，返回散点 + 聚合点 |

```ts
const clusterGeometries = computed(() => props.markers?.map((m) => ({ position: m })) ?? [])

const onClusterChange = (scattered: any[], aggregated: any[]) => {
  aggregationPoints.value = aggregated
  scatteredPoints.value = scattered
}
```

### DomOverlay

在经纬度坐标位置渲染任意 DOM 元素。必须放在 `BaseMap` 内部。

```html
<DomOverlay :position="item.center" :offset="{ x: 0, y: 30 }">
  <view
    class="cluster-marker cluster-marker-agg"
    :style="{ width: item.width, height: item.height, lineHeight: item['line-height'] }"
    @click="onClusterClick(item)"
  >
    {{ item.content }}
  </view>
</DomOverlay>
```

| prop       | 说明                                         |
| ---------- | -------------------------------------------- |
| `position` | `{ lat, lng }` 或含有 `lat()`/`lng()` 的对象 |
| `offset`   | 像素偏移 `{ x, y }`                          |

## 二、标注点聚合与自定义渲染

### 数据流

```
markers[]  →  MarkerCluster  →  @clusterchange
                                    ├─ aggregationPoints[]（聚合点，圆圈+数字）
                                    └─ scatteredPoints[]（散点，图标/圆点）
```

### 聚合点渲染

```html
<view v-for="item of aggregationPoints">
  <DomOverlay :position="item.center" :offset="{ x: 0, y: 30 }">
    <view
      class="cluster-marker-agg"
      :style="{ width: item.width, height: item.height, lineHeight: item['line-height'] }"
      @click="onClusterClick(item)"
    >
      {{ item.content }}
    </view>
  </DomOverlay>
</view>
```

`item.content` 是聚合数量，`item.width`/`item.height`/`item['line-height']` 由 `MarkerCluster` 根据聚合数自动计算。

点击聚合点 → 缩放至该聚合范围：

```ts
const onClusterClick = (item: any) => {
  mapRef.value?.map?.fitBounds(item.data.bounds)
}
```

### 散点渲染

```html
<view v-for="item of scatteredPoints">
  <DomOverlay :position="item.center">
    <view class="cluster-marker-dot" @click="onScatteredClick(item)">
      <img v-if="icon" :src="icon" />
      <view v-else class="cluster-dot-inner" />
    </view>
  </DomOverlay>
</view>
```

### DomOverlay 点击拿不到原始数据的问题

`DomOverlay` 的点击事件只能拿到 `{ center, data }`，无法直接获取原始标记数据。

**解决方案**：建立坐标→原始数据的查找表，以 `lat,lng` 6 位精度为 key。

```ts
const markerDataLut = computed(() => {
  const map = new Map<string, any>()
  for (const m of props.markers) {
    const key = `${(+m.lat).toFixed(6)},${(+m.lng).toFixed(6)}`
    map.set(key, m)
  }
  return map
})

const getMarkerData = (scattered: any) => {
  const center = scattered.center
  const lat = typeof center.lat === "function" ? center.lat() : center.lat
  const lng = typeof center.lng === "function" ? center.lng() : center.lng
  return markerDataLut.value.get(`${(+lat).toFixed(6)},${(+lng).toFixed(6)}`)
}
```

## 三、多边形边界适配（自动调整缩放）

当地图加载或半径切换时，自动将视野调整到多边形范围。

### polygonBounds：将 polygon 坐标转为 LatLngBounds

```ts
const polygonBounds = computed(() => {
  const pts = props.polygon
  if (!pts || pts.length < 2) return null
  const TMap = (window as any).TMap // 从全局获取 TMap 构造函数
  if (!TMap) return null
  const bounds = new TMap.LatLngBounds()
  for (const p of pts) {
    bounds.extend(new TMap.LatLng(p.lat, p.lng))
  }
  return bounds
})
```

> `TMap` 必须从 `(window as any).TMap` 获取，因为 `tlbs-map-vue` 内部已加载腾讯地图 SDK 到全局。

### tryFitBounds：防抖执行 fitBounds

```ts
let fitTimer: any
const tryFitBounds = () => {
  clearTimeout(fitTimer)
  fitTimer = setTimeout(async () => {
    await nextTick()
    const map = mapRef.value?.map
    const bounds = polygonBounds.value
    if (!map || !bounds) return
    map.fitBounds(bounds, {
      padding: 40,
      maxZoom: props.zoom, // 以 zoom prop 为最大缩放级别
      duration: 600 // 动画时长
    })
  }, 200) // 200ms 防抖
}
```

### 触发时机

```ts
onMapInited(() => tryFitBounds())

watch([() => props.polygon, () => props.zoom], () => {
  tryFitBounds()
})
```

> 多边形数据异步加载时一定要等 `nextTick` 再执行 `fitBounds`，否则地图容器尚未渲染完成。

## 四、地图实例访问链

```
父组件 ref (mapRef)
  → Map.vue defineExpose 的 mapRef
    → BaseMap 实例
      → 底层 T.Map 实例 (.map)
```

```ts
// 父组件获取 TMap 实例
const instance = mapRef.value?.mapRef?.map
instance.getZoom?.() // 当前缩放
instance.getCenter() // 当前中心
instance.fitBounds() // 适配范围
```

```ts
// Map.vue 内部直接使用（mapRef 指向 BaseMap）
mapRef.value?.map?.getZoom?.()
mapRef.value?.map?.fitBounds(...)
```

> 每一层都可能为 null，必须使用可选链 `?.`。

## 五、H5 为何使用 @touchstart.stop.prevent

```html
<view @touchstart.stop.prevent="onClusterClick(item)"></view>
```

H5 用 `@touchstart` 而非 `@click` 的原因：

1. **移动端点击延迟**：`@click` 在移动端有 300ms 延迟，`@touchstart` 立即响应
2. **`.stop` 阻止事件冒泡**：DomOverlay 在 BaseMap 内部，触摸事件会穿透到地图底层，导致地图手势与 DomOverlay 点击冲突。`.stop` 阻止事件冒泡到地图。
3. **`.prevent` 阻止默认行为**：防止触摸时触发浏览器的默认滚动/缩放行为。

Web 端无此问题，使用常规 `@click` + `@mouseover`。

## 六、样式覆盖与实用技巧

### 缩放控件位置调整

腾讯地图的缩放控件默认在右下角，覆盖其样式调整位置：

```scss
:deep(.tmap-zoom-control),
:deep(.rotate-circle) {
  transform: translate(15px, 50px); // H5 版微调
}

// Web 版
:deep(.tmap-zoom-control),
:deep(.rotate-circle) {
  cursor: pointer;
  transform: translateY(60px);
}
```

> 必须用 `:deep()` 穿透 scoped 样式，因为缩放控件渲染在 BaseMap 内部的 Shadow DOM 中。

### DomOverlay 自定义样式

DomOverlay 渲染的 DOM 在 BaseMap 容器内，样式写在与 BaseMap 同层级的 scoped 区域中：

```scss
.cluster-marker {
  text-align: center;
  font-weight: 500;
  color: #fff;
  opacity: 0.95;
  cursor: pointer;

  &.cluster-marker-agg {
    border-radius: 50%;
    background: linear-gradient(138.59deg, rgba(255, 118, 118, 0.9) 11.12%, rgba(255, 61, 61, 0.9) 75.89%);
  }

  &.cluster-marker-dot {
    width: 60rpx;
    height: 60rpx;
    line-height: 50rpx;
    text-align: center;
  }
}
```

### 阻止用户选中地图上的文本

```scss
.user-select-disabled {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

## 七、其他注意事项

| 问题                                | 说明                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| **缩放支持小数**                    | 腾讯地图 zoom 支持小数，如 13.5 有效                   |
| **`instance.getZoom?.()` 安全调用** | 地图实例可能尚未完全初始化，始终使用可选链             |
| **弹窗 Map 使用 `v-if`**            | 关闭后销毁地图实例释放内存，不用 `v-show`              |
| **多边形数据格式转换**              | 后端返回 `[lng, lat][]`，传给地图需要 `{ lat, lng }[]` |
| **`nextTick` 的必要性**             | `fitBounds` 前必须等 DOM 更新，否则地图容器尺寸未就绪  |

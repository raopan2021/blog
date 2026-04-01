# 显卡行情中心

Vue3 + Vite + ECharts 构建的显卡行情可视化页面。

## 快速使用

直接双击打开 `index.html` 即可（已打包成单文件）。

## 开发

```bash
npm install
npm run dev      # 开发调试
npm run build    # 构建单文件
```

## 数据更新

1. 替换 `二手显卡行情.xlsx`
2. 运行 `python3 process_gpu_data.py`
3. `npm run build`

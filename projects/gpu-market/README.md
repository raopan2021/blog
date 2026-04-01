# 显卡行情中心

Vue3 + Vite + ECharts 构建的显卡行情可视化页面。

## 快速使用

直接双击打开 `index.html` 即可（已打包成单文件，1.1MB）。

## 开发

```bash
npm install
npm run dev      # 开发调试
npm run build    # 构建单文件（输出 index.html）
```

## 数据更新

```bash
# Python 版（依赖 Python3，内置库无需安装）
python3 process_gpu_data.py [Excel文件路径]

# Node.js 版（依赖 Node.js）
node process_gpu_data.js [Excel文件路径]

# 或使用 npm 脚本
npm run update -- [Excel文件路径]
```

## 手动添加月度数据（如4月）

由于 xlsx 格式限制，添加新月数据需手动编辑 `data.js`：

```js
// 1. 在 months 数组末尾添加新月份
export const months = ['2025年12月', '2026年1月', '2026年2月', '2026年3月', '2026年4月'];

// 2. 在每张显卡的 prices 和 changes 对象中添加
"prices": { "2025年12月": 20000, "2026年1月": 19500, ..., "2026年4月": 21000 },
"changes": { "2026年4月": +500 },  // 与上月相比的涨跌

// 3. 重新构建
npm run build
```

## 文件结构

```
gpu-market/
├── index.html              ← 单文件打包（直接双击运行）
├── src/                   ← 源码
│   ├── App.vue
│   ├── components/
│   ├── data.js            ← 显卡数据（由脚本生成）
│   └── styles/
├── process_gpu_data.js    ← Node.js 数据处理脚本
├── process_gpu_data.py    ← Python 数据处理脚本
├── serve.py               ← HTTP 服务脚本
├── data.json              ← 原始 JSON 数据
└── 二手显卡行情.xlsx      ← 原始 Excel（供下载）
```

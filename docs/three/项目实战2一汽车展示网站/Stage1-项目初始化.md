# Stage 1：项目初始化与结构

> 本节介绍项目的创建、目录结构、以及依赖安装

## 1.1 创建项目

在 `projects/` 目录下创建 `car-showcase-su7` 文件夹：

```bash
mkdir -p projects/car-showcase-su7
cd projects/car-showcase-su7
```

## 1.2 目录结构

```
car-showcase-su7/
├── index.html              # 入口 HTML 页面
├── package.json           # 依赖配置文件
├── vite.config.js         # Vite 构建配置
│
├── public/                # 静态资源（3D 模型、纹理、音频）
│   ├── audio/
│   │   └── bgm.mp3       # 背景音乐
│   │
│   ├── mesh/             # GLTF 3D 模型
│   │   ├── sm_car.gltf         # 汽车模型
│   │   ├── sm_car_data.bin     # 汽车模型数据
│   │   ├── sm_car_img*.webp   # 汽车贴图（车身、玻璃等）
│   │   ├── sm_startroom.raw.gltf  # 展示厅模型
│   │   ├── sm_startroom.raw_data.bin
│   │   ├── sm_speedup.gltf        # 加速特效模型
│   │   ├── sm_speedup_data.bin
│   │   └── Driving.fbx           # 驾驶动画（可选）
│   │
│   └── texture/          # 纹理贴图
│       ├── t_env_night.hdr           # HDR 夜晚环境（用于环境反射）
│       ├── t_env_light.hdr           # HDR 白天环境
│       ├── t_car_body_AO.raw.jpg    # 汽车 AO 贴图（环境光遮蔽）
│       ├── t_startroom_ao.raw.jpg   # 展厅 AO 贴图
│       ├── t_startroom_light.raw.jpg # 展厅光照贴图
│       ├── t_floor_normal.webp      # 地面法线贴图（凹凸感）
│       ├── t_floor_roughness.webp   # 地面粗糙度贴图
│       └── decal.png                # 贴花（芙宁娜版使用）
│
└── src/
    └── main.js           # 主入口文件（约 650 行）
```

## 1.3 资源来源

本项目的 `public/` 目录资源直接拷贝自 [su7-replica](https://github.com/alphardex/su7-replica) 项目：

| 资源类型 | 文件 | 用途 |
|---------|------|------|
| GLTF 模型 | `sm_car.gltf` | 小米 SU7 汽车 3D 模型 |
| GLTF 模型 | `sm_startroom.raw.gltf` | 展示厅（地面 + 墙面 + 灯带） |
| GLTF 模型 | `sm_speedup.gltf` | 加速时的 Speed Lines 特效 |
| HDR | `t_env_night.hdr` | 夜晚环境贴图（深色、氛围感） |
| HDR | `t_env_light.hdr` | 白天环境贴图（明亮） |
| 贴图 | `t_car_body_AO.raw.jpg` | 汽车车身的 AO 贴图 |
| 贴图 | `t_floor_*.webp` | 地面的法线和粗糙度贴图 |
| 音频 | `bgm.mp3` | 背景音乐 |

## 1.4 安装依赖

```json
{
  "name": "car-showcase-su7",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.170.0",
    "postprocessing": "^6.35.3",
    "gsap": "^3.12.0",
    "howler": "^2.2.4"
  },
  "devDependencies": {
    "vite": "^5.2.7"
  }
}
```

安装：

```bash
pnpm install
```

## 1.5 Vite 配置

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // 使用相对路径，确保部署后资源正确加载
  // 如果是 /blog/ 路径下的子项目，需要改为 '/blog/projects/car-showcase-su7/'
  base: './',

  build: {
    outDir: 'dist',       // 输出目录
    assetsDir: 'assets',   // 资源子目录
  },

  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
  },
})
```

## 1.6 依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| `three` | ^0.170.0 | 3D 渲染引擎 |
| `postprocessing` | ^6.35.3 | 后处理效果（Bloom） |
| `gsap` | ^3.12.0 | 动画时间线编排 |
| `howler` | ^2.2.4 | 音频播放（背景音乐） |
| `vite` | ^5.2.7 | 构建工具 |

## 1.7 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式（热更新）
pnpm dev
# 访问 http://localhost:3000

# 构建生产版本
pnpm build

# 本地预览构建结果
pnpm preview
```

## 1.8 资源加载顺序

本项目的资源较多（3D 模型 + HDR + 贴图），加载顺序如下：

```
1. HDR 环境贴图（2个）
   ↓
2. GLTF 模型（3个：汽车、展厅、加速特效）
   ↓
3. 纹理贴图（5个：AO、地面法线、粗糙度等）
   ↓
4. 音频（1个：背景音乐）
   ↓
5. 初始化场景、配置材质
   ↓
6. 播放 LOADING → 进场动画
```

> 💡 **Tip**：由于资源较大（15MB+），实际项目可以添加加载进度条显示百分比。本项目的简化版本直接等待固定时间后切换。

---


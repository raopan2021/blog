---
layout: home

title: 饶盼的blog
titleTemplate: 边学边记录（菜就多练）

head:
  - - link
    - rel: stylesheet
      href: https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.7.0/style.min.css

hero:
  name: ""
  text: ""
  tagline: ""
  actions:
    - theme: brand
      text: GitHub
      link: https://github.com/raopan2021/
    - theme: brand
      text: Gitee
      link: https://gitee.com/raopan2021/
  image:
      src: /mainView/logo.svg
      alt: VitePress

features:
  # ===== 前端 =====
  - icon:
      src: /mainView/frontend.svg
    title: 前端配置
    details: 新PC环境相关配置、收藏
    link: /base/

  - icon:
      src: /mainView/h5.svg
    title: HTML5
    details: HTML5 新增特性和语义化标签
    link: /h5/

  - icon:
      src: /mainView/css.svg
    title: CSS
    details: CSS进阶
    link: /css/

  - icon:
      src: /mainView/check.svg
    title: SVG
    details: SVG学习
    link: /svg/

  - icon:
      src: /mainView/js.svg
    title: JavaScript
    details: JavaScript进阶
    link: /js/

  - icon:
      src: /mainView/vue.svg
    title: Vue 框架
    link: /vue/

  - icon:
      src: /mainView/react.svg
    title: React 框架
    link: /react/

  - icon:
      src: /mainView/vite.svg
    title: Vite 构建工具
    link: /vite/

  - icon:
      src: /mainView/markdown.svg
    title: Markdown编写
    details: 搭建 Markdown 强大写作环境（VSCode）
    link: /markdown/

  - icon:
      src: /mainView/three.svg
    title: Three.js
    details: 3D图形渲染
    link: /three/

  - icon:
      src: /mainView/pretext.svg
    title: Pretext 文本布局
    details: 不触碰 DOM 的精确文本测量与多行布局
    link: /pretext/

  - icon:
      src: /mainView/engineering.svg
    title: 前端工程化
    details: Eslint Stylelint Husky lint-staged ...
    link: /engineering/

  - icon:
      src: /mainView/cli.svg
    title: 前端脚手架的实现
    details: 创建一个自己的脚手架
    link: /cli/

  - icon:
      src: /mainView/micro.svg
    title: 微前端
    details: 前端微服务化方案
    link: /micro/

  # ===== 移动开发 =====
  - icon:
      src: /mainView/android.svg
    title: Android
    details: Kotlin + Compose 实战笔记
    link: /android/

  # ===== 后端 =====
  - icon:
      src: /mainView/node.svg
    title: Node.js
    details: Node.js nvm npm pnpm
    link: /node/nodejs/

  - icon:
      src: /mainView/nestjs.svg
    title: NEST.js
    details: NestJS 框架学习
    link: /node/nestjs/

  - icon:
      src: /mainView/java.svg
    title: Java
    details: Java基础
    link: /java/基础/index

  - icon:
      src: /mainView/python.svg
    title: Python
    details: Python学习
    link: /python/

  - icon:
      src: /mainView/mysql.svg
    title: MySQL
    details: MySQL基础
    link: /mysql/index

  - icon:
      src: /mainView/linux.svg
    title: Linux
    details: Linux基础
    link: /linux/index

  - icon:
      src: /mainView/docker.svg
    title: Docker
    details: Docker基础
    link: /docker/index

  - icon:
      src: /mainView/network.svg
    title: 计算机网络
    details: 计算机网络基础知识
    link: /network/

  - icon:
      src: /mainView/plc.svg
    title: PLC 工业自动化
    link: /plc/

  # ===== 工具 & 其他 =====
  - icon:
      src: /mainView/algorithm.svg
    title: 算法
    details: 算法学习笔记
    link: /algorithm/index

  - icon:
      src: /mainView/gpt.svg
    title: AI 大模型
    details: AI 学习
    link: /ai/index

  - icon:
      src: /mainView/study.svg
    title: 学习计划
    details: 阶段性学习计划
    link: /plan/

---

<ThreeParticles />

<style>
/* ========== Hero 文字动态渐变 ========== */
.VPHero .hero-info {
  position: relative;
  z-index: 10;
}

/* 名字彩色渐变动画 */
.VPHero .name {
  font-size: 4rem !important;
  font-weight: 900 !important;
  background: linear-gradient(
    135deg,
    #bd34fe 0%,
    #41d1ff 25%,
    #6bcb77 50%,
    #ffd93d 75%,
    #ff6b6b 100%
  ) !important;
  background-size: 300% 300% !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  animation: gradientFlow 6s ease infinite !important;
  line-height: 1.2 !important;
}

.VPHero .text {
  font-size: 2rem !important;
  background: linear-gradient(90deg, #41d1ff, #bd34fe, #ffd93d) !important;
  background-size: 200% 200% !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  animation: textShimmer 4s ease infinite !important;
}

.VPHero .tagline {
  font-size: 1.1rem !important;
  color: #888 !important;
  letter-spacing: 0.05em !important;
  animation: fadeSlideUp 1s ease-out !important;
}

/* 打字机光标效果 */
.VPHero .tagline::after {
  content: '|';
  animation: blink 1s step-end infinite;
  color: #bd34fe;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes textShimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Hero 操作按钮 ========== */
.VPHero .actions {
  position: relative;
  z-index: 10;
}

.VPHero .actions .VPButton {
  border-radius: 50px !important;
  font-weight: 600 !important;
  letter-spacing: 0.05em !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden !important;
}

.VPHero .actions .VPButton::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  ) !important;
  transition: left 0.5s ease !important;
}

.VPHero .actions .VPButton:hover::before {
  left: 100% !important;
}

.VPHero .actions .VPButton.brand {
  background: linear-gradient(135deg, #bd34fe, #41d1ff) !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(189, 52, 254, 0.3) !important;
}

.VPHero .actions .VPButton:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px rgba(189, 52, 254, 0.4) !important;
}

/* ========== Feature Card 悬浮效果 ========== */
.VPFeatures .VPFeature {
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  position: relative !important;
  overflow: hidden !important;
}

.VPFeatures .VPFeature::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 2px !important;
  background: linear-gradient(90deg, #bd34fe, #41d1ff, #6bcb77) !important;
  transform: scaleX(0) !important;
  transition: transform 0.4s ease !important;
}

.VPFeatures .VPFeature:hover::before {
  transform: scaleX(1) !important;
}

.VPFeatures .VPFeature:hover {
  transform: translateY(-8px) scale(1.02) !important;
  box-shadow:
    0 20px 40px rgba(189, 52, 254, 0.15),
    0 0 0 1px rgba(189, 52, 254, 0.1) !important;
}

.dark .VPFeatures .VPFeature:hover {
  box-shadow:
    0 20px 40px rgba(189, 52, 254, 0.3),
    0 0 0 1px rgba(189, 52, 254, 0.2) !important;
}

/* 暗色模式 Feature 更强发光 */
.dark .VPFeatures .VPFeature {
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
}

/* ========== Hero 背景暗色适配 ========== */
.dark .VPHero {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(75, 0, 130, 0.15) 0%,
    transparent 60%
  ) !important;
}

.VPHero {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(189, 52, 254, 0.08) 0%,
    transparent 60%
  ) !important;
}

/* ========== 分类标题装饰 ========== */
.VPFeatures .title {
  font-weight: 700 !important;
}

/* ========== 鼠标跟随光晕效果 ========== */
.VPHero .container {
  position: relative;
}

/* ========== 暗色 Hero 文字 ========== */
.dark .VPHero .tagline {
  color: #aaa !important;
}

.VPHero .tagline {
  color: #666 !important;
}
</style>

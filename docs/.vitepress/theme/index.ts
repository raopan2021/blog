import mediumZoom from 'medium-zoom'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, watch } from 'vue'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'

import Layout from './Layout.vue'
import Poem from './poem.vue' // 自定义的markdowm布局
import RainbowAnimationSwitcher from './components/RainbowAnimationSwitcher.vue'

import 'virtual:uno.css'

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-checkbox-button.css'
import 'element-plus/theme-chalk/el-checkbox-group.css'
import 'element-plus/theme-chalk/el-radio.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-slider.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-text.css'

import './style/custom.scss'
import './style/poem.scss'
import './style/zoom.scss'
import './style/rainbow.scss'
import './style/animate-min.scss'

const observers: IntersectionObserver[] = [] // 用于存储所有观察者 -> 收集起来主要是为了当路由变化时效果之前的观察者。

export default {
  ...DefaultTheme,
  enhanceApp: ({ app, router, siteData }) => {
    // 修复 ElementPlus SSR ID 注入警告
    app.provide(ID_INJECTION_KEY, { prefix: 100, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })

    app.component('poem', Poem)
    app.component('RainbowAnimationSwitcher', RainbowAnimationSwitcher)

    if (typeof window === 'undefined') return

    watch(
      () => router.route.data.relativePath,
      () => updateHomePageStyle(location.pathname === '/'),
      { immediate: true },
    )
  },

  // 文字渐入效果
  // 滚动时隐藏顶部nav
  setup() {
    // 文字渐入效果-------------开始--------------
    const route = useRoute()

    onMounted(() => {
      animateFn() // 文字渐入效果
      initZoom()
    })

    // 为所有图片增加缩放功能
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    // 文字渐入效果
    const animateFn = () => {
      const main = document.querySelector('.vp-doc>div') || []
      const paragraphs = [...(main?.children || [])]
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate__animated', 'animate__fadeIn')
              entry.target.setAttribute('snow_is_show', true)
            } else {
              entry.target.classList.remove('animate__animated', 'animate__fadeIn')
              entry.target.setAttribute('snow_is_show', false)
            }
          })
        },
        { threshold: 0.1 },
      )
      paragraphs.forEach((item) => observer.observe(item))
      observers.push(observer)
    }
    watch(
      () => route.path, // 路由跳转
      () =>
        nextTick(() => {
          // 清空所有 observer 的函数
          observers.forEach((observe) => {
            observe.disconnect() // 使 IntersectionObserver 对象停止监听目标。
          })
          observers.length = 0 // 清空
          animateFn() // 再次执行文字渐入效果
          initZoom()
        }),
    )
  },
  Layout() {
    return h(Layout, null, {})
  },
}

// #region 首页彩虹动画
if (typeof window !== 'undefined') {
  // 检测浏览器，添加 class 用于条件样式
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome'))
    document.documentElement.classList.add('browser-chrome')
  else if (browser.includes('firefox'))
    document.documentElement.classList.add('browser-firefox')
  else if (browser.includes('safari'))
    document.documentElement.classList.add('browser-safari')
}
let homePageStyle: HTMLStyleElement | undefined
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}
// #endregion

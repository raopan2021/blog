import mediumZoom from 'medium-zoom'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'

import Layout from './Layout.vue'
import ThreeParticles from './components/ThreeParticles.vue'
import Poem from './poem.vue' // 自定义的markdowm布局

import './style/animate-min.scss'
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

const observers = [] // 用于存储所有观察者 -> 收集起来主要是为了当路由变化时效果之前的观察者。

// ============================================================
// 彩虹渐变英雄文字 - 直接注入 style 到 head
// ============================================================
function injectHeroStyles() {
  const styleId = 'hero-rainbow-styles'
  if (document.getElementById(styleId)) return
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    .VPHome .VPHero .clip,
    .VPHome .VPHero .name {
      background: linear-gradient(135deg, #bd34fe 0%, #41d1ff 20%, #6bcb77 40%, #ffd93d 60%, #ff6b6b 80%, #bd34fe 100%) !important;
      background-size: 400% 400% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
      background-position: 0% 50% !important;
      animation: rainbowFlow 5s linear infinite !important;
    }
    .VPHome .VPHero .text {
      background: linear-gradient(90deg, #41d1ff, #bd34fe, #ffd93d) !important;
      background-size: 200% 200% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
      animation: textShimmer 4s ease infinite !important;
    }
    .dark .VPHome .VPHero .clip,
    .dark .VPHome .VPHero .name {
      background: linear-gradient(135deg, #e879f9 0%, #67e8f9 20%, #86efac 40%, #fde047 60%, #fca5a5 80%, #e879f9 100%) !important;
    }
    .dark .VPHome .VPHero .text {
      background: linear-gradient(90deg, #67e8f9, #e879f9, #fde047) !important;
    }
    @keyframes rainbowFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 400% 50%; }
    }
    @keyframes textShimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
  `
  document.head.appendChild(style)
}

export default {
	...DefaultTheme,
	enhanceApp: ({ app, router, siteData }) => {
		// Fix ElementPlus SSR ID injection warning
		app.provide(ID_INJECTION_KEY, { prefix: 100, current: 0 })
		app.provide(ZINDEX_INJECTION_KEY, { current: 0 })

		app.component('ThreeParticles', ThreeParticles)

		app.component('poem', Poem)

		// 注入彩虹英雄文字样式
		if (typeof window !== 'undefined') {
			injectHeroStyles()
			router.onAfterRouteChange = () => injectHeroStyles()
		}
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

		const initZoom = () => {
			// 为所有图片增加缩放功能
			mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
		}
		// 文字渐入效果
		const animateFn = () => {
			const main = document.querySelector('.vp-doc>div') || []
			const paragraphs = [...(main?.children || [])]
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate__animated', 'animate__fadeIn')
						entry.target.setAttribute('snow_is_show', true)
					} else {
						entry.target.classList.remove('animate__animated', 'animate__fadeIn')
						entry.target.setAttribute('snow_is_show', false)
					}
				})
			}, { threshold: 0.1 })
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

		// 滚动时隐藏顶部nav-------------开始--------------
		const repoName = useData()?.site?.value?.base // 仓库名称
		let VPNavDom = null // 顶部dom
		let VPNavLineDom = null // 顶部下划线dom
		const scrollTop = ref(0) // 页面滚动距离
		let scrollHandler = null
		let rafId = null
		onMounted(() => {
			if (route.path !== repoName) {
				// 当前不是首页
				VPNavDom = document.querySelector('.content') // 顶部dom
				VPNavLineDom = document.querySelector('.divider-line') // 顶部下划线dom
				scrollHandler = () => {
					if (rafId) return
					rafId = requestAnimationFrame(() => {
						scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
						rafId = null
					})
				}
				window.addEventListener('scroll', scrollHandler, true)
			}
		})
		// 滚动时隐藏顶部nav
		watch(scrollTop, (newVal, oldVal) => {
			nextTick(() => {
				if (newVal > oldVal) {
					VPNavDom.style.display = 'none'
					VPNavLineDom.style.display = 'none'
				} else {
					VPNavDom.style.display = 'block'
					VPNavLineDom.style.display = 'block'
				}
			})
		})
		onBeforeUnmount(() => {
			if (scrollHandler) {
				window.removeEventListener('scroll', scrollHandler, true)
				scrollHandler = null
			}
			if (rafId) {
				cancelAnimationFrame(rafId)
				rafId = null
			}
			VPNavDom = null
			VPNavLineDom = null
		})
	},
	Layout() {
		return h(Layout, null, {})
	},
}

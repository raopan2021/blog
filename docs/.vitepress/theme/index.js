import mediumZoom from 'medium-zoom'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// import AdComponent from './AdComponent.vue'
import Layout from './Layout.vue'
import Poem from './poem.vue' // 自定义的markdowm布局

// import elementplus from "element-plus"
// import "element-plus/dist/index.css";

import 'animate.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './custom.scss'
import './zoom.scss'

const observers = [] // 用于存储所有观察者 -> 收集起来主要是为了当路由变化时效果之前的观察者。

export default {
	...DefaultTheme,
	enhanceApp: ({ app, router, siteData }) => {
		// 链接：https://juejin.cn/post/7129201521295622152
		// app is the Vue 3 app instance from `createApp()`. router is VitePress'
		// custom router. `siteData`` is a `ref`` of current site-level metadata.
		// app.use(elementplus);
		app.component('poem', Poem)
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
			paragraphs.forEach((item) => {
				const observer = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						// 如果这个值为true，表示被监听的元素显示在视口中了
						// 如果这个值为false，表示被监听的元素在视口外
						if (entry.isIntersecting) {
							// 元素进入视口
							item.classList.add('animate__animated')
							item.classList.add('animate__fadeIn')
							item.setAttribute('snow_is_show', true)
						} else {
							item.classList.remove('animate__animated')
							item.classList.remove('animate__fadeIn')
							item.setAttribute('snow_is_show', false)
						}
					})
				})
				observer.observe(item) // 使 IntersectionObserver 开始监听一个目标元素。
				observers.push(observer)
			})
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
		onMounted(() => {
			if (route.path !== repoName) {
				// 当前不是首页
				VPNavDom = document.querySelector('.content') // 顶部dom
				VPNavLineDom = document.querySelector('.divider-line') // 顶部下划线dom
				window.addEventListener(
					'scroll',
					() => {
						scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
					},
					true,
				)
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
			window.removeEventListener('scroll')
			VPNavDom = null
			VPNavLineDom = null
		})
	},
	Layout() {
		return h(Layout, null, {
			// 'doc-before': () => h(AdComponent),
		})
	},
}

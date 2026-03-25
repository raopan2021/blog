# Vite项目体积优化

::: tip 来自
[Vite 工具优化包体积和性能（附项目配置及解释）](https://juejin.cn/post/7287914129565270073)
:::

## 构建产物关系图页面

安装 `rollup-plugin-visualizer` 插件，生成可视化构建产物关系图页面

```js
npm i rollup-plugin-visualizer -D
```

``` js {2,6-8}
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      open: true, // 打包完成后自动打开浏览器，显示产物体积报告
    }),
  ],
});
```

`npm run build` 后，在项目根目录生成 `stats.html` 文件。

## 打包文件拆分

vite基于rollup打包，而打包后的chunk(代码块)后静态资源名称比较简单

使用命名规则可以确保在每次构建应用程序时，文件的名称都会随着内容的更改而变化，从而帮助缓存管理和版本控制。

可以避免浏览器缓存旧版本文件的问题，并确保每次部署新的构建版本时，浏览器可以正确加载更新的文件。

```js
build: {
  outDir: 'dist',
  chunkSizeWarningLimit: 500,
  rollupOptions: {
    output: {
      chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
      entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
      assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      experimentalMinChunkSize: 10 * 1024, // 单位b 没有副作用，合并较小的模块
      manualChunks (id) {
        if (id.includes('/lodash')) {
          return 'lodash'
        }
        if (id.includes('/@vue')) {
          return 'vue-use'
        }
        if (id.includes('/node_modules/')) {
          return 'vendor'
        }
      }
    }
  }
}
```

## `Gzip` 压缩

`Gzip` 压缩使用 `vite-plugin-compression` 插件， 压缩后减小代码体积，提升加载性能

安装

``` js
npm install vite-plugin-compression -D
```

::: details 项目配置gzip

``` js
// build.rollupOptions.plugins[]
viteCompression({
  algorithm: 'gzip', // 压缩算法，可选[‘gzip’，‘brotliCompress’，‘deflate’，‘deflateRaw’]，默认gzip
  threshold: 10240, // 文件大小在阈值超过 10k 后使用 gzip 算法进行压缩，默认1024
  verbose: true, // 是否在控制台中输出压缩结果
  ext: '.gz', // 生成的压缩包的后缀
  deleteOriginFile: true // 源文件压缩后是否删除
  // filter	RegExp or (file) => boolean	指定未压缩的资源
  // disable	false	是否禁用
  // compressionOptions	-	对应压缩算法的参数
})
```

:::

压缩 gz 后缀文件，浏览器正常解析，需要 配置 nginx http 请求，告诉浏览器支持的类型，设置响应头 content-encoding: gzip 。

::: details 在nginx添加配置

``` js
http {
    # 开启或者关闭gzip模块(on|off)
    gzip_static on;
    # gzip压缩比，1 压缩比最小处理速度最快，9 压缩比最大但处理最慢（传输快但比较消耗cpu）。
    gzip_comp_level 2;
}
```

:::

## 图片压缩

使用 `vite-plugin-imagemin` 对图片进行压缩优化

``` js
npm i vite-plugin-imagemin -D
```

::: details vite.config.ts

``` js {2,5-32}
import { defineConfig,loadEnv} from 'vite'
import viteImagemin from 'vite-plugin-imagemin'
export default  ({ mode }) => defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { // gif图片压缩
        optimizationLevel: 3, // 选择1到3之间的优化级别
        interlaced: false, // 隔行扫描gif进行渐进式渲染
        // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
      },
      optipng: { // png
        optimizationLevel: 7, // 选择0到7之间的优化级别
      },
      mozjpeg: {// jpeg
        quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
      },
      pngquant: {// png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      svgo: { // svg压缩
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ]
})
```

:::

使用后，可以看到图片的压缩比例

<img src="/Vite项目体积优化/2.webp" alt="">

## `Treeshaking` 去除无用的代码

`Treeshaking`：保证代码运行结果不变的前提下，去除无用的代码

Vue3 会默认使用 Rollup 进行 treeshaking ，不需要额外进行配置。但有一个条件，必须是 ES6 module 模块才行

``` js
import { cloneDeep } from 'lodash'
const obj = cloneDeep({})
```

上面 lodash 是使用 CommonJS 规范的模块，所以无法进行 treeshaking ，Vue 会把整个 lodash 依赖打包进来，整个文件会特别大。

所以，需要更改为使用 ESM 版的 loadsh ，实现按需引入

``` js
import { cloneDeep } from 'lodash-es'
const obj = cloneDeep({})
```

# 删除不被使用的图片资源

```js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, 'src/assets'); // 确保路径正确

function findUnusedImages(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是目录，递归调用
      findUnusedImages(filePath);
    } else {
      const fileName = path.basename(file);
      const isUsed = searchFileInDirectory('src', fileName);
      if (!isUsed && fileName !== 'iconfont.js' && fileName !== 'iconfont.json') {
        console.log(`未引用的图片: ${fileName}`);
        fs.unlinkSync(filePath); // 删除文件
      }
    }
  });
}

function searchFileInDirectory(directory, searchTerm) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (searchFileInDirectory(filePath, searchTerm)) {
        return true;
      }
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(searchTerm)) {
        return true;
      }
    }
  }
  return false;
}

findUnusedImages(imageDir);
```

## CDN 加速

通过配置 CDN 让用户从最近的服务器请求资源，提升网络请求的响应速度。

::: details 原生 vue 项目 （非vite）

externals 提取项目依赖

<img src="/Vite项目体积优化/3.webp">

从上面的打包分析页面中可以看到，chunk-vendors.js 体积为 2.21M，其中最大的几个文件都是一些公共依赖包，那么只要把这些依赖提取出来，就可以解决 chunk-vendors.js 过大的问题

可以使用 externals 来提取这些依赖包，告诉 webpack 这些依赖是外部环境提供的，在打包时可以忽略它们，就不会再打到 chunk-vendors.js 中

1）vue.config.js 中配置：

``` js
module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
      echarts: 'echarts'
    }
  }
}
```

2）在 index.html 中使用 CDN 引入依赖

``` html
<body>
  <script src="http://lib.baomitu.com/vue/2.6.14/vue.min.js"></script>
  <script src="http://lib.baomitu.com/vue-router/3.5.1/vue-router.min.js"></script>
  <script src="http://lib.baomitu.com/axios/1.2.1/axios.min.js"></script>
  <script src="http://lib.baomitu.com/echarts/5.3.2/echarts.min.js"></script>
</body>
```

缺点：直接在html内引入的，失去了按需引入的功能，只能引入组件库完整的js和css

:::

::: details vite项目
使用 `vite-plugin-cdn-import` 配置，以 lodash 为例

``` js {3,7-16}
// vite.config.js
import { defineConfig } from 'vite'
import viteCDNPlugin from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    viteCDNPlugin({
      // 需要 CDN 加速的模块
      modules: [
        {
          name: 'lodash',
          var: '_',
          path: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
        }
      ]
    })
  ]
})
```

在代码中使用lodash

``` js
import _ from 'lodash'
const obj = _.cloneDeep({})
```

构建成功后，Vite 会自动帮我们将 cdn 资源通过 script 标签插入到 html 中
:::

## 路由懒加载

当打开页面时才去加载对应文件，利用 Vue 的异步组件就可以实现懒加载

``` js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index')
    }
  ]
})
```

## 开启HTTP2

浏览器有请求并发限制，一般是 6 个，超过限制请求需要排队，之前可以通过域名分发、资源合并来解决

使用 HTTP2 协议后，其可以在一个TCP连接分帧处理多个请求（多路复用），不受此限制。（头部压缩也带来了一定性能提升）

在 Nginx 中开启 HTTP2：

``` js
// nginx.conf 
listen 443 http2;

// 重启Nginx
nginx -s stop && nginx
```

<img src="/Vite项目体积优化/1.webp">

## 去除debugger 和 console

第一种方法，使用 esbuild（官方推荐）

``` js
build: {
  esbuild: {
    drop: ['console', 'debugger']
  }
}
```

::: details 第二种方法，使用 terser 插件

``` js
npm i terser -D
```

在 `vite.config.ts` 中配置插件

``` js
build: {
  //移除生产环境log
  minify: 'terser',
  terserOptions: {
    compress: {
      //生产环境时移除console
      drop_console: true,
      drop_debugger: true,
    },
  }
}
```

:::

## vite.config.ts 详细配置

::: details

``` js
import {
    defineConfig,
    normalizePath
} from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteRestart from 'vite-plugin-restart'
import timeReporter from 'vite-plugin-time-reporter'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import envCompatible from 'vite-plugin-env-compatible'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import Components from 'unplugin-vue-components/vite' // 组件库按需加载
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // 组件库解析器
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'


// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/assets/styles/mixin.scss'))

export default defineConfig(({ command, mode }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    // const env = loadEnv(mode, process.cwd(), '')

    // 插件
    const plugins = [
        vue(),
        vueJsx(),
        vueSetupExtend(),
        ViteRestart({
            restart: ['my.config.[jt]s']
        }),
        // 按需引入 toast 等样式
        ElementPlus(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
            dts: false,
            include: [
                /\.[j]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/, /\.vue\?vue/ // .vue
            ],
            imports: [
                'vue',
                'vue-router'
            ],
            eslintrc: {
                enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
                filepath: './.eslintrc-auto-import.json', // 生成json文件
                globalsPropValue: true
            }
        }),
        // 按需加载组件库 element-plus
        Components({
            dts: false, // 不生成 components.d
            resolvers: [
                ElementPlusResolver()
            ]
        }),
        // 兼容 commonjs
        viteCommonjs(),
        // 兼容 webpack 环境变量
        envCompatible(),
        createSvgIconsPlugin({
            iconDirs: [
                path.resolve(process.cwd(), 'src/assets/svg')
            ],
            symbolId: 'icon-[name]'
        }),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false
            },
            optipng: {
                optimizationLevel: 7
            },
            mozjpeg: {
                quality: 20
            },
            pngquant: {
                quality: [0.8, 0.9],
                speed: 4
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox'
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false
                    }
                ]
            }
        }),
        viteCompression(
            {
                algorithm: 'gzip',
                threshold: 10240 // 体积大于 10k 阈值进行压缩，单位 b
                verbose: false,
                deleteOriginFile: true
            }
        ),
        timeReporter(),
        // 包分析插件, 放在最后
        visualizer({
            gzipSize: true,
            brotliSize: true,
            emitFile: false,
            filename: 'stats.html', // 分析图生成的文件名
            open: true // 如果存在本地服务端口，将在打包后自动展示
        })
    ]

    return {
        plugins,
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: path.resolve(__dirname, 'src')
                },
                {
                    find: '~@',
                    replacement: path.resolve(__dirname, 'src')
                }
            ],
            extensions: [
                '.mjs',
                '.js',
                '.jsx',
                '.vue'
            ]
        },
        // base: './',
        server: {
            strictPort: false,
            port: 8080,
            open: true,
            proxy: {
                '/XXX': {
                    target: 'XXX/',
                    changeOrigin: true
                }
            }
        },
        // css 相关的配置
        css: {
            postcss: {
                plugins: [
                    tailwindcss,
                    autoprefixer
                ]
            },
            preprocessorOptions: {
                scss: {
                    // additionalData 的内容会在每个 scss 文件的开头自动注入
                    additionalData: `@import "${variablePath}";`
                }
            }
        },
        build: {
            outDir: 'dist',
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                    entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                    assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
                    experimentalMinChunkSize: 10 * 1024, // 单位b 没有副作用，合并较小的模块
                    manualChunks (id) {
                        if (id.includes('/lodash')) {
                            return 'lodash'
                        }
                        if (id.includes('/@vue')) {
                            return 'vue-use'
                        }
                        if (id.includes('/node_modules/')) {
                            return 'vendor'
                        }
                    }
                }
            }
        },
        // 不走打包的，静态资源目录，解决移动目录，出现没有权限
        publicDir: path.resolve(process.cwd(), 'public'),
        optimizeDeps: {
            entries: ['/index.html']
        }
    }
})
```

:::

## Vite 常用配置解释

::: details

``` js
{
  root: process.cwd(), // 项目根目录（index.html 文件所在的位置）,
  base: '/', // 开发或生产环境服务的公共基础路径 配置引入相对路径
  mode: 'development', // 模式
  plugins: [vue()], // 需要用到的插件数组
  publicDir: 'public', // 静态资源服务的文件夹
  cacheDir: 'node_modules/.vite', // 存储缓存文件的目录
  resolve: {
    alias: [ // 文件系统路径别名
      {
        find: //@//,
        replacement: pathResolve('src') + '/'
      }
    ],
    dedupe: [], // 强制 Vite 始终将列出的依赖项解析为同一副本
    conditions: [], // 解决程序包中 情景导出 时的其他允许条件
    mainFields: [], // 解析包入口点尝试的字段列表
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 导入时想要忽略的扩展名列表
    preserveSymlinks: false, // 启用此选项会使 Vite 通过原始文件路径确定文件身份
  },
  css: {
    modules: {
      scopeBehaviour: 'global' | 'local',
      // ...
    },
    postcss: '', // 内联的 PostCSS 配置 如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源
    preprocessorOptions: { // css的预处理器选项
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  },
  json: {
    namedExports: true, // 是否支持从.json文件中进行按名导入
    stringify: false, //  开启此项，导入的 JSON 会被转换为 export default JSON.parse("...") 会禁用按名导入
  },
  esbuild: { // 最常见的用例是自定义 JSX
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  assetsInclude: ['**/*.gltf'], // 指定额外的 picomatch 模式 作为静态资源处理
  logLevel: 'info', // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
  clearScreen: true, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  envDir: '/', // 用于加载 .env 文件的目录
  envPrefix: [], // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
  server: {
    host: '127.0.0.1', // 指定服务器应该监听哪个 IP 地址
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/api/, '')
      }
    },
    cors: true, // 配置 CORS
    force: true, // 强制使依赖预构建
    hmr: { // 禁用或配置 HMR 连接
      // ...
    },
    watch: { // 传递给 chokidar 的文件系统监听器选项
      // ...
    },
    middlewareMode: '', // 以中间件模式创建 Vite 服务器
    fs: {
      strict: true, // 限制为工作区 root 路径以外的文件的访问
      allow: [], // 限制哪些文件可以通过 /@fs/ 路径提供服务
      deny: ['.env', '.env.*', '*.{pem,crt}'], // 用于限制 Vite 开发服务器提供敏感文件的黑名单
    },
    origin: 'http://127.0.0.1:8080/', // 用于定义开发调试阶段生成资产的 origin
  },
  build: {
    target: ['modules'], // 设置最终构建的浏览器兼容目标
    polyfillModulePreload: true, // 是否自动注入 module preload 的 polyfill
    outDir: 'dist', // 指定输出路径
    assetsDir: 'assets', // 指定生成静态文件目录
    assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
    cssCodeSplit: true, // 启用 CSS 代码拆分
    cssTarget: '', // 允许用户为 CSS 的压缩设置一个不同的浏览器 target 与 build.target 一致
    sourcemap: false, // 构建后是否生成 source map 文件
    rollupOptions: {}, // 自定义底层的 Rollup 打包配置
    lib: {}, // 构建为库
    manifest: false, // 当设置为 true，构建后将会生成 manifest.json 文件
    ssrManifest: false, // 构建不生成 SSR 的 manifest 文件
    ssr: undefined, // 生成面向 SSR 的构建
    minify: 'esbuild', // 指定使用哪种混淆器
    terserOptions: {}, // 传递给 Terser 的更多 minify 选项
    write: true, // 启用将构建后的文件写入磁盘
    emptyOutDir: true, // 构建时清空该目录
    brotliSize: true, // 启用 brotli 压缩大小报告
    chunkSizeWarningLimit: 500, // chunk 大小警告的限制
    watch: null, // 设置为 {} 则会启用 rollup 的监听器
  },
  preview: {
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/api/, '')
      }
    },
    cors: true, // 配置 CORS
  },
  optimizeDeps: {
    entries: [], // 指定自定义条目——该值需要遵循 fast-glob 模式
    exclude: [], // 在预构建中强制排除的依赖项
    include: [], // 可强制预构建链接的包
    keepNames: false, // true 可以在函数和类上保留 name 属性
  },
  ssr: {
    external: [], // 列出的是要为 SSR 强制外部化的依赖,
    noExternal: '', // 列出的是防止被 SSR 外部化依赖项
    target: 'node', // SSR 服务器的构建目标
  }
}
```

:::

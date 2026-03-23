# 在vue2引入three

<a href="https://blog.csdn.net/fackyoufack/article/details/127249096" target="_blank">在vue中使用three.js</a>

### 1.首先安装three.js、引入

```
npm install three
```

**在你需要的页面内引入three.js**

```
//import * as THREE from 'three' 
import * as Three from 'three'  
```



### 2.参考例子

<a href="https://www.bilibili.com/read/cv21176234" target="_blank">星辰宇宙案例（bilibili）</a>

```vue
<template>
  <div id="container"></div>
</template>

<script>
// 导入三维模型库
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  data () {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      sizes: [], // 创建点的大小数组
      shift: [], // 移动数组
    }
  },

  mounted () {
    this.init();
  },

  methods: {
    init () {
      let container = document.getElementById('container');

      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x160016); // 设置场景背景颜色

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(60,innerWidth / innerHeight,1,1000);
      this.camera.position.set(0,4,21); // 设置相机位置

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(innerWidth,innerHeight); // 设置渲染器大小
      container.appendChild(this.renderer.domElement); // 把渲染器加入到页面中

      // 监听窗口大小变化事件
      window.addEventListener("resize",event => {
        this.camera.aspect = innerWidth / innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(innerWidth,innerHeight)
      })

      // 创建控制器
      let controls = new OrbitControls(this.camera,this.renderer.domElement)
      controls.enableDamping = true // 开启阻尼效果
      controls.enablePan // 禁用面板
      // 创建全局uniform
      let gu = {
        time: { value: 0 }
      }

      // 创建点的顶点数组（中间的球体）
      // 创建一个长度为5万的数组pts并y用Array.prototype.map()方法遍历数组并对每个元素进行操作
      let pts = new Array(50000).fill().map(p => {
        // 每次遍历中，会向this.sizes数组中添加一个随机大小
        this.sizes.push(Math.random() * 1.5 + 0.5)
        // 调用pushShift()函数添加位置信息，并返回一个随机方向的THREE.Vector对象
        this.pushShift()
        return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5)
        //
      })

      // 添加更多的点（旁边围绕的）
      // 先循环生成十万个点
      // 每次循环中生成一个随机数rand，再生成一个随机半径radius
      for (let i = 0; i < 100000; i++) {
        let r = 10,R = 40;
        let rand = Math.pow(Math.random(),1.5);
        let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
        // 使用new THREE.Vector3().setFromCylindricalCoords()生成一个点。
        pts.push(new THREE.Vector3().setFromCylindricalCoords(radius,Math.random() * 2 * Math.PI,(Math.random() - 0.5) * 2));
        this.sizes.push(Math.random() * 1.5 + 0.5);
        this.pushShift()
      }
      // 生成一个点g，同时将点的大小和位置信息添加到this.sizes和this.shift数组中
      let g = new THREE.BufferGeometry().setFromPoints(pts)
      // 创建了一个缓冲几何体并设置this.sizes和this.shift属性
      // 注意这里的F要大写Float32BufferAttribute
      g.setAttribute("sizes",new THREE.Float32BufferAttribute(this.sizes,1))
      g.setAttribute("shift",new THREE.Float32BufferAttribute(this.shift,4))
      // 创建点材质
      let m = new THREE.PointsMaterial({
        size: 0.125, // 表示点的大小
        transparent: true, // 设置材质为透明
        depthTest: false, // 表示禁用深度测试，使点可以叠加
        blending: THREE.AdditiveBlending, // 使用假发混合模式
        // 在材质编译之前修改颜色器，在这里，它用来替换顶点着色器和片元着色器，添加uniform
        // 和attribute，自定义颜色和移动
        onBeforeCompile: shader => {
          shader.uniforms.time = gu.time
          // 首先，它为着色器设置了一个uniform变量time，该变量是在点材质中定义的，用来追踪时间
          // 然后它定义了两个attribute变量this.sizes和this.shift，这两个变量是在缓冲几何体中定义的，用来控制点的大小和移动
          // 最后使用replace方法来替换顶点着色器中的代码
          shader.vertexShader = `
                uniform float time;
                attribute float sizes;
                attribute vec4 shift;
                varying vec3 vColor;
                ${shader.vertexShader}
                `
            // 注意上面的 ` 不要漏掉了
            // 使用replace来替换着色器中的代码
            // 更新点的大小
            .replace(
              `gl_PointSize = size;`,
              `gl_PointSize = size * sizes;`
            )
            // 更新点的颜色
            .replace(
              `#include <color_vertex>`,
              `#include <color_vertex>
                    float d = length(abs(position)/vec3(40.,10.,40));
                    d=clamp(d,0.,1.);
                    vColor = mix(vec3(227.,155.,0.),vec3(100.,50.,255.),d)/255.;`
            )
            // 记得加上分号
            // 更新点的移动
            .replace(
              `#include <begin_vertex>`,
              `#include <begin_vertex>
                            float t = time;
                            float moveT = mod(shift.x + shift.z * t,PI2);
                            float moveS = mod(shift.y + shift.z * t,PI2);
                            transformed += vec3(cos(moveS) * sin(moveT),cos(moveT),sin(moveS)*sin(moveT)) * shift.w;
                            `
            )
          // 修改片元着色器，用来让点的边缘更加圆滑

          // 首先，定义一个varying变量vColor，这个变量是在顶点着色器中定义的，用来传递点的颜色到片段着色器
          // 然后使用replace方法来替换片段着色器的代码
          shader.fragmentShader = `
                    varying vec3 vColor;
                    ${shader.fragmentShader}
                `.replace(
            `#include <clipping_planes_fragment>`,
            `#include <clipping_planes_fragment>
                        float d = length(gl_PointCoord.xy - 0.5);
                    `
          ).replace(
            // 记得加上空格
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d)/* * 0.5+0.5*/);`
          );
        }
      })
      // -------------------------------------------------------------
      // 创建点云并将其添加到场景中，并设置渲染循环
      let p = new THREE.Points(g,m)
      // 旋转顺序为"ZYX"
      p.rotation.order = "ZYX"
      // 旋转角度 0.2
      p.rotation.z = 0.2
      // 把对象（p）添加到场景（this.scene）中
      this.scene.add(p)
      // 创建一个时钟对象clock
      let clock = new THREE.Clock()
      // 渲染循环，每次循环中会更新控制器，更新p的旋转角度，更新时间
      this.renderer.setAnimationLoop(() => {
        // 更新控制器
        controls.update()
        // 获取时钟对象（clock）的已经流逝的时间（t）并将他乘0.5
        // 先把时钟关了
        let t = clock.getElapsedTime() * 0.5
        // 将gu.time.value 设置为t*Math.PI
        gu.time.value = t * Math.PI
        // 将对象（p）的旋转角度y设置为t*0.05
        p.rotation.y = t * 0.05
        // 渲染场景（this.scene）和相机（this.camera）
        this.renderer.render(this.scene,this.camera)
      })
    },
    // 创建移动函数
    pushShift () {
      this.shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      )
    }
  },
}
</script>
```


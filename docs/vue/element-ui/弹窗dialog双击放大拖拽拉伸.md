# 弹窗dialog双击放大拖拽拉伸

<a href="https://segmentfault.com/a/1190000039183909" target="_blank">原链接</a>

**暂时没有去解决dialog尺寸变化，而Echarts没有init的问题**

> 将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；
>
> 给el-dialog加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了；
>
> 给el-dialog设置 :close-on-click-modal=“false” , 禁止点击遮罩层关闭弹出层；
>
> 给el-dialog加上 v-if="calDialogVisible" ，当dialog关闭后，重新打开dialog，会自动初始化页面大小和位置；
>
> 如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏；

### main.js引入

```js
import "@/directive/el-dragDialog/dialogDrag.js"
```

### 页面使用

```html
<template>
  <el-dialog id="calDialog" v-if="calDialogVisible" :visible.sync="calDialogVisible" 
             append-to-body width="90%" top="50px" :center="true" :close-on-click-modal="false" 
             v-dialogDrag>
    <span slot="title" style="color: #fff;font-size: 18px;" v-if="deviceInfo !== null">{{
      deviceInfo.DataTagName + ' - 设备详情' }}</span>
    <div></div>
  </el-dialog>
</template>  
```

### 复制以下代码到 src/directive/el-dragDialog/dialogDrag.js

```js
/*
*  使用方法
*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；
*  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。
*  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层
*  如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏
*/

import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽+水平方向伸缩
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        //弹框可拉伸最小宽高
        let minWidth = 400;
        let minHeight = 300;
        //初始非全屏
        let isFullScreen = false;
        //当前宽高
        let nowWidth = 0;
        let nowHight = 0;
        //当前顶部高度
        let nowMarginTop = 0;
        //获取弹框头部（这部分可双击全屏）
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        //弹窗
        const dragDom = el.querySelector('.el-dialog');
        //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
        dragDom.style.overflow = "auto";
        //清除选择头部文字效果
        //dialogHeaderEl.onselectstart = new Function("return false");
        //头部加上可拖动cursor
        dialogHeaderEl.style.cursor = 'move';
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
        let moveDown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;
            // 获取到的值带px 正则匹配替换
            let styL, styT;
            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            };
            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX;
                const t = e.clientY - disY;
                // 移动当前元素 
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;
                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };
            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
        dialogHeaderEl.onmousedown = moveDown;
        //双击头部全屏效果
        dialogHeaderEl.ondblclick = (e) => {
            if (isFullScreen == false) {
                nowHight = dragDom.clientHeight;
                nowWidth = dragDom.clientWidth;
                nowMarginTop = dragDom.style.marginTop;
                dragDom.style.left = 0;
                dragDom.style.top = 0;
                dragDom.style.height = "100VH";
                dragDom.style.width = "100VW";
                dragDom.style.marginTop = 0;
                isFullScreen = true;
                dialogHeaderEl.style.cursor = 'initial';
                dialogHeaderEl.onmousedown = null;
            } else {
                dragDom.style.height = "auto";
                dragDom.style.width = nowWidth + 'px';
                dragDom.style.marginTop = nowMarginTop;
                isFullScreen = false;
                dialogHeaderEl.style.cursor = 'move';
                dialogHeaderEl.onmousedown = moveDown;
            }
        }
        dragDom.onmousemove = function (e) {
            let moveE = e;
            if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
                dragDom.style.cursor = 'w-resize';
            } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
                dragDom.style.cursor = 's-resize';
            } else {
                dragDom.style.cursor = 'default';
                dragDom.onmousedown = null;
            }
            dragDom.onmousedown = (e) => {
                const clientX = e.clientX;
                const clientY = e.clientY;
                let elW = dragDom.clientWidth;
                let elH = dragDom.clientHeight;
                let EloffsetLeft = dragDom.offsetLeft;
                let EloffsetTop = dragDom.offsetTop;
                dragDom.style.userSelect = 'none';
                let ELscrollTop = el.scrollTop;
                //判断点击的位置是不是为头部
                if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
                    //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
                }else{
                    document.onmousemove = function (e) {
                        e.preventDefault(); // 移动时禁用默认事件
                        //左侧鼠标拖拽位置
                        if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                            //往左拖拽
                            if (clientX > e.clientX) {
                                dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
                            }
                            //往右拖拽
                            if (clientX < e.clientX) {
                                if(dragDom.clientWidth < minWidth){
                                }else{
                                    dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
                                }
                            }
                        }
                        //右侧鼠标拖拽位置
                        if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
                            //往左拖拽
                            if (clientX > e.clientX) {
                                if (dragDom.clientWidth < minWidth) {
                                } else {
                                    dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                                }
                            }
                            //往右拖拽
                            if (clientX < e.clientX) {
                                dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
                            }
                        }
                        //底部鼠标拖拽位置
                        if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
                            //往上拖拽
                            if (clientY > e.clientY) {
                                if (dragDom.clientHeight < minHeight) {
                                } else {
                                    dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
                                }
                            }
                            //往下拖拽
                            if (clientY < e.clientY) {
                                dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px';
                            }
                        }
                    };
                    //拉伸结束
                    document.onmouseup = function (e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            }
        }
    }
})
// 兼容ie,谷歌
// v-dialogDrags: 弹窗拖拽属性 （重点！！！ 给模态框添加这个属性模态框就能拖拽了）
Vue.directive('dialogDrags', { //属性名称dialogDrags，前面加v- 使用
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      const dragDom = el.querySelector('.el-dialog');
      //dialogHeaderEl.style.cursor = 'move';
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0px;'
      dragDom.style.cssText += ';left:0px;'
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = (function() {
        if (window.document.currentStyle) {
          return (dom, attr) => dom.currentStyle[attr];
        } else{
          return (dom, attr) => getComputedStyle(dom, false)[attr];
        }
      })()
      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;
        const screenWidth = document.body.clientWidth; // body当前宽度
        const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)
        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度
        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
        // 获取到的值带px 正则匹配替换
        let styL = sty(dragDom, 'left');
        let styT = sty(dragDom, 'top');
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if(styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
        }else {
          styL = +styL.replace(/\px/g, '');
          styT = +styT.replace(/\px/g, '');
        };
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          // 边界处理
          if (-(left) > minDragDomLeft) {
            left = -(minDragDomLeft);
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }
          if (-(top) > minDragDomTop) {
            top = -(minDragDomTop);
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }
          // 移动当前元素
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        };
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  })

```


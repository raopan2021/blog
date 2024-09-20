---
layout: doc
---

# vue.draggable

[vue2版中文文档](https://www.itxst.com/vue-draggable/tutorial.html)

Vue.Draggable是一款基于Sortable.js实现的vue拖拽插件。支持移动设备、拖拽和选择文本、智能滚动，可以在不同列表间拖拽、不依赖jQuery为基础、vue 2过渡动画兼容、支持撤销操作，总之是一款非常优秀的vue拖拽组件。本篇将介绍如何搭建环境及简单的例子，使用起来特别简单对被拖拽元素也没有CSS样式的特殊要求。

``` vue
<template>
  <!--使用draggable组件-->
  <div class="dragComponent">

    <div class="col">
      <div class="title">所有字段</div>
      <VueDraggable v-model="arr1" filter=".forbid" :options="{ group: { name: 'itxst', pull: 'clone' }, sort: true }"
        animation="300">
        <transition-group :style="transitionGroupStyle">
          <div :class="arr1Forbid(item.id)" v-for="item in arr1" :key="item.id">{{ item.name }}
            <button class="fr" v-if="arr1AllowDrag(item.id)">></button>
          </div>
        </transition-group>
      </VueDraggable>
    </div>

    <div class="col">
      <div class="title">X 轴字段</div>

      <VueDraggable v-model="arr2" filter=".forbid" group="itxst" animation="300">
        <transition-group :style="transitionGroupStyle">
          <div class="dragItem forbid" v-for="item in arr2" :key="item.id">{{ item.name }}
            <button class="fr" @click="delItem2(item.id)">x</button>
          </div>
        </transition-group>
      </VueDraggable>

      <br />
      <br />

      <div class="title">Y 轴字段</div>
      <VueDraggable v-model="arr3" filter=".forbid" :disabled="arr3Disabble" group="itxst" animation="300">
        <transition-group :style="transitionGroupStyle">
          <div class="dragItem forbid" v-for="item in arr3" :key="item.id">{{ item.name }}
            <button class="fr" @click="delItem3(item.id)">x</button>
          </div>
        </transition-group>
      </VueDraggable>

    </div>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'

export default {
  name: 'HelloWorld',
  components: {
    VueDraggable
  },
  data () {
    return {
      disabled: false,

      arr1: [
        { id: 1,name: 'www.itxst.com' },
        { id: 2,name: 'www.jd.com' },
        { id: 3,name: 'www.baidu.com' },
        { id: 4,name: 'www.taobao.com' }
      ],
      arr2: [
        { id: 5,name: 'www.google.com' },
        { id: 6,name: 'www.msn.com' },
        { id: 7,name: 'www.ebay.com' },
      ],
      arr3: [
        { id: 8,name: 'www.yahoo.com' }
      ],
      moveId: -1,
      transitionGroupStyle: 'min-height:120px;display: block;'
    };
  },
  methods: {
    arr1Forbid (id) {
      console.log(this.arr2.some(item => id === item.id));
      if (this.arr2.some(item => id === item.id) || this.arr3.some(item => id === item.id)) {
        console.log(id);
        return "dragItem forbid"
      }
      return "dragItem"
    },
    arr1AllowDrag (id) {
      return !(this.arr2.some(item => id === item.id) || this.arr3.some(item => id === item.id))
    },
    arr3Disabble () {
      console.log(this.arr3.length);
      return this.arr3.length > 0 ? true : false;
    },

    // X轴删除item
    delItem2 (id) {
      this.arr2 = this.arr2.filter((item) => {
        return item.id !== id
      })
    },
    // Y轴删除item
    delItem3 (id) {
      this.arr3 = this.arr3.filter((item) => {
        return item.id !== id
      })
    },
  },
}
</script>

<style>
.dragComponent {
  margin: 10px;
  text-align: left;
}

.col {
  width: 40%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
  float: left;
}

.title {
  padding: 12px;
}

.dragItem {
  padding: 12px;
  margin: 10px;
  border: 1px dashed #63bddb;
  border-radius: 8px;
  background-color: #f1f1f1;
  text-align: left;
}

.dragItem:hover {
  border: 1px solid #1b8fb5;
  background-color: #bcdce7;
  cursor: move;
}

.fr {
  float: right;
}
</style>

```

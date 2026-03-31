# v-model 实现原理

## 📖 本节总结

`v-model` 是语法糖，不同元素编译为不同的绑定方式：

- 输入元素 → `value` + `input` 事件
- 复选框 → `checked` + `change` 事件
- 下拉框 → `value` + `change` 事件

## v-model 编译
### input 元素
```vue
<!-- 模板 -->
<input v-model="message">
<!-- 编译后 -->
<input :value="message" @input="message = $event.target.value">
```
### textarea 元素
```vue
<!-- 模板 -->
<textarea v-model="content"></textarea>
<!-- 编译后 -->
<textarea :value="content" @input="content = $event.target.value"></textarea>
```
### select 元素
```vue
<!-- 模板 -->
<select v-model="selected">
  <option value="a">A</option>
  <option value="b">B</option>
</select>
<!-- 编译后 -->
<select :value="selected" @change="selected = $event.target.value">
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```
## 复选框
```vue
<!-- 模板 -->
<input type="checkbox" v-model="checked">
<!-- 编译后 -->
<input
  type="checkbox"
  :checked="checked"
  @change="checked = $event.target.checked"
>
```
## 单选框
```vue
<!-- 模板 -->
<input type="radio" value="a" v-model="pick">
<!-- 编译后 -->
<input
  type="radio"
  value="a"
  :checked="pick === 'a'"
  @change="pick = 'a'"
>
```
## v-model 修饰符
### .trim
```vue
<!-- 模板 -->
<input v-model.trim="name">
<!-- 编译后 -->
<input
  :value="name"
  @input="name = $event.target.value.trim()"
>
```
### .number
```vue
<!-- 模板 -->
<input v-model.number="age">
<!-- 编译后 -->
<input
  :value="age"
  @input="age = toNumber($event.target.value)"
>
```
### .lazy
```vue
<!-- 模板 -->
<input v-model.lazy="name">
<!-- 编译后 -->
<input
  :value="name"
  @change="name = $event.target.value"
>
```
## 自定义组件的 v-model
```vue
<!-- 父组件 -->
<template>
  <MyInput v-model="message"></MyInput>
</template>
<!-- 等价于 -->
<MyInput
  :modelValue="message"
  @update:modelValue="message = $event"
></MyInput>
```
### 子组件实现
```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
function handleInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>
<template>
  <input :value="props.modelValue" @input="handleInput">
</template>
```
## v-model 的本质
```javascript
// v-model 在不同元素上有不同的实现
// 文本输入
:value + @input
// 复选框/单选框
:checked + @change
// 或
:selected + @change (select)
// 自定义组件
:modelValue + @update:modelValue
```
## runtime-dom 中的 v-model
```javascript
// packages/runtime-dom/src/directives/vModel.ts
// 文本输入处理
const vModelText = {
  beforeMount(el, { value, modifiers }) {
    el.value = value
    // 添加事件监听
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) {
      el.value = value
    }
  }
}
// 复选框处理
const vModelCheckbox = {
  beforeMount(el, { value }) {
    el.checked = value
  },
  updated(el, { value, oldValue }) {
    el.checked = value
  }
}
// 下拉框处理
const vModelSelect = {
  // ...
}
```
## 多个 v-model
```vue
<!-- 模板 -->
<UserForm
  v-model:name="name"
  v-model:email="email"
  v-model:age="age"
></UserForm>
<!-- 编译后 -->
<UserForm
  :name="name" @update:name="name = $event"
  :email="email" @update:email="email = $event"
  :age="age" @update:age="age = $event"
></UserForm>
```
## 总结
| 元素类型 | v-model 编译结果 |
|----------|------------------|
| input[type=text] | `:value` + `@input` |
| input[type=checkbox] | `:checked` + `@change` |
| input[type=radio] | `:checked` + `@change` |
| select | `:value` + `@change` |
| textarea | `:value` + `@input` |
| 自定义组件 | `:modelValue` + `@update:modelValue` |

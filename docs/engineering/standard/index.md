# 代码规范

代码规范是指程序员在编码时要遵守的规则，规范的目的就是为了让程序员编写易于阅读、可维护的代码。

统一代码规范的好处：

* 规范的代码可以促进团队合作
* 规范的代码可以降低维护成本
* 规范的代码有助于 code review（代码审查）
* 养成代码规范的习惯，有助于程序员自身的成长

当团队的成员都严格按照代码规范来写代码时，可以保证每个人的代码看起来都像是一个人写的，看别人的代码就像是在看自己的代码（代码一致性），阅读起来更加顺畅。更重要的是我们能够认识到规范的重要性，并坚持规范的开发习惯。

代码规范一般包含了

1. 代码格式规范
2. 变量和函数命名规范
3. 文档注释规范等等。

## 代码格式规范

一般是指代码缩进使用空格还是 Tab、每行结尾要不要加分号、左花括号需不需要换行等等。

## 命名规范

命名规范一般指命名是使用驼峰式、匈牙利式还是帕斯卡式；用名词、名词组或动宾结构来命名。

```js
const smallObject = {} // 驼峰式，首字母小写
const SmallObject = {} // 帕斯卡式，首字母大写
const strName = 'strName' // 匈牙利式，前缀表示了变量是什么。这个前缀 str 表示了是一个字符串
```

```js
// 变量命名示例
const appleNum = 1
const sum = 10

// 函数命名示例
function formatDate() { ... }
function toArray() { ... }
```

由于拼音同音字太多，千万不要使用拼音来命名。

## 文档注释规范

总的来说，注释是必要的，并且要写好注释，着重描述代码做了什么。如果还有人说不写注释，让他看看 linux 项目去，每一个文件都有注释。

文档注释比较简单，例如单行注释使用 `//`，多行注释使用 `/**/`。

```js
/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @return {number}
 */
function add(a, b) {
    return a + b
}

// 单行注释
const active = true
```

## JavaScript 代码规范参考

* [airbnb (101k star 英文版)](https://github.com/airbnb/javascript)
* [airbnb-中文版](https://github.com/lin-123/javascript)
* [standard (24.5k star) 中文版](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)
* [百度前端编码规范 3.9k star](https://github.com/ecomfe/spec)

## CSS 代码规范参考

* [styleguide 2.3k star](https://github.com/fex-team/styleguide/blob/master/css.md)
* [spec 3.9k star](https://github.com/ecomfe/spec/blob/master/css-style-guide.md)

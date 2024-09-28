# js技巧

## 重构赋值

通过重构赋值，可以轻松地从数组或对象中提取值。可以使用简洁的语法直接提取特定值，而不是传统的变量赋值。这有助于编写更简洁、更易读的代码，尤其是在处理复杂的数据结构时。

假设我们有一个对象，包含用户的姓名和年龄信息：

``` js
let user = { name: "张三", age: 30 };
// 使用传统的方法，我们需要单独声明变量来提取这些信息：

let name = user.name;
let age = user.age;
// 但是通过解构赋值，我们可以更简洁地实现同样的目的：
```

``` js
let { name, age } = user;
// 这样，我们就能直接从 user 对象中提取 name 和 age 属性的值，并将它们分别赋给同名的变量。
// 这种方法不仅代码更加简洁，而且提高了代码的可读性。
```

## 展开语法 [...array1, ...array2]

展开语法（三点： ... ）允许将数组、对象或函数参数扩展为单独的元素。这对于合并数组、克隆对象或向函数动态传递多个参数等任务非常有用。该功能可简化数据操作，大大减少代码的冗长度。

假设我们有两个数组，需要将它们合并成一个新数组：

``` js
let array1 = [1, 2, 3];
let array2 = [4, 5, 6];
```

使用传统的方法，我们可能会使用 concat 方法：

``` js
let combinedArray = array1.concat(array2);
```

但是通过使用展开语法，我们可以更简洁地实现相同的目的：

``` js
let combinedArray = [...array1, ...array2];
```

这样，array1 和 array2 中的元素就被展开，并组成了一个新的数组 combinedArray。这种方法不仅代码更加简洁，而且更直观易懂。

## Promises 和 Async/Await

在 JavaScript 中，Promises 和 async/await 是管理异步操作的重要特性。

Promises 处理异步任务，并通过 .then() 和 .catch() 方法处理成功或失败的情况。

Async/await 提供了一种更优雅、更同步的语法来处理 promises，使异步代码更易读和可维护。

假设我们有一个异步函数 fetchData，用于从某个 API 获取数据：

``` js
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve("数据获取成功");
        }, 1000);
    });
}
```

使用 Promises 的方法，我们可以这样处理成功或失败的情况：

``` js
fetchData()
    .then(data => {
        console.log(data); // 输出 "数据获取成功"
    })
    .catch(error => {
        console.error(error);
    });
```

但是，使用 Async/Await，我们可以以更同步的方式写出这段代码：

``` js
async function getData() {
    try {
        let data = await fetchData();
        console.log(data); // 输出 "数据获取成功"
    } catch (error) {
        console.error(error);
    }
}

getData();
```

在这个例子中，Async/Await 使得异步代码的结构更清晰，更接近于传统的同步代码结构，从而提高了代码的可读性和可维护性。

## Memoization 内存化

内存化 Memoization 是一种根据输入参数缓存函数结果的技术。

通过存储以前计算的结果，可以避免多余的计算，显著提高重复或昂贵函数的性能。在 JavaScript 中实现缓存可以很简单，只需创建一个缓存对象，并在计算结果之前对其进行检查即可。

假设我们有一个计算斐波那契数列的函数，由于斐波那契数列的计算可以非常昂贵，因此Memoization 在这里特别有用：

``` js
function fibonacci(n) {
    if (n <= 1) { return n }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

在不使用备忘录化的情况下，这个函数会进行大量的重复计算。现在，我们引入 Memoization：

``` js
const memo = {};

function fibonacciMemoized(n) {
    if (n in memo) {
        return memo[n];
    }
    if (n <= 1) {
        return n;
    }
    memo[n] = fibonacciMemoized(n - 1) + fibonacciMemoized(n - 2);
    return memo[n];
}
```

在这个改进的版本中，我们使用一个对象 memo 来缓存已经计算过的斐波那契数。这样，每次调用 fibonacciMemoized 时，如果结果已经在缓存中，就可以直接返回，避免了不必要的重复计算。这极大地提高了函数的性能

## 事件委托

事件委托是一种使用事件转发来高效处理事件的模型。

与其给每个元素单独附加事件监听器，不如给父元素附加一个监听器，然后处理多个子元素的事件。

这种技术在处理动态生成的元素或大量元素时特别有用，因为它能减少内存消耗并提高性能。

假设我们有一个列表，列表项（list items）是动态添加的，我们希望为每个列表项添加点击事件：

``` js
<ul id="myList">
    <!-- 动态添加的列表项将会放在这里 -->
</ul>
```

在不使用事件委托的情况下，我们可能需要为每个新增的列表项单独添加事件监听器。但是使用事件委托，我们只需在父元素上设置一次监听器：

``` js
document.getElementById('myList').addEventListener('click', function(e) {
    if (e.target && e.target.nodeName === 'LI') {
        console.log('列表项被点击！');
    }
});
```

在这个例子中，我们给整个列表 myList 添加了一个点击事件监听器。当点击事件发生时，我们检查事件目标 e.target 是否是列表项（即 LI 元素）。如果是，我们就执行相应的操作。

这样，无论列表中有多少项，或者以后添加了多少新项，都无需单独为每一项添加事件监听器，从而提高了性能并减少了内存使用。

## 使用控制台调试

JavaScript 中的控制台对象提供了强大的调试功能。

除了 console.log()，还可以使用

- console.warn()
- console.error()
- console.table() 来增强试工作流。

- console.time() + console.timeEnd()

此外，使用 console.log() 中的 %c 占位符，可以为控制台消息设置样式，使它们更具视觉吸引力并更易于区分。

<script setup>
import ComponentInHeader from '../../components/ComponentInHeader.vue'
</script>

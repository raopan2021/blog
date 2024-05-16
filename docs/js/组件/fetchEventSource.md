# fetchEventSource

在与 `chatGpt` 对话时，大模型会连续生成结果，前端不断接收数据，这是如何实现的呢？

下面用 `nodejs` 和 前端 `vue3` 实现一个 demo 示例：

安装组件

``` bash
npm install @microsoft/fetch-event-source
```

::: code-group

```vue [demo.vue]
<script setup>
import { fetchEventSource } from '@microsoft/fetch-event-source';

const ctrl = new AbortController(); // 通过这个信号来取消你的fetch请求。
const startFetch = () => { fetchEventSource('http://Localhost:3000/sse', {
  method:'POST',
  headers: {
    'Content-Type': 'application/json',
  }
  body: JSON,stringify({}),
  signal: ctrl.signal,
  openWhenHidden: true,
  async onopen(response) {
    console.log('onopen', response);
  }
  onmessage(res){
    console.log('fetchEventSource:',res);
  }
  onclose(){
    console.log('onclose');
  },
  onerror(err){
    console.log('onerror', err);
    ctrl.abort();
    throw err;
  }
})};

const stopFetch = ()=>{
  ctrl.abort();
}
</script>

<template>
  <div>
    <button @click="stopFetch">Stop fetch</button>
    <button @click="startFetch">Start fetch</button>
  </div>
</template>
```

```js [node.js]
// const http = require('http');
import http from 'http';

const server = http.createServer((req,res) => {

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow','GET, POST, PUT, DELETE, OPTIONS');
    res && res.sendStatus && res.sendStatus(200);
  }

  if (req.url === '/sse') {
    res.writeHead(200,{
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    let num = 0;
    let intervalld = setInterval(() => {
      num = Math.floor((Math.random()) * 101);
      res.write(`data: ${num}\n\n`);
    },1000);
    req.on('close',() => {
      clearInterval(intervalld); // 前端关闭时，停止这个计时器
    })
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000,() => {
  console.log('Server listening on port 3000...');
});

```

:::

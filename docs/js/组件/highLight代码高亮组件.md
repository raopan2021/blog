# highlight.js 代码高亮组件

在与chatGpt对话时，返回的代码如何像 `IDE` 里的代码一样高亮格式化呢？

下面用前端 `vue3` 和 `highlightjs` 实现一个 demo示例：

::: code-group

```vue [demo.vue]
<highlightjs v-show="code !=''" autodetect :code="code" />
```

```json [package.json]
"dependencies": {
  "highlight.js":"^11.8.0",
  "@highlightjs/vue-plugin":"^2.1.0",
}
```

```js [main.js]
// highlight 的样式，依赖包，组件
import 'highlight.js/styles/default.css';
import'./assets/hljs.less'；// hljs自定义背景

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import less from 'highlight.js/lib/languages/less';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';

import 'highlight.js/lib/common';
import hljsvueplugin from '@highlightjs/vue-plugin'

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript',javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('less', less);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python',python);
hljs.registerLanguage('typescript',typescript);
hljs.registerLanguage('php', php);

app.use(router).use(DevUl).use(pinia).use(hljsVuePlugin)
```

:::

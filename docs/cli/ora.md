# ora

在终端控制台展示loading效果

## 常用命令

::: code-group

```bash [pnpm]
pnpm add ora
```

```bash [npm]
npm install ora
```

:::

## 使用示例

```js
import ora from 'ora'

const spinner = ora('Loading unicorns').start()
// ⠏ Loading unicorns

setTimeout(() => {
    spinner.color = 'yellow'
    spinner.text = 'Loading rainbows'
    // ⠦ Loading rainbows
},3000)

setTimeout(() => {
    spinner.succeed('Loading complete')
    // ✔ Loading complete
},8000)
```

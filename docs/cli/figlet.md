# figlet

## 安装

::: code-group

```bash [pnpm]
pnpm add figlet
```

```bash [npm]
npm install figlet
```

:::

## 使用

```bash
import figlet from 'figlet';

console.log(figlet.textSync('Hello!',{
    font: 'sweet',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));
```

```bash
PS D:\Code\blog\test> node .\index.js

 ___                 ___   ___            ___  
(   )               (   ) (   )          (   )
 | | .-.     .--.    | |   | |    .--.    | |
 | |/   \   /    \   | |   | |   /    \   | |
 |  .-. .  |  .-. ;  | |   | |  |  .-. ;  | |
 | |  | |  |  | | |  | |   | |  | |  | |  | |
 | |  | |  |  |/  |  | |   | |  | |  | |  | |
 | |  | |  |  ' _.'  | |   | |  | |  | |  | |
 | |  | |  |  .'.-.  | |   | |  | '  | |  |_|
 | |  | |  '  `-' /  | |   | |  '  `-' /  .-.
(___)(___)  `.__.'  (___) (___)  `.__.'  (   )
                                          '-'
```

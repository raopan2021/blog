---
title: Vim 编辑器
---

# Vim 编辑器完全指南

Vim 是 Linux 系统中预装的全屏文本编辑器，由 vi 发展而来。学会 Vim 能让你在任意服务器上高效编辑文件。本文从三种模式讲起，系统梳理常用命令和配置技巧。

## 三种模式

Vim 有三种主要工作模式，理解它们是掌握 Vim 的基础。

### 1. 普通模式（Normal Mode）

启动 Vim 后默认进入普通模式。此模式下按键不是输入文字，而是执行各种编辑操作（如删除、复制、跳转到指定行等）。

```

普通模式 ←—— i/o/a 等 ——→ 插入模式
    ↑
插入模式 ESC 键 ↓
    ←———— : ————— 命令模式
```


按 `Esc` 键随时回到普通模式。

### 2. 插入模式（Insert Mode）

在普通模式下按以下键进入插入模式：

| 按键 | 说明 |
|------|------|
| `i` | 在光标前插入（insert） |
| `a` | 在光标后插入（append） |
| `o` | 在当前行下方新建一行 |
| `O` | 在当前行上方新建一行 |
| `I` | 跳到行首并进入插入模式 |
| `A` | 跳到行尾并进入插入模式 |
| `s` | 删除光标字符并进入插入模式 |
| `S` | 删除整行并进入插入模式 |

### 3. 命令模式（Command Mode）

在普通模式下按 `:` 进入命令模式，用于保存、退出、搜索、替换等操作。

```vim
:w              " 保存（write）
:q              " 退出（quit）
:wq             " 保存并退出
:q!             " 强制退出（不保存）
:x              " 保存并退出（等价于:wq）
:e filename     " 打开文件
:saveas filename " 另存为

" 搜索替换
:/keyword        " 向下搜索 keyword
:?keyword        " 向上搜索 keyword
:noh             " 取消高亮（no highlight）
:%s/old/new/g    " 全局替换（所有行的所有匹配）
:%s/old/new/gc   " 全局替换（逐个确认）
```


## 常用命令详解

### 光标移动

```vim
" 基础移动
h               " 左移
l               " 右移
j               " 下移
k               " 上移
w               " 跳到下一个单词首
b               " 跳到上一个单词首
e               " 跳到当前单词尾

" 行内跳转
0               " 跳到行首
$               " 跳到行尾
^               " 跳到行首（非空白字符）

" 文件内跳转
gg              " 跳到文件首行
G               " 跳到文件末行
:n              " 跳到第 n 行
:ngg 或 :n1;n2  " 多行跳转

" 屏幕内移动
H               " 跳到屏幕顶部（High）
M               " 跳到屏幕中间（Middle）
L               " 跳到屏幕底部（Low）

" 滚动屏幕
Ctrl+E          " 向下滚动一行
Ctrl+Y          " 向上滚动一行
Ctrl+D          " 向下滚动半屏
Ctrl+U          " 向上滚动半屏
Ctrl+F          " 向下滚动一屏（Forward）
Ctrl+B          " 向上滚动一屏（Backward）
zz              " 将当前行居中显示
zt              " 将当前行移到屏幕顶部
zb              " 将当前行移到屏幕底部
```


### 文本编辑

```vim
" 删除（普通模式下）
x               " 删除光标处字符
dd              " 删除整行
d$              " 删除到行尾
d0              " 删除到行首
dw              " 删除一个单词
d3w             " 删除3个单词
d5j             " 删除当前行及以下5行
d5gg            " 删除当前行到第5行

" 复制（yank）
yy              " 复制整行
y$              " 复制到行尾
y0              " 复制到行首
yw              " 复制一个单词
y3w             " 复制3个单词
p               " 在光标后粘贴
P               " 在光标前粘贴

" 粘贴板上内容（配合系统剪贴板）
"+y             " 复制到系统剪贴板
"+p             " 从系统剪贴板粘贴
"+x             " 剪切到系统剪贴板

" 撤销与重做
u               " 撤销（undo）
Ctrl+R          " 重做（redo）
U               " 撤销对整行的修改

" 重复操作
.               " 重复上一次操作
3.              " 重复3次
```


### 区块操作（可视化模式）

```vim
v               " 进入字符可视化模式（visual）
V               " 进入行可视化模式
Ctrl+V          " 进入块可视化模式

" 在可视化模式下
y               " 复制选区
d               " 删除选区
p               " 粘贴选区
u               " 转为小写
U               " 转为大写
>               " 向右缩进
<               " 向左缩进
:norm I//       " 选区每行行首插入 //

" 块操作示例：在多行行首添加注释
Ctrl+V          " 进入块可视化
jjj             " 向下选中多行
I               " 进入插入模式
//              " 输入注释符
Esc Esc         " 两次Esc应用更改
```


### 查找与跳转

```vim
" 查找
/keyword         " 向下查找
?keyword         " 向上查找
n               " 跳到下一个匹配
N               " 跳到上一个匹配
*               " 向下查找光标所在单词
#               " 向上查找光标所在单词

" 配对括号跳转
%               " 跳到匹配的括号

" 标记（mark）
mx              " 设置标记 x（a-z）
'x              " 跳到标记 x 所在行
`x              " 跳到标记 x 精确位置
:marks           " 查看所有标记

" 跳转列表（快速回退）
Ctrl+O          " 跳到上一个位置
Ctrl+I          " 跳到下一个位置
```


### 高级操作

```vim
" 缩进
>>              " 当前行向右缩进
<<              " 当前行向左缩进
=               " 自动格式化选区

" 大小写转换
~               " 切换光标处字符大小写
gUU             " 当前行转为大写
guu             " 当前行转为小写
gUiw            " 整个单词转为大写（inner word）
guiw            " 整个单词转为小写

" 数字操作
Ctrl+A          " 光标处数字+1
Ctrl+X          " 光标处数字-1
```


## 分屏与多文件

```vim
" 分屏
:sp filename    " 水平分屏（上下）
:sp             " 水平分屏当前文件
:vsp filename   " 垂直分屏（左右）
:vsp            " 垂直分屏当前文件

" 分屏切换
Ctrl+W H/J/K/L  " 切换到左/下/上/右的窗口
Ctrl+W W        " 切换到下一个窗口
Ctrl+W C        " 关闭当前窗口
Ctrl+W O        " 只保留当前窗口

" 标签页
:tabnew filename " 新建标签页
gt               " 切换到下一个标签页
gT               " 切换到上一个标签页
:tabclose        " 关闭当前标签页
:tabonly         " 关闭所有其他标签页
```


## 配置文件

Vim 的配置文件位于用户家目录下的 `.vimrc`（全局配置）和 `~/.vim/`（插件配置）。

### 基础配置示例

```vim
" ~/.vimrc

" ============ 基础设置 ============
set number              " 显示行号
set relativenumber      " 显示相对行号（配合 . 数字使用）
set cursorline          " 高亮当前行
set cursorcolumn        " 高亮当前列
set showcmd             " 显示输入的命令
set showmode            " 显示当前模式
set wildmenu            " 命令补全
set showmatch           " 高亮匹配括号

" ============ 缩进 ============
set tabstop=4           " Tab宽度为4空格
set shiftwidth=4        " 自动缩进宽度
set expandtab           " Tab转为空格
set smarttab            " 智能Tab
set autoindent          " 自动缩进
set smartindent         " 智能缩进（C语言等）

" ============ 搜索 ============
set incsearch           " 增量搜索
set ignorecase          " 忽略大小写
set smartcase           " 智能大小写（有大写时区分）
set hlsearch            " 高亮搜索结果
set nowrapscan          " 搜索到文件尾不折回

" ============ 外观 ============
syntax on               " 语法高亮
colorscheme desert      " 配色方案（可选 molokai/ dracula）
set background=dark    " 暗色背景
set background=light   " 亮色背景
set termguicolors       " 启用真彩色

" ============ 功能 ============
set mouse=a             " 启用鼠标
set clipboard=unnamed   " 共享剪贴板
set autoread            " 文件外部修改时自动加载
set nobackup           " 不生成备份文件
set noswapfile         " 不生成交换文件
set encoding=utf-8     " 编码
set fileencodings=utf-8,gbk,latin1 " 文件编码识别顺序

" ============ 快捷键 ============
let mapleader = ","    " 定义 leader 键
nnoremap <Leader>w :w<CR>          " ,w 保存
nnoremap <Leader>q :q<CR>          " ,q 退出
nnoremap <Leader>e :Lex<CR>        " ,e 文件浏览器
nnoremap <F5> :!python %<CR>       " F5 运行Python

" ============ 状态栏 ============
set laststatus=2       " 始终显示状态栏
set statusline=%f\ %m\ %r%=%y\ %l:%c\ %P

" ============ 代码折叠 ============
set foldmethod=marker  " 按标记折叠
set foldlevel=99       " 默认展开所有
```


### 常用配置项速查

| 配置项 | 说明 |
|--------|------|
| `set ai` | 自动缩进 |
| `set noai` | 关闭自动缩进 |
| `set ic` | 搜索忽略大小写 |
| `set noic` | 搜索区分大小写 |
| `set wrap` | 自动换行 |
| `set nowrap` | 不自动换行 |
| `set hidden` | 切换buffer时不保存 |
| `set backspace=indent,eol,start` | 退格键行为 |
| `set paste` | 粘贴模式（保留格式） |
| `set nopaste` | 关闭粘贴模式 |

## 实用技巧

### 1. 快速缩进整段代码

```vim
" 选中后按 > 或 <
Vjj>            " 向下选中3行并右缩进
```


### 2. 同时编辑多行（列模式）

```vim
" 在多行行尾添加分号
Ctrl+V jjj A;   " 选中多列后，Shift+A 在行尾追加
Esc
```


### 3. 读取命令输出

```vim
:r!ls -la       " 将 ls -la 的结果插入到光标位置
:r!date         " 插入当前日期时间
```


### 4. 格式化JSON

```vim
:%!python -m json.tool    " 格式化JSON
```


### 5. 查看文件差异

```bash
vimdiff file1 file2       " 比较两个文件
```


### 6. 宏录制

```vim
qa                     " 开始录制宏到寄存器 a
...（操作）...
q                      " 停止录制
@a                     " 执行宏
@@                     " 重复上一次宏
100@a                  " 执行宏100次
```


### 7. 快速删除匹配行

```vim
:g/pattern/d            " 删除所有匹配的行
:g!/pattern/d           " 删除所有不匹配的行
```


### 8. 打开最近文件

```vim
:oldfiles              " 查看最近编辑的文件
:browse oldfiles       " 可视化选择
```


## 常见问题

**Q: 如何复制整行而不移动光标？**
```vim
yy                     " 普通模式下复制整行
"+y                   " 复制到系统剪贴板
```


**Q: 如何取消搜索高亮？**
```vim
:noh                  " 临时取消
" 或在 .vimrc 中
set nohlsearch        " 彻底关闭搜索高亮
```


**Q: 如何显示不可见字符（Tab、空格）？**
```vim
:set list
:set listchars=tab:▸·,trail:·
```


**Q: 如何让退格键正常工作？**
```vim
set backspace=indent,eol,start
```


**Q: 如何在 Vim 中运行 Shell 命令？**
```vim
:!command             " 运行一次命令
:shell                " 打开一个shell（exit返回）
```


掌握以上内容后，日常编辑文件已完全够用。Vim 的学习曲线较陡，但一旦熟练，编辑效率远超图形化编辑器。建议从本文的基础命令开始，在日常使用中逐步增加新命令，最终形成自己的 `.vimrc` 配置。

[[返回 Linux 首页|../index]]

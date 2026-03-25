# 搭建 Markdown 强大写作环境（VSCode）

## Markdown 编写环境概览

Markdown 是一种易于读写的轻量级的标记语言，编写出的作品简洁美观，近年来受到了越来越多的追捧，被广泛地用于日常写作，乃至电子书发表。与此同时，一系列优秀 Markdown 编辑器应运而生。其中较为著名的有，Typora（免费，跨平台）、MarkText（开源，跨平台）、Zettlr（开源，跨平台）、MacDown（开源，macOS）等等。

VSCode 是当下最流行的代码编辑器，拥有丰富的扩展，这也使其成为最强大的文本编辑器之一（拒绝伤害 Vim 党人及 Emacs 党人），搞定 Markdown 自然不在话下。与上面提到的编辑器相比，VSCode 的明显优势有：

- 集成的布局：大纲（outline）、工作区（workspace）；
- 强大的补全：LaTeX 公式；
- 丰富的扩展：方便整合其他工具（详见下文的功能扩展部分）；

## 语法扩展

VSCode 默认是支持 Markdown 的，但还是有必装下面 3 个插件提高写作效率。

- Markdown All in One
- mardownlint
- Markdown Kroki

## Markdown All in One

如名称所述，这是个大一统型的扩展，集成了撰写 Markdown 时所需要的大部分功能，是 Markdown 类插件中下载榜榜首。可认为是 VSCode 中的 Markdown 必备扩展。其功能涵盖：

- 快捷键自动生成并更新目录
- 自动格式化表格
- LaTeX 数学公式支持

## markdownlint

这是个功能强大的 Markdown 语法检查器，可以帮助你书写出规范的文档，同时避免书写错误导致文档无法渲染。个人观点，认为这个也是必装扩展。

[markdownlint常见错误提示速查](./lint.md)

## Markdown Kroki

很多时候，写文档难免需要绘制一些用于说明的插图，如流程图、甘特图等，这个时候，若另开一个应用画图，再导入文档，则略显繁琐。Markdown Kroki 支持包括 mermaid，PlantUML，graphviz 等在内的多种文本绘图。

## 表格编辑

安装 MdTableEditor 扩展，火箭提升表格编辑效率

## md-table 文档绘图

虽然有 mermaid，但有时候我们总会需要绘制一些复杂的图形。这时，可以使用 VSCode 商店里大名鼎鼎的 Draw.io 的内嵌扩展，安装完毕后三连：➡️ 新建 .drawio 文件 ➡️ 傻瓜绘图 ➡️ 导出为需要的格式。

## draw.io 字数统计

这里推荐 Word Count CJK，可对各种字符进行统计，安装扩展后，在 setting.json 中修改

```json
{
  "wordcount_cjk.activateLanguages": ["markdown", "plaintext", "latex"],
  "wordcount_cjk.statusBarTextTemplate": "中文：${cjk} 字 + 英文：${en_words} 词",
  "wordcount_cjk.statusBarTooltipTemplate": "中文字数：${cjk} \\n 非 ASCII 字符数：\\t${total - ascii} \\n 英文单词数：${en_words} \\n 非空白字符数：${total - whitespace} \\n 总字符数：${total}"
}
```

至此，VSCode 已经实现了 Typora 等 Markdown 编辑器除所见即所得（WYSIWYG）之外的全部功能。

# AI 大模型

> 本章节记录 AI 大模型相关的学习笔记，包括本地模型部署、Prompt 工程等

## 📚 目录导航

### 本地部署
- [Ollama 本地大模型](./ollama.md) - 本地部署开源大模型

## 🔗 相关资源

- [ChatGPT](https://chat.openai.com) - OpenAI GPT 模型
- [Claude](https://claude.ai) - Anthropic Claude 模型
- [Midjourney](https://www.midjourney.com) - AI 绘画工具
- [Stable Diffusion](https://stability.ai) - 开源 AI 绘画模型

## 💡 Prompt 技巧

### 基础原则
1. **明确具体** - 给出具体的任务描述和期望
2. **提供上下文** - 让模型理解背景信息
3. **分步骤** - 复杂任务拆分成多个步骤
4. **给出示例** - 提供参考示例帮助理解

### 常用技巧

```markdown
# 角色设定
你是一位资深的前端工程师，擅长 Vue3 和 TypeScript

# 任务描述
请帮我解释什么是 Composition API

# 输出要求
- 用简洁易懂的语言解释
- 提供代码示例
- 列出使用场景
```

### Few-shot Prompting

```markdown
请判断以下句子是正面还是负面：

示例：
"这部电影太精彩了" -> 正面
"服务态度很差" -> 负面

请判断：
"性价比很高，值得购买" ->
```

## 模型对比

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| GPT-4 | 能力强，成本高 | 复杂推理、代码 |
| GPT-3.5 | 性价比高 | 日常对话、简单任务 |
| Claude | 长文本能力强 | 文档处理、分析 |
| Llama | 开源可本地部署 | 学习和实验 |
| 通义千问 | 中文能力强 | 中文对话 |
| 文心一言 | 百度出品 | 中文对话 |

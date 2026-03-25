---
title: AI大模型入门
---

# AI 大模型入门

## 什么是 AI 大模型

AI 大模型（Large Language Model，LLM）是一类参数规模庞大的深度神经网络模型，通过在大规模文本数据上进行预训练，学习到了丰富的语言知识、世界常识和推理能力。

大模型的"大"主要体现在三个方面：

- **参数量大**：从数十亿到数千亿不等，GPT-4 估计有约 1.76 万亿参数
- **训练数据大**：通常使用数十TB的文本语料
- **计算量大**：训练一次需要消耗大量 GPU 算力

## 主流大模型介绍

### GPT 系列（OpenAI）

GPT（Generative Pre-trained Transformer）是 OpenAI 开发的模型系列。

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| GPT-4 | 能力强，支持多模态 | 复杂推理、代码生成 |
| GPT-4o | 速度快，成本低 | 日常对话、API 调用 |
| GPT-3.5-turbo | 性价比高 | 简单任务、原型开发 |

### Claude 系列（Anthropic）

Claude 由 Anthropic 公司开发，以安全性和长文本处理能力著称。

```python
# Claude API 调用示例
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "解释一下什么是大模型"}
    ]
)

print(message.content)
```


### 国产模型

近年来国产大模型发展迅速：

- **文心一言**（百度）：中文理解能力强，集成百度搜索
- **通义千问**（阿里）：开源力度大，Qwen 系列广受欢迎
- **DeepSeek**：高性价比，代码和数学能力强
- **Kimi**（月之暗面）：长上下文窗口突出，支持 20 万字

```python
# DeepSeek API 调用示例
import openai

client = openai.OpenAI(
    api_key="your-api-key",
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "用 Python 实现快速排序"}
    ]
)

print(response.choices[0].message.content)
```


## 如何选择大模型

选择大模型需要考虑以下因素：

### 1. 任务类型

- **代码生成**：GPT-4、Claude 3.5、DeepSeek 表现优秀
- **中文写作**：国产模型（文心、通义）可能更懂中文语境
- **长文本处理**：Kimi（20万字）、Claude（20万token）
- **低成本方案**：GPT-3.5、DeepSeek V3

### 2. API 成本对比

```

GPT-4o:      $5/1M输入  $15/1M输出
Claude 3.5:  $3/1M输入  $15/1M输出  
DeepSeek V3: $0.27/1M输入 $1.1/1M输出
```


### 3. 部署方式

如果对数据隐私有要求，可以选择：

- **开源模型本地部署**：Llama 3、Qwen 2.5、Mistral
- **私有化部署**：使用 Ollama、vLLM 等工具

```bash
# 使用 Ollama 本地部署
ollama pull qwen2.5:14b
ollama run qwen2.5:14b
```


## API 调用基础

大模型 API 通常遵循 OpenAI 兼容格式：

```python
import openai

# OpenAI 官方
client = openai.OpenAI(api_key="sk-...")

# 国内中转（绕过访问限制）
client = openai.OpenAI(
    api_key="your-key",
    base_url="https://api.openai.com/v1"  # 或其他中转地址
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个专业的Python教练"},
        {"role": "user", "content": "教我写一个斐波那契数列"}
    ],
    temperature=0.7,      # 创造性控制
    max_tokens=500,       # 最大生成长度
    top_p=0.9             # 采样策略
)

print(response.choices[0].message.content)
```


## 流式输出

对于需要实时展示的场景，使用流式输出：

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "写一首关于春天的诗"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```


## Token 计算

Token 是模型处理文本的基本单位。英文大约 1 token = 4 个字符，中文约 1 token = 1-2 个汉字。

```python
# 使用 tiktoken 计算 token 数
import tiktoken

enc = tiktoken.get_encoding("cl100k_base")  # GPT-4 使用
text = "你好，世界！"
tokens = enc.encode(text)
print(f"文本: {text}")
print(f"Token数: {len(tokens)}")
print(f"Token IDs: {tokens}")
```


## 常见错误处理

```python
import openai
from openai import RateLimitError, APIError

try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError:
    print("请求过于频繁，请稍后重试")
except APIError as e:
    print(f"API错误: {e}")
except Exception as e:
    print(f"未知错误: {e}")
```


## 最佳实践

1. **系统提示词**：为模型设定角色和约束
2. **Few-shot**：通过示例让模型理解任务格式
3. **温度控制**：创意任务用高温度（0.7-1.0），确定性任务用低温度（0-0.3）
4. **上下文管理**：适时清理对话历史，控制 token 消耗

## 总结

AI 大模型已经成为了开发者的重要工具。理解不同模型的特点、掌握 API 调用方法，能够帮助我们更高效地构建 AI 应用。

[[返回 AI 大模型首页|ai/index]]

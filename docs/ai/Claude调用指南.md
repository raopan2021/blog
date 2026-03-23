---
title: Claude调用指南
---

# Claude 调用指南

## Claude API 概述

Claude 是由 Anthropic 公司开发的大语言模型，通过官方提供的 API 可以方便地在应用中集成。Claude API 与 OpenAI API 风格类似，但有一些独特的功能。

### 支持的 Claude 模型

| 模型 | 上下文 | 特点 |
|------|--------|------|
| claude-opus-4 | 20万 token | 最强能力，适合复杂任务 |
| claude-sonnet-4 | 20万 token | 平衡性能与成本 |
| claude-3.5-sonnet | 20万 token | 高性价比，代码能力强 |
| claude-3-opus | 20万 token | 复杂推理 |
| claude-3-haiku | 20万 token | 快速响应，低成本 |

## 安装与基础调用

### 安装 SDK

```bash
pip install anthropic
```

### 基础调用

```python
import anthropic

client = anthropic.Anthropic(
    api_key="sk-ant-api03-xxxxx"  # 从 Anthropic Console 获取
)

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "请用 Python 写一个快速排序"
        }
    ]
)

print(message.content)
```

### 响应结构

```python
# message 对象的主要属性
print(message.id)           # 消息唯一 ID
print(message.type)         # "message"
print(message.role)         # "assistant"
print(message.content)      # 内容列表
print(message.model)        # 使用的模型
print(message.stop_reason)  # 停止原因: "end_turn", "stop_sequence", "max_tokens"
print(message.usage)        # token 使用量
```

## 消息内容结构

Claude 的 content 可以包含多种类型：

```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                # 文本内容
                {
                    "type": "text",
                    "text": "请分析这张图片"
                },
                # 图片（需 URL 或 base64）
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": "https://example.com/image.png"
                    }
                },
                # 文档（PDF）
                {
                    "type": "document",
                    "source": {
                        "type": "url", 
                        "url": "https://example.com/doc.pdf"
                    }
                }
            ]
        }
    ]
)
```

## System Prompt

使用 system 参数设置系统级指令：

```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="你是一个 Python 编程助手，专注于编写清晰、高效的代码。",
    messages=[
        {"role": "user", "content": "解释一下 Python 的装饰器"}
    ]
)
```

### 带样式的 System Prompt

```python
SYSTEM_PROMPT = """你是一个资深技术作家。

风格要求：
- 语言简洁明了，避免冗余
- 使用代码示例时添加注释
- 解释概念时联系实际应用场景
- 适当使用表格和列表增强可读性

格式要求：
- 标题使用 ## 
- 代码块标注语言
- 重要术语用 **bold**
"""
```

## 多轮对话

```python
messages = [
    {"role": "user", "content": "什么是递归？"},
    {"role": "assistant", "content": "递归是指..."},
    {"role": "user", "content": "能举个Python例子吗？"},
]

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=messages
)

# 新消息追加到列表
messages.append({"role": "assistant", "content": message.content[0].text})
messages.append({"role": "user", "content": "复杂度是多少？"})
```

## 流式输出

```python
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "写一首关于程序员的诗"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### 完整事件流

```python
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "解释 Git 的工作原理"}]
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_stop":
            print("\n--- 生成完成 ---")
```

## 工具使用（Tool Use）

Claude 支持 Function Calling， 可以让模型调用外部工具：

### 定义工具

```python
from anthropic import Anthropic, TOOL_USE_RESULT

client = Anthropic()

# 定义天气查询工具
tools = [
    {
        "name": "get_weather",
        "description": "查询指定城市的天气",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "城市名称，如 北京、上海"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "温度单位"
                }
            },
            "required": ["city"]
        }
    }
]
```

### 使用工具

```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "北京今天天气怎么样？"}
    ],
    tools=tools
)

# 模型会返回 stop_reason = "tool_use"
print(message.stop_reason)  # "tool_use"
print(message.tool_calls)    # 模型调用的工具列表

# 执行工具并返回结果
for tool_call in message.tool_calls:
    if tool_call.name == "get_weather":
        result = get_weather(tool_call.input["city"])
        
        # 提交工具结果
        tool_result = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": "北京今天天气怎么样？"},
                message,
                {
                    "role": "user",
                    "content": f"工具结果: {result}"
                }
            ],
            tools=tools
        )
        print(tool_result.content[0].text)
```

## 错误处理

```python
from anthropic import Anthropic, APIError, RateLimitError, APIStatusError

try:
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"速率限制: {e}")
except APIStatusError as e:
    print(f"API 状态错误: {e.status_code} - {e.message}")
except APIError as e:
    print(f"API 错误: {e}")
```

## Token 计算

```python
# 使用 tokenizer 计算 token 数
from anthropic import Anthropic

client = Anthropic()

# 文本 token 数
text = "你好，Claude！"
count = client.count_tokens(text)
print(f"Token 数: {count}")

# 消息 token 数（包含 overhead）
messages = [
    {"role": "user", "content": "Hello"}
]
count = client.count_tokens(messages)
print(f"消息 token 数: {count}")
```

## 与 OpenAI 兼容调用

如果你已经有 OpenAI 的代码，可以通过修改 base URL 来使用 Claude：

```python
from openai import OpenAI

# OpenAI 兼容格式
client = OpenAI(
    api_key="sk-ant-api03-xxxxx",
    base_url="https://api.anthropic.com/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "Hello"}
    ],
    # Claude 特有参数需要通过 extra_headers 传递
    extra_headers={
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
    }
)
```

## 使用 claude-cli（命令行工具）

```bash
# 安装
pip install anthropic

# 配置 API Key
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"

# 交互式对话
claude

# 单次请求
claude "解释什么是闭包"

# 流式输出
claude -s "写一个快速排序"

# 指定模型
claude -m opus "解释量子计算"
```

## 最佳实践

1. **选择合适的模型**：简单任务用 Haiku，复杂任务用 Sonnet/Opus
2. **控制 max_tokens**：设置足够大的值避免截断，但也不要过大浪费
3. **使用 system prompt**：为模型设定明确的角色和约束
4. **错误重试**：实现指数退避的重试机制处理限流
5. **流式响应**：长文本使用流式输出提升用户体验

## 价格参考

| 模型 | 输入 | 输出 |
|------|------|------|
| Opus 4 | $15/1M | $75/1M |
| Sonnet 4 | $3/1M | $15/1M |
| 3.5 Sonnet | $3/1M | $15/1M |
| 3 Haiku | $0.25/1M | $1.25/1M |

[[返回 AI 大模型首页|ai/index]]

# ABB PLC 快速入门

## ABB PLC 系列

| 系列 | 定位 | 说明 |
|------|------|------|
| **AC500-eCo** | 小型 | 入门级，高性价比 |
| **AC500** | 中型 | 模块化，通信丰富 |
| **AC500-S** | 安全 | 故障安全型 |
| **AC700** | 入门 | 简单应用 |

## 编程软件：Codesys

ABB PLC 使用 **Codesys** 作为编程环境（ABB 贴牌版本）。Codesys 是 IEC 61131-3 标准编程平台，支持所有五种编程语言。

### 安装

1. 从 ABB 官网下载 **Automation Builder**（包含 Codesys）
2. 安装后启动 Automation Builder
3. 新建项目 → 选择目标 CPU（如 PM583 / PM564）

## 项目创建

### 步骤

1. **Automation Builder** → **新建项目**
2. 选择 **PLC** → 选择具体型号
3. 在 **POU（程序组织单元）** 中编写代码
4. 下载到 PLC 或仿真运行

## 编程语言（IEC 61131-3）

### 五种语言

| 语言 | 说明 | ABB 中的使用 |
|------|------|-------------|
| **LAD** | 梯形图 | 常用，可视化 |
| **FBD** | 功能块图 | 过程控制 |
| **ST** | 结构化文本 | 复杂逻辑、计算 |
| **IL** | 指令表 | 逐步淘汰 |
| **SFC** | 顺序功能图 | 顺序控制 |

## 软元件体系

ABB 使用标准化的变量体系，不同于西门子或三菱：

| 类型 | 说明 |
|------|------|
| `%I` | 数字量输入 |
| `%Q` | 数字量输出 |
| `%IW` | 模拟量输入字 |
| `%QW` | 模拟量输出字 |
| `%M` | 标志位 |
| `%MW` | 内存字 |
| `%MX` | 内存位 |

### 变量定义

```st
VAR
    start_btn AT %IX0.0 : BOOL;    // 输入 0.0
    stop_btn AT %IX0.1 : BOOL;     // 输入 0.1
    motor_run AT %QX0.0 : BOOL;    // 输出 0.0
    counter : INT := 0;            // 计数器
END_VAR
```

## 基本编程示例

### 启保停（ST）

```st
motor_run := (start_btn OR motor_run) AND NOT stop_btn;
```

### 启保停（LAD）

```
       start_btn      stop_btn        motor_run
  ──[ ]─────────────[ ]─┤───────────( )──
                         ↑
                     motor_run 自锁
```

### 定时器（TON）

ABB 的定时器功能块命名与西门子略有不同：

```st
// 定时器实例
timer1(IN := start_sig, PT := T#5S);
Q0.0 := timer1.Q;
```

## ABB 特色功能

### 1. WebGate（可视化）

AC500 内置 Web 服务器，可通过浏览器访问 PLC 状态页面：

```
http://<PLC_IP>/webgate
```

### 2. PLC-Recorder（数据记录）

类似 S7-1500 的 Trace 功能，可记录变量波形用于诊断：

```st
// 触发条件
IF temperature > 100 THEN
    Recorder_1.Start();  // 温度超限开始记录
END_IF;
```

### 3. 通信

| 协议 | 说明 |
|------|------|
| Modbus TCP | 内置以太网口支持 |
| Modbus RTU | 通过 CM572 模块 |
| EtherNet/IP | 通过 CM579 模块 |
| PROFINET | 通过 CM579-ETH 模块 |
| CANopen | 通过 CM554 模块 |

### Modbus TCP 通信示例

```st
// 作为 Modbus TCP 从站
VAR
    ModbusTCPServer : ModbusTCP;
    holding_register : ARRAY[0..99] OF INT;  // 保持寄存器
END_VAR

// 初始化
ModbusTCPServer(
    Enable := TRUE,
    Port   := 502,
    pvHoldReg := ADR(holding_register));
```

## 与西门子对比

| 项目 | 西门子 S7-1200/1500 | ABB AC500 |
|------|---------------------|-----------|
| 编程软件 | TIA Portal | Automation Builder (Codesys) |
| 程序组织 | OB/FC/FB/DB | POU (PRG/FB/FUN) |
| 变量体系 | 绝对地址+符号 | 主要靠符号变量 |
| 安全 | F-CPU | AC500-S |
| 价格 | 中高 | 中高 |
| 市场 | 欧洲/全球 | 全球，特别是工业设备 |

> 💡 ABB PLC 在过程工业和大型机械中应用广泛，Codesys 平台的学习也为学习其他品牌（贝福、倍福等）打下基础。

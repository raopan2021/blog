---
title: Shell 脚本编程
---

# Shell 脚本编程

## 1.1 第一个 Shell 脚本

```bash
#!/bin/bash
# 这是注释
echo "Hello, World!"
```

执行方式：
```bash
chmod +x script.sh     # 添加执行权限
./script.sh             # 方式一
bash script.sh           # 方式二
```

## 1.2 变量

```bash
# 定义变量（等号两边不能有空格）
name="Alice"
age=25

# 使用变量
echo "我叫$name，今年${age}岁"

# 只读变量
readonly PI=3.14159

# 删除变量
unset name

# 系统变量
echo "当前脚本: $0"
echo "参数1: $1"
echo "参数个数: $#"
echo "所有参数: $@"
echo "进程ID: $$"
```

## 1.3 字符串

```bash
str="Hello, World!"

# 字符串长度
echo ${#str}

# 拼接
str2="Hi, "$str""
echo $str2

# 截取
echo ${str:0:5}    # Hello
echo ${str:7}       # World!
echo ${str#*o}      # 从左边删除到第一个o: World!

# 替换
echo ${str/World/Linux}  # Hello, Linux!
```

## 1.4 数组

```bash
# 定义数组
arr=(apple banana cherry)

# 访问元素
echo ${arr[0]}        # apple
echo ${arr[@]}        # 全部元素

# 数组长度
echo ${#arr[@]}

# 添加元素
arr+=(date)

# 遍历
for item in ${arr[@]}; do
    echo $item
done
```

## 1.5 运算符

```bash
# 算术运算
a=10
b=20
echo $(($a + $b))    # 30
echo $((a * b))      # 200

# 关系运算（条件表达式）
if [ $a -eq $b ]; then
    echo "相等"
fi

# 字符串运算
if [ "$str1" == "$str2" ]; then
    echo "相同"
fi

# 文件测试
if [ -f "/path/to/file" ]; then
    echo "是普通文件"
fi
if [ -d "/path/to/dir" ]; then
    echo "是目录"
fi
```

常用文件测试：

| 操作符 | 说明 |
|--------|------|
| `-f` | 普通文件 |
| `-d` | 目录 |
| `-r/-w/-x` | 可读/可写/可执行 |
| `-e` | 存在 |
| `-s` | 存在且非空 |

## 1.6 条件语句

```bash
# if-elif-else
if [ $age -lt 18 ]; then
    echo "未成年"
elif [ $age -lt 60 ]; then
    echo "成年人"
else
    echo "老年人"
fi

# case 语句
grade="A"
case $grade in
    "A") echo "优秀";;
    "B") echo "良好";;
    "C") echo "及格";;
    *) echo "未知等级";;
esac
```

## 1.7 循环

```bash
# for 循环
for i in {1..5}; do
    echo "Number: $i"
done

# C 风格 for
for ((i=0; i<5; i++)); do
    echo $i
done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo $count
    count=$((count + 1))
done

# until 循环（条件为假时执行）
until [ $count -ge 5 ]; do
    echo $count
    count=$((count + 1))
done

# 遍历文件
for f in *.txt; do
    echo "Processing: $f"
done
```

## 1.8 函数

```bash
# 定义函数
function greet() {
    echo "Hello, $1!"
}

greet "Alice"

# 返回值
function getSum() {
    local a=$1
    local b=$2
    return $((a + b))
}

getSum 3 5
echo "Result: $?"    # $? 是返回值
```

## 1.9 输入输出

```bash
# echo 输出
echo "Hello"
echo -e "Line1\nLine2"    # -e 解析转义
echo -n "No newline"         # 不换行

# printf（格式化）
printf "%-10s %5d\n" "Alice" 25
printf "%0.2f\n" 3.14159

# read 输入
echo "Enter your name:"
read name
echo "Hello, $name"

# 读取多个值
read -p "Enter: " a b c

# 超时读取
read -t 5 -p "5秒内输入: " input

# 隐藏输入
read -sp "Password: " pwd
```

## 1.10 重定向与管道

```bash
# 输出重定向
echo "hello" > file.txt    # 覆盖
echo "world" >> file.txt   # 追加

# 错误重定向
command 2> error.log       # 错误输出到文件
command &> all.log          # 所有输出到文件

# /dev/null（丢弃输出）
command > /dev/null 2>&1

# 管道
cat file | grep "keyword" | sort | uniq

# xargs（将管道输出作为参数）
find . -name "*.txt" | xargs rm
```

## 1.11 常用命令

```bash
# awk（文本处理）
awk '{print $1, $3}' file.txt
awk -F: '{print $1}' /etc/passwd

# sed（流编辑器）
sed 's/old/new/g' file.txt      # 替换
sed -i '2d' file.txt            # 删除第2行
sed -n '3p' file.txt           # 打印第3行

# grep（搜索）
grep "error" file.log
grep -r "keyword" dir/
grep -v "exclude" file.txt      # 反向选择
grep -E "error|warning" log    # ERE

# cut（切割）
cut -d: -f1 /etc/passwd        # 以:分隔，取第1列
cut -c1-10 file.txt           # 取第1-10字符
```

[[返回 Linux 首页|../index]]

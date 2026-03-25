# MySQL 数据库

> 本章节记录 MySQL 数据库的相关知识，包括安装配置、SQL 基础、进阶操作等

## 📚 目录导航

### 基础
- [SQL 基础](./mysql安装配置.md) - 数据库安装与基本配置

### 进阶
- 待补充...

## 🔗 相关资源

- [MySQL 官方文档](https://dev.mysql.com/doc/refman/8.0/en/)
- [SQL 教程 - 菜鸟教程](https://www.runoob.com/mysql/mysql-tutorial.html)

## 常用命令速查

### 连接数据库

```sql
-- 本地连接
mysql -u root -p

-- 指定主机连接
mysql -h 127.0.0.1 -P 3306 -u root -p
```


### 数据库操作

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 创建数据库
CREATE DATABASE mydb;

-- 使用数据库
USE mydb;

-- 删除数据库
DROP DATABASE mydb;
```


### 表操作

```sql
-- 查看所有表
SHOW TABLES;

-- 创建表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查看表结构
DESC users;

-- 删除表
DROP TABLE users;
```


### 增删改查（CRUD）

```sql
-- 插入数据
INSERT INTO users (name, email) VALUES ('张三', 'zhangsan@example.com');
INSERT INTO users (name, email) VALUES
  ('李四', 'lisi@example.com'),
  ('王五', 'wangwu@example.com');

-- 查询数据
SELECT * FROM users;
SELECT name, email FROM users WHERE id = 1;
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users LIMIT 10 OFFSET 0;

-- 更新数据
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 1;
```


### 条件查询

```sql
-- WHERE 条件
SELECT * FROM users WHERE name = '张三';
SELECT * FROM users WHERE age >= 18 AND age <= 30;
SELECT * FROM users WHERE name LIKE '张%';
SELECT * FROM users WHERE id IN (1, 2, 3);
SELECT * FROM users WHERE email IS NULL;
```


### 聚合函数

```sql
-- COUNT 计数
SELECT COUNT(*) FROM users;

-- SUM 求和
SELECT SUM(price) FROM orders;

-- AVG 平均值
SELECT AVG(age) FROM users;

-- MAX/MIN 最大最小值
SELECT MAX(price), MIN(price) FROM products;

-- 分组
SELECT department, COUNT(*) FROM employees GROUP BY department;

-- HAVING 分组后筛选
SELECT department, COUNT(*) as num
FROM employees
GROUP BY department
HAVING num > 5;
```


### 表连接（JOIN）

```sql
-- 内连接（INNER JOIN）
SELECT users.name, orders.order_id
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- 左连接（LEFT JOIN）
SELECT users.name, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- 右连接（RIGHT JOIN）
SELECT users.name, orders.order_id
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```


### 索引

```sql
-- 创建索引
CREATE INDEX idx_name ON users(name);
CREATE UNIQUE INDEX idx_email ON users(email);

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_name ON users;
```


### 常用数据类型

| 类型 | 说明 |
|------|------|
| INT | 整数 |
| BIGINT | 大整数 |
| FLOAT/DOUBLE | 浮点数 |
| DECIMAL | 精确小数 |
| VARCHAR(n) | 变长字符串 |
| TEXT | 长文本 |
| DATE | 日期 |
| DATETIME | 日期时间 |
| TIMESTAMP | 时间戳 |
| BOOLEAN | 布尔值 |

## 实用技巧

### 分页查询

```sql
-- 第 1 页（每页 10 条）
SELECT * FROM users LIMIT 10 OFFSET 0;

-- 第 2 页
SELECT * FROM users LIMIT 10 OFFSET 10;

-- 简化写法
SELECT * FROM users LIMIT 10, 10; -- (offset, limit)
```


### 字符串函数

```sql
SELECT CONCAT(name, ' - ', email) FROM users;
SELECT UPPER(name), LOWER(email) FROM users;
SELECT LENGTH(name) FROM users;
SELECT SUBSTRING(name, 1, 2) FROM users; -- 截取前2个字符
```


### 日期函数

```sql
SELECT NOW();           -- 当前日期时间
SELECT CURDATE();      -- 当前日期
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM users;
SELECT DATE_ADD(created_at, INTERVAL 7 DAY) FROM users;
```


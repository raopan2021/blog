---
title: SQL基础
---

# SQL 基础

## 数据库与表操作

### 创建数据库

```sql
-- 创建数据库
CREATE DATABASE blog_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE blog_db;

-- 查看所有数据库
SHOW DATABASES;

-- 删除数据库
DROP DATABASE IF EXISTS old_db;
```


### 创建表

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT DEFAULT 0,
    status TINYINT DEFAULT 1 COMMENT '1:正常 0:禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```


### 修改表结构

```sql
-- 添加列
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;

-- 修改列
ALTER TABLE users MODIFY COLUMN phone VARCHAR(11);

-- 删除列
ALTER TABLE users DROP COLUMN phone;

-- 添加索引
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD UNIQUE INDEX idx_username (username);

-- 重命名表
RENAME TABLE users TO user_info;
```


### 删除表

```sql
-- 删除表（结构和数据）
DROP TABLE IF EXISTS users;

-- 清空表（保留结构，自增重置）
TRUNCATE TABLE users;
```


## SELECT 查询

### 基本查询

```sql
-- 查询所有列
SELECT * FROM users;

-- 查询指定列
SELECT id, username, email FROM users;

-- 别名
SELECT id AS user_id, username AS name FROM users;
SELECT username "用户名称" FROM users;

-- 去重
SELECT DISTINCT status FROM users;

-- 限制结果
SELECT * FROM users LIMIT 10;           -- 前10条
SELECT * FROM users LIMIT 5, 10;         -- 从第6条开始，取10条
SELECT * FROM users ORDER BY id DESC LIMIT 10;  -- 最新10条
```


### 条件查询

```sql
-- WHERE 子句
SELECT * FROM users WHERE status = 1;
SELECT * FROM users WHERE age >= 18 AND age <= 30;
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE status IN (1, 2, 3);
SELECT * FROM users WHERE age IS NULL;

-- 常用比较运算符
=        -- 等于
<> 或 != -- 不等于
> < >= <= -- 大小比较
BETWEEN  -- 范围（两端包含）
LIKE     -- 模式匹配
IN       -- 在列表中
IS NULL  -- 为空
```


### 排序与分页

```sql
-- 排序（默认升序 ASC）
SELECT * FROM users ORDER BY created_at DESC;           -- 降序
SELECT * FROM users ORDER BY status ASC, id DESC;       -- 多字段排序

-- 分页
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 第3页，每页10条
-- 公式：(page-1) * page_size
```


### 聚合函数

```sql
-- COUNT - 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE status = 1;

-- SUM - 求和
SELECT SUM(age) FROM users;

-- AVG - 平均值
SELECT AVG(age) FROM users WHERE status = 1;

-- MAX/MIN - 最大/最小值
SELECT MAX(age), MIN(age) FROM users;

-- GROUP_CONCAT - 分组拼接
SELECT status, GROUP_CONCAT(username) FROM users GROUP BY status;
```


### 分组查询

```sql
-- GROUP BY
SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- HAVING（过滤分组，WHERE 不能用于聚合）
SELECT status, COUNT(*) as count 
FROM users 
GROUP BY status 
HAVING count > 10;

-- 同时使用 WHERE 和 HAVING
SELECT status, AVG(age) as avg_age
FROM users
WHERE status = 1
GROUP BY status
HAVING avg_age > 25;
```


### 多表查询

```sql
-- 内连接（INNER JOIN）
SELECT u.username, o.order_id, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 等效写法
SELECT u.username, o.order_id
FROM users u, orders o
WHERE u.id = o.user_id;

-- 左连接（LEFT JOIN）
SELECT u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
-- 即使没有订单，用户也会显示

-- 右连接（RIGHT JOIN）
SELECT u.username, o.order_id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- 子查询
SELECT * FROM users 
WHERE age > (SELECT AVG(age) FROM users);

-- IN 子查询
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total > 1000);
```


### UNION 联合

```sql
-- 合并多个查询结果（自动去重）
SELECT username FROM users WHERE status = 1
UNION
SELECT username FROM admin_users;

-- UNION ALL 不去重，效率更高
SELECT username FROM users
UNION ALL
SELECT username FROM admin_users;
```


## INSERT 插入

### 单条插入

```sql
-- 指定列插入
INSERT INTO users (username, email, password_hash, age)
VALUES ('john', 'john@example.com', 'hash123', 25);

-- 全列插入
INSERT INTO users VALUES (NULL, 'jane', 'jane@example.com', 'hash456', 30, 1, NOW(), NOW());

-- 使用 DEFAULT
INSERT INTO users (username, email, password_hash) 
VALUES ('bob', 'bob@example.com', 'hash789');
```


### 批量插入

```sql
-- 方式1
INSERT INTO users (username, email, password_hash, age) VALUES
('user1', 'user1@example.com', 'hash1', 20),
('user2', 'user2@example.com', 'hash2', 21),
('user3', 'user3@example.com', 'hash3', 22);

-- 方式2
INSERT INTO users SET 
username = 'alice',
email = 'alice@example.com',
password_hash = 'hash',
age = 28;
```


### 查询结果插入

```sql
-- 从其他表复制
INSERT INTO users_backup (username, email)
SELECT username, email FROM users WHERE status = 1;
```


## UPDATE 更新

### 基本更新

```sql
-- 更新单列
UPDATE users SET age = 30 WHERE id = 1;

-- 更新多列
UPDATE users 
SET age = 30, email = 'new@example.com'
WHERE id = 1;

-- 使用表达式
UPDATE users SET age = age + 1 WHERE status = 1;

-- 更新时注意：务必加 WHERE，否则更新所有行！
UPDATE users SET status = 0;  -- 危险！所有用户都被禁用
```


### 条件更新

```sql
-- 按条件更新
UPDATE users SET age = age + 10 WHERE age < 18;

-- 多表更新
UPDATE orders o
INNER JOIN users u ON o.user_id = u.id
SET o.total = o.total * 0.9
WHERE u.status = 1;

-- 基于子查询更新
UPDATE users 
SET age = (
    SELECT AVG(age) FROM users WHERE status = 1
)
WHERE status = 2;
```


## DELETE 删除

### 基本删除

```sql
-- 删除单行
DELETE FROM users WHERE id = 1;

-- 删除多行
DELETE FROM users WHERE status = 0 AND created_at < '2024-01-01';

-- 删除全部（慎重！）
DELETE FROM users;  -- 逐行删除，记录日志，可以回滚
TRUNCATE TABLE users;  -- 整表删除，效率高，不能回滚
```


### 级联删除

```sql
-- 删除订单时同时删除关联的订单详情
DELETE o, od FROM orders o
INNER JOIN order_details od ON o.id = od.order_id
WHERE o.user_id = 1;
```


## 其他重要语句

### 排序 ORDER BY

```sql
-- 升序 ASC（默认）
SELECT * FROM users ORDER BY age ASC;

-- 降序 DESC
SELECT * FROM users ORDER BY created_at DESC;

-- 多字段排序
SELECT * FROM users ORDER BY status ASC, age DESC;
```


### 模糊匹配 LIKE

```sql
-- % 匹配任意字符
SELECT * FROM users WHERE username LIKE 'j%';      -- 以j开头
SELECT * FROM users WHERE email LIKE '%@gmail.com'; -- gmail邮箱

-- _ 匹配单个字符
SELECT * FROM users WHERE username LIKE 'j_hn';  -- john, jahn 等

-- ESCAPE 转义
SELECT * FROM tags WHERE name LIKE '%100%%' ESCAPE '\\';
```


### 常用函数

```sql
-- 字符串函数
SELECT CONCAT(username, '-', email) FROM users;
SELECT UPPER(username), LOWER(email) FROM users;
SELECT LENGTH(username), CHAR_LENGTH(username) FROM users;
SELECT TRIM('  hello  '), SUBSTRING('hello', 1, 3);

-- 日期函数
SELECT NOW(), CURDATE(), CURTIME();
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM users;
SELECT DATE_ADD(created_at, INTERVAL 7 DAY) FROM users;
SELECT DATEDIFF(NOW(), created_at) FROM users;

-- 条件函数
SELECT IFNULL(age, 0) FROM users;
SELECT CASE status WHEN 1 THEN '正常' ELSE '禁用' END FROM users;
```


## 事务控制

```sql
-- 开启事务
START TRANSACTION;

-- 执行操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交
COMMIT;

-- 回滚
ROLLBACK;

-- 自动提交关闭
SET autocommit = 0;
```


[[返回 MySQL 首页|mysql/index]]

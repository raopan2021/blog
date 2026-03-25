---
title: Redis 缓存与数据类型
---

# Redis 缓存与数据类型

> Redis 是高性能的 KV 内存数据库，本节讲解 5 种基本数据类型、Jedis/Lettuce 客户端和 Spring Data Redis 集成

## 1. Redis 概述

Redis（Remote Dictionary Server）是一个开源的、基于内存的 NoSQL 数据库，支持多种数据结构，常用于缓存、Session 存储、消息队列、排行榜等场景。

### 核心特点

- **高性能**：基于内存，读写速度极快（QPS 可达 10万+）
- **多种数据结构**：String、Hash、List、Set、ZSet 等
- **持久化**：支持 RDB 和 AOF 两种持久化方式
- **高可用**：支持主从复制、哨兵、集群模式
- **原子操作**：每个操作都是原子的

### 应用场景

| 场景 | 使用的数据类型 |
|------|--------------|
| 缓存热点数据 | String |
| 存储用户信息 | Hash |
| 消息队列 | List |
| 标签/好友关系 | Set |
| 排行榜 | ZSet |
| 分布式锁 | String + Lua |

## 2. 数据类型详解

### 2.1 String（字符串）

最基础的数据类型，存储字符串、JSON、序列化对象等。

```bash
# 设置值
SET key value
SET name "张三"

# 设置值并指定过期时间（秒）
SET cache:user:1 "data" EX 3600

# 设置值仅当 key 不存在（SETNX）
SETNX lock "token"

# 获取值
GET name

# 批量操作
MSET key1 "v1" key2 "v2"
MGET key1 key2

# 数值操作（原子递增/递减）
SET count 0
INCR count        # count = 1
INCRBY count 5    # count = 6
DECR count        # count = 5

# 获取字符串长度
STRLEN name
```


Java 操作：

```java
// Jedis
Jedis jedis = new Jedis("localhost", 6379);
jedis.set("name", "张三");
String name = jedis.get("name");
jedis.incr("count");
jedis.close();

// Lettuce（Spring Data Redis 默认）
stringRedisTemplate.opsForValue().set("name", "张三");
String name = stringRedisTemplate.opsForValue().get("name");
stringRedisTemplate.opsForValue().increment("count");
```


### 2.2 Hash（哈希）

适合存储对象、字典等结构化数据，相当于 Java 的 `Map<String, Map<String, String>>`。

```bash
# 设置 Hash 字段
HSET user:1 name "张三" age "25" email "zhangsan@example.com"

# 获取单个字段
HGET user:1 name

# 获取所有字段和值
HGETALL user:1

# 获取所有字段名
HKEYS user:1

# 获取所有值
HVALS user:1

# 批量设置
HMSET user:2 name "李四" age "30"

# 判断字段是否存在
HEXISTS user:1 name

# 删除字段
HDEL user:1 email

# 数值操作
HINCRBY user:1 age 1   # age 增加 1
HINCRBYFLOAT user:1 score 0.5  # 浮点数增加
```


Java 操作：

```java
// Jedis
Map<String, String> user = new HashMap<>();
user.put("name", "张三");
user.put("age", "25");
jedis.hset("user:1", user);

Map<String, String> result = jedis.hgetAll("user:1");
String name = jedis.hget("user:1", "name");

// Lettuce
HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
hashOps.put("user:1", "name", "张三");
hashOps.put("user:1", "age", "25");

String name = hashOps.get("user:1", "name");
Map<String, String> all = hashOps.entries("user:1");
```


### 2.3 List（列表）

有序、可重复的列表，支持两端操作，相当于 Java 的 `LinkedList`。

```bash
# 从左侧插入（头插）
LPUSH list1 "A" "B"    # list1 = [B, A]

# 从右侧插入（尾插）
RPUSH list1 "C"         # list1 = [B, A, C]

# 获取范围元素
LRANGE list1 0 -1       # 获取所有元素

# 获取指定索引元素
LINDEX list1 0          # B

# 弹出左侧元素
LPOP list1              # 返回 B

# 弹出右侧元素
RPOP list1              # 返回 C

# 获取列表长度
LLEN list1

# 裁剪列表（保留指定范围）
LTRIM list1 0 1         # 只保留前2个元素

# 阻塞弹出（消息队列常用）
BLPOP list1 0            # 阻塞等待，直到有元素可弹
```


Java 操作：

```java
// Jedis
jedis.lpush("queue:tasks", "task1", "task2", "task3");
String task = jedis.rpop("queue:tasks"); // 先进先出

// BRPOP 阻塞版本
List<String> result = jedis.brpop(0, "queue:tasks"); // 0 表示无限等待

// Lettuce
ListOperations<String, String> listOps = redisTemplate.opsForList();
listOps.leftPush("queue:tasks", "task1");
listOps.rightPush("queue:tasks", "task2");
String task = listOps.rightPop("queue:tasks");
```


### 2.4 Set（集合）

无序、不重复的集合，适合去重、标签、好友关系等场景。

```bash
# 添加成员
SADD tags "java" "spring" "redis"

# 获取所有成员
SMEMBERS tags

# 判断是否在集合中
SISMEMBER tags "java"

# 获取集合大小
SCARD tags

# 随机获取一个或多个成员
SRANDMEMBER tags 2

# 弹出一个随机成员
SPOP tags

# 集合运算
SADD set1 "A" "B" "C"
SADD set2 "B" "C" "D"

SINTER set1 set2      # 交集：["B", "C"]
SUNION set1 set2      # 并集：["A", "B", "C", "D"]
SDIFF set1 set2       # 差集：["A"]（set1 有 set2 没有的）
SINTERSTORE result set1 set2  # 交集并存储到 result
```


Java 操作：

```java
// Jedis
jedis.sadd("tags", "java", "spring", "redis");
Set<String> tags = jedis.smembers("tags");
boolean exists = jedis.sismember("tags", "java");

// 交集
Set<String> common = jedis.sinter("tags", "other_tags");

// Lettuce
SetOperations<String, String> setOps = redisTemplate.opsForSet();
setOps.add("tags", "java", "spring", "redis");
Set<String> allTags = setOps.members("tags");
Boolean isMember = setOps.isMember("tags", "java");
```


### 2.5 ZSet（有序集合）

每个元素关联一个分数，按分数排序，适合排行榜等场景。

```bash
# 添加成员（带分数）
ZADD leaderboard 100 "张三" 90 "李四" 95 "王五"

# 获取排名（从 0 开始）
ZRANK leaderboard "张三"

# 获取逆序排名（分数高的排前面）
ZREVRANK leaderboard "张三"

# 获取分数
ZSCORE leaderboard "张三"

# 获取排名范围内的成员（逆序，分数从高到低）
ZREVRANGE leaderboard 0 9 WITHSCORES

# 获取分数范围内的成员
ZRANGEBYSCORE leaderboard 90 100

# 获取集合大小
ZCARD leaderboard

# 增加分数
ZINCRBY leaderboard 5 "李四"

# 删除成员
ZREM leaderboard "王五"
```


Java 操作：

```java
// Jedis
Map<String, Double> scores = new LinkedHashMap<>();
scores.put("张三", 100.0);
scores.put("李四", 90.0);
scores.put("王五", 95.0);
jedis.zadd("leaderboard", scores);

// 获取前10名（逆序）
Set<Tuple> top10 = jedis.zrevrangeWithScores("leaderboard", 0, 9);
for (Tuple t : top10) {
    System.out.println(t.getElement() + ": " + t.getScore());
}

// 获取用户排名
Long rank = jedis.zrevrank("leaderboard", "张三");
System.out.println("张三排名第: " + (rank + 1));

// Lettuce
ZSetOperations<String, String> zsetOps = redisTemplate.opsForZSet();
zsetOps.add("leaderboard", "张三", 100.0);
zsetOps.add("leaderboard", "李四", 90.0);

Set<ZSetOperations.TypedTuple<String>> top10 =
    zsetOps.reverseRangeWithScores("leaderboard", 0, 9);
```


## 3. 过期时间和 TTL

```bash
# 设置过期时间（秒）
EXPIRE key 3600

# 设置过期时间（毫秒）
PEXPIRE key 3600000

# 查看剩余生存时间（秒）
TTL key         # -1 表示永不过期，-2 表示不存在

# 查看剩余生存时间（毫秒）
PTTL key

# 设置具体过期时间点
EXPIREAT key 1735689600   # Unix 时间戳（秒）
PEXPIREAT key 1735689600000  # Unix 时间戳（毫秒）

# 移除过期时间（永不过期）
PERSIST key
```


## 4. Jedis 客户端

Jedis 是 Redis 的 Java 客户端之一，API 与 Redis 命令一一对应。

### 添加依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.0.0</version>
</dependency>
```


### 基本使用

```java
public class JedisDemo {

    public static void main(String[] args) {
        // 创建 Jedis 连接（单实例）
        Jedis jedis = new Jedis("localhost", 6379);
        jedis.auth("123456"); // 如果 Redis 设置了密码

        // 基本操作
        jedis.set("name", "张三");
        System.out.println(jedis.get("name"));

        // 数值操作（线程安全）
        jedis.incr("counter");
        System.out.println(jedis.get("counter"));

        // Hash 操作
        jedis.hset("user:1", "name", "张三");
        jedis.hset("user:1", "age", "25");
        System.out.println(jedis.hgetAll("user:1"));

        // 关闭连接
        jedis.close();
    }
}
```


### 连接池配置

```java
// 创建连接池配置
JedisPoolConfig config = new JedisPoolConfig();
config.setMaxTotal(20);          // 最大连接数
config.setMaxIdle(10);           // 最大空闲连接数
config.setMinIdle(5);            // 最小空闲连接数
config.setTestOnBorrow(true);    // 借出时检测连接是否可用

// 创建 Jedis 连接池
JedisPool jedisPool = new JedisPool(config, "localhost", 6379, 2000, "123456");

// 获取连接
try (Jedis jedis = jedisPool.getResource()) {
    jedis.set("pool:key", "pool:value");
    System.out.println(jedis.get("pool:key"));
}

// 关闭连接池
jedisPool.close();
```


## 5. Lettuce 客户端

Lettuce 是 Spring Data Redis 默认集成的客户端，支持同步、异步和响应式编程。

### 特点

- **线程安全**：基于 Netty 的连接池，多线程共享
- **异步支持**：支持异步和响应式操作
- **Spring 集成良好**：Spring Data Redis 默认使用

### Spring Boot 整合

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 123456
    database: 0
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 2
        max-wait: -1ms
```


```java
@Service
public class RedisService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate; // 操作 String 类型

    @Autowired
    private RedisTemplate<String, Object> redisTemplate; // 操作所有类型

    // String 操作
    public void setString(String key, String value) {
        stringRedisTemplate.opsForValue().set(key, value, Duration.ofHours(1));
    }

    public String getString(String key) {
        return stringRedisTemplate.opsForValue().get(key);
    }

    // Hash 操作
    public void setHash(String key, String field, String value) {
        stringRedisTemplate.opsForHash().put(key, field, value);
    }

    public Object getHash(String key, String field) {
        return stringRedisTemplate.opsForHash().get(key, field);
    }

    // ZSet 操作
    public void zadd(String key, String member, double score) {
        stringRedisTemplate.opsForZSet().add(key, member, score);
    }

    public Set<String> getTop(String key, int topN) {
        return stringRedisTemplate.opsForZSet().reverseRange(key, 0, topN - 1);
    }

    // 分布式锁
    public boolean tryLock(String key, String value, long expireTime) {
        return Boolean.TRUE.equals(
            stringRedisTemplate.opsForValue().setIfAbsent(key, value, Duration.ofSeconds(expireTime))
        );
    }

    public void unlock(String key, String value) {
        String currentValue = stringRedisTemplate.opsForValue().get(key);
        if (value.equals(currentValue)) {
            stringRedisTemplate.delete(key);
        }
    }
}
```


### RedisTemplate 序列化配置

默认使用 JDK 序列化，可自定义为 JSON 序列化：

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // 使用 Jackson 序列化 JSON
        Jackson2JsonRedisSerializer<Object> serializer =
            new Jackson2JsonRedisSerializer<>(Object.class);

        // String 的 key 用 String 序列化器
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Value 和 HashValue 用 JSON 序列化器
        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
```


## 6. 缓存应用实战

### 缓存穿透、击穿、雪崩

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String CACHE_KEY_PREFIX = "user:";
    private static final long CACHE_TTL = 30L; // 分钟

    public User getUserById(Long id) {
        String cacheKey = CACHE_KEY_PREFIX + id;

        // 1. 查缓存
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return JSON.parseObject(cached, User.class);
        }

        // 2. 缓存不存在，查数据库
        User user = userMapper.findById(id);

        // 3. 写入缓存（防止缓存穿透：即使是 null 也缓存，但时间短一些）
        if (user != null) {
            redisTemplate.opsForValue().set(
                cacheKey,
                JSON.toJSONString(user),
                Duration.ofMinutes(CACHE_TTL)
            );
        } else {
            // 缓存空值，防止穿透
            redisTemplate.opsForValue().set(
                cacheKey,
                "",
                Duration.ofMinutes(5)
            );
        }

        return user;
    }

    // 更新时删除缓存（Cache Aside 模式）
    @Transactional
    public void updateUser(User user) {
        userMapper.update(user);
        // 删除缓存，下次查询重新加载
        redisTemplate.delete(CACHE_KEY_PREFIX + user.getId());
    }
}
```


## 总结

Redis 的 5 种核心数据类型（String、Hash、List、Set、ZSet）各司其职。Jedis 简单直接，Lettuce 作为 Spring Data Redis 的默认客户端，集成度更高，支持连接池和多种序列化方式。实际使用中要注意 **缓存穿透**、**缓存击穿**、**缓存雪崩** 问题，并采用合适的缓存策略（Cache Aside、Read Through 等）。

[[返回 Java 首页|../index]]

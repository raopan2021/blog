# Java 学习笔记

> 本章节记录 Java 基础知识，从环境搭建到 Spring Boot 框架

## 📚 目录导航

### 环境配置
- [JDK 安装与环境变量](./jdk与环境变量) - Java 开发环境配置
- [IDEA 与配置](./idea) - IntelliJ IDEA 使用技巧

### 构建工具
- [Maven](./maven) - Java 项目构建与依赖管理

### Web 框架
- [Spring Boot](./SpringBoot) - 快速构建 Spring 应用

## 🔗 相关资源

- [Java 官方文档](https://docs.oracle.com/javase/)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [Maven 仓库](https://mvnrepository.com/)

## Java 特点

- **面向对象**：一切皆对象
- **跨平台**：JVM 实现一次编写，到处运行
- **自动内存管理**：垃圾回收机制
- **强类型**：类型安全
- **多线程**：内置多线程支持

## Java 发展历程

| 版本 | 年份 | 新特性 |
|------|------|--------|
| Java 8 | 2014 | Lambda 表达式、Stream API |
| Java 11 | 2018 | 局部变量类型推断、HTTP Client |
| Java 17 | 2021 | Sealed Classes、Pattern Matching |
| Java 21 | 2023 | Virtual Threads、Record Patterns |

## 常用命令

```bash
# 编译
javac HelloWorld.java

# 运行
java HelloWorld

# 查看版本
java -version

# 打包
jar -cvf myapp.jar -C out/ .
```


## 数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| int | 整数 | `int a = 10` |
| long | 长整数 | `long b = 100L` |
| double | 双精度浮点 | `double c = 3.14` |
| boolean | 布尔值 | `boolean flag = true` |
| char | 字符 | `char c = 'A'` |
| String | 字符串 | `String s = "Hello"` |

## 常用集合

```java
// List - 有序可重复
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");

// Set - 无序不可重复
Set<Integer> set = new HashSet<>();
set.add(1);
set.add(2);

// Map - 键值对
Map<String, Integer> map = new HashMap<>();
map.put("Java", 1);
map.put("Python", 2);
```


## 常用框架

### Spring Boot 快速入门

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Java!";
    }
}
```


## 推荐的 Java 学习路线

1. **Java SE**：语法、面向对象、集合、IO、多线程
2. **数据库**：MySQL + JDBC
3. **Web 基础**：Servlet + JSP + Tomcat
4. **主流框架**：Spring + Spring MVC + MyBatis
5. **Spring Boot**：现代 Java 开发标配
6. **微服务**：Spring Cloud + Docker

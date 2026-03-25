---
title: Spring 框架入门
---

# Spring 框架入门

> Spring 是 Java 企业级应用开发的核心框架，本节介绍 IoC/DI 容器、Bean 配置和注解驱动开发

## 1. Spring 概述

Spring 是一个轻量级的 Java 开发框架，核心提供 **IoC（控制反转）** 和 **AOP（面向切面编程）** 能力。通过依赖注入，Spring 可以在运行时动态组装 bean，减少组件间的耦合。

### 核心模块

| 模块 | 说明 |
|------|------|
| Spring Core | IoC 容器和 DI 核心 |
| Spring Context | 应用程序上下文 |
| Spring Beans | Bean 定义和管理 |
| Spring AOP | 面向切面编程 |
| Spring JDBC | JDBC 抽象层 |
| Spring Web | Web 应用支持 |

## 2. IoC 与 DI 概念

### 什么是 IoC

**IoC（Inversion of Control，控制反转）** 是面向对象设计的一种原则。将对象的创建和管理权从应用代码转移到框架容器，程序被动等待容器注入所需依赖。

### 什么是 DI

**DI（Dependency Injection，依赖注入）** 是 IoC 的一种实现方式。容器在创建对象时，自动将依赖的其他对象通过构造函数、Setter 方法或字段注入进来。

```java
// 传统方式：对象自己创建依赖
public class UserService {
    private UserDao userDao = new UserDaoImpl(); // 强耦合
}

// Spring 方式：由容器注入依赖
public class UserService {
    private UserDao userDao; // 声明接口，具体实现由容器注入

    // 构造器注入（推荐方式）
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}
```

## 3. 第一个 Spring 程序

### 添加 Maven 依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.1.0</version>
</dependency>
```

### 定义 Bean 接口与实现

```java
// UserDao 接口
public interface UserDao {
    void save(User user);
    User findById(Long id);
}

// UserDao 实现类
public class UserDaoImpl implements UserDao {
    @Override
    public void save(User user) {
        System.out.println("保存用户: " + user.getName());
    }

    @Override
    public User findById(Long id) {
        return new User(id, "张三", 25);
    }
}
```

### 使用 XML 配置 Bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 注册 UserDao 实现类为 Bean -->
    <bean id="userDao" class="com.example.dao.UserDaoImpl"/>

    <!-- 注册 UserService，注入 userDao 依赖 -->
    <bean id="userService" class="com.example.service.UserService">
        <!-- 构造器注入：通过 index 指定参数位置 -->
        <constructor-arg index="0" ref="userDao"/>
    </bean>

</beans>
```

### 编写测试类

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringTest {
    public static void main(String[] args) {
        // 加载 Spring 配置文件，创建 IoC 容器
        ApplicationContext context =
            new ClassPathXmlApplicationContext("applicationContext.xml");

        // 从容器中获取 Bean（通过类型或 id）
        UserService userService = context.getBean("userService", UserService.class);

        // 调用业务方法
        User user = new User(1L, "张三", 25);
        userService.save(user);
        User found = userService.findById(1L);
        System.out.println("查询结果: " + found.getName());
    }
}
```

## 4. Bean 的配置方式

### 4.1 构造器注入

```xml
<!-- 方式1：通过 index 指定参数位置 -->
<bean id="userService" class="com.example.service.UserService">
    <constructor-arg index="0" ref="userDao"/>
    <constructor-arg index="1" value="默认名称"/>
</bean>

<!-- 方式2：通过参数类型匹配 -->
<bean id="userService" class="com.example.service.UserService">
    <constructor-arg type="com.example.dao.UserDao" ref="userDao"/>
    <constructor-arg type="java.lang.String" value="默认名称"/>
</bean>
```

### 4.2 Setter 注入

```xml
<bean id="userService" class="com.example.service.UserService">
    <!-- setter 注入：Spring 会调用 setUserDao() 方法 -->
    <property name="userDao" ref="userDao"/>
    <property name="name" value="默认名称"/>
</bean>
```

### 4.3 构造器 vs Setter 注入

| 特性 | 构造器注入 | Setter 注入 |
|------|-----------|-------------|
| 必要性 | 适合强制依赖 | 适合可选依赖 |
| 线程安全 | 不可变对象 | 可修改 |
| 测试友好 | 需要传所有参数 | 可部分 mock |
| 循环依赖 | 可能有问题 | 支持延迟加载 |

## 5. 注解驱动开发

注解方式可以大幅减少 XML 配置，是目前主流的开发方式。

### 5.1 开启注解扫描

```xml
<!-- 启用组件扫描，base-package 指定扫描的包路径 -->
<context:component-scan base-package="com.example"/>
```

或在 Java 配置类中：

```java
@Configuration
@ComponentScan("com.example") // 扫描 com.example 包
public class AppConfig {
}
```

### 5.2 常用注解

#### Bean 注册注解

```java
@Repository("userDao")        // DAO 层 Bean（别名）
@Service                      // Service 层 Bean，name 默认小写开头
@Controller                   // Web 层 Bean
@Component                    // 通用组件标注
@Configuration                // 配置类，等价于 <beans>
```

```java
// 示例：Service 层
@Service
public class UserServiceImpl implements UserService {

    // 自动注入，优先按类型匹配
    @Autowired
    private UserDao userDao;

    @Override
    public void save(User user) {
        userDao.save(user);
    }
}
```

#### 依赖注入注解

```java
@Autowired                  // Spring 提供的注入注解（按类型）
@Resource(name="xxx")       // JDK 提供的注入（按名称）
@Qualifier("xxx")          // 指定注入哪个 Bean（配合 @Autowired 使用）
@Value("${属性名}")         // 注入配置文件中的值
```

```java
@Service
public class UserServiceImpl implements UserService {

    // 按类型注入，如果同类型有多个 Bean，需要配合 @Qualifier
    @Autowired
    @Qualifier("userDaoImpl")
    private UserDao userDao;

    // 注入配置文件的值
    @Value("${app.name:默认名称}")
    private String appName;
}
```

#### Java 配置类方式

完全不使用 XML，用 `@Configuration` 和 `@Bean`：

```java
@Configuration
public class AppConfig {

    // 等价于 <bean id="userDao" class="..."/>
    @Bean
    public UserDao userDao() {
        return new UserDaoImpl();
    }

    @Bean
    public UserService userService() {
        // 手动调用方法完成注入
        return new UserServiceImpl(userDao());
    }
}
```

### 5.3 完整注解示例

```java
// UserDao.java
@Repository
public class UserDaoImpl implements UserDao {
    @Override
    public void save(User user) {
        System.out.println("UserDao: 保存 " + user.getName());
    }
}

// UserService.java
@Service
public class UserServiceImpl {
    @Autowired
    private UserDao userDao;

    public void saveUser(User user) {
        userDao.save(user);
    }
}

// 配置类
@Configuration
@ComponentScan("com.example")
public class AppConfig {
}

// 测试
public class Test {
    public static void main(String[] args) {
        ApplicationContext context =
            new AnnotationConfigApplicationContext(AppConfig.class);
        UserService service = context.getBean(UserServiceImpl.class);
        service.saveUser(new User(1L, "张三", 20));
    }
}
```

## 6. Bean 的作用域与生命周期

### 作用域

| 作用域 | 说明 |
|--------|------|
| singleton（默认） | 整个容器只有一个实例 |
| prototype | 每次获取创建新实例 |
| request | 每次 HTTP 请求创建新实例 |
| session | 每次 HTTP 会话创建新实例 |

```java
@Service
@Scope("prototype") // 每次注入创建新对象
public class UserService {
}
```

### 生命周期回调

```java
@Service
public class UserService {

    // 构造器之后调用
    @PostConstruct
    public void init() {
        System.out.println("UserService 初始化");
    }

    // 容器关闭前调用
    @PreDestroy
    public void destroy() {
        System.out.println("UserService 销毁");
    }
}
```

## 7. 外部配置文件

将数据库配置等抽离到 properties 文件：

```properties
# jdbc.properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/test
jdbc.username=root
jdbc.password=123456
```

```xml
<!-- 引入外部配置文件 -->
<context:property-placeholder location="classpath:jdbc.properties"/>

<bean id="dataSource" class="com.example.DataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
</bean>
```

## 8. Spring 整合 JUnit 测试

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>6.1.0</version>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
</dependency>
```

```java
@SpringJUnitConfig(AppConfig.class) // 启动 Spring 容器
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void testSave() {
        userService.saveUser(new User(1L, "测试", 20));
    }
}
```

## 总结

Spring 的核心是 **IoC 容器**，通过 **DI（依赖注入）** 将对象间的依赖关系解耦。开发方式从 XML 配置演进到注解驱动，再到全 Java 配置（`@Configuration`），越来越简洁。掌握构造器注入、`@Autowired`、`@Service`/`@Repository` 等核心注解，是熟练使用 Spring 的基础。

[[返回 Java 首页|../index]]

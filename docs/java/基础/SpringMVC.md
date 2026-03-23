---
title: SpringMVC 框架详解
---

# SpringMVC 框架详解

> SpringMVC 是 Spring 提供的 Web 层框架，本节详细讲解请求处理流程、核心注解、参数绑定和视图解析

## 1. SpringMVC 概述

SpringMVC 是 Spring 框架的 Web 模块，基于 Servlet API 构建，遵循 MVC（Model-View-Controller）设计模式。它将请求 URL 映射到具体的处理方法，实现了请求与视图的解耦。

### 核心组件

| 组件 | 说明 |
|------|------|
| DispatcherServlet | 前端控制器，所有请求的入口 |
| HandlerMapping | 映射请求 URL 到具体的 Controller 方法 |
| HandlerAdapter | 执行 Controller 方法的适配器 |
| ViewResolver | 视图解析器，将逻辑视图名解析为具体视图 |
| View | 渲染视图，输出 HTML 等内容 |

## 2. 请求处理流程

### 完整流程图

```
浏览器请求
    │
    ▼
┌─────────────────────────┐
│   DispatcherServlet      │ ← 前端控制器（中央调度）
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   HandlerMapping         │ → 根据 URL 找到 Handler（Controller方法）
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   HandlerAdapter         │ → 执行 Handler，返回 ModelAndView
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   ViewResolver           │ → 解析视图名，得到具体 View 对象
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   View                   │ → 渲染视图，输出响应
└────────────┬────────────┘
             │
             ▼
浏览器响应
```

### 具体步骤

1. **请求拦截**：浏览器发送请求到 `DispatcherServlet`
2. **查找 Handler**：`HandlerMapping` 根据 URL 找到对应的 `Handler`（Controller 方法）
3. **执行 Handler**：`HandlerAdapter` 调用 `Handler` 方法，获取 `ModelAndView`
4. **视图解析**：`ViewResolver` 将逻辑视图名解析为具体的 `View` 对象
5. **渲染视图**：`View` 使用模型数据渲染 HTML，输出响应

## 3. 第一个 SpringMVC 程序

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>6.1.0</version>
</dependency>
```

### 配置 DispatcherServlet

```xml
<!-- web.xml -->
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!-- 加载 SpringMVC 配置文件 -->
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <!-- 拦截所有请求（除了 .jsp） -->
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

### SpringMVC 配置文件

```xml
<!-- springmvc.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="...">

    <!-- 开启组件扫描 -->
    <context:component-scan base-package="com.example.controller"/>

    <!-- 开启 SpringMVC 注解支持 -->
    <mvc:annotation-driven/>

    <!-- 视图解析器：前缀 + 逻辑视图名 + 后缀 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

</beans>
```

### 编写 Controller

```java
@Controller
@RequestMapping("/user")
public class UserController {

    // 处理 /user/hello 的 GET 请求
    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("message", "Hello, SpringMVC!");
        return "hello"; // 逻辑视图名 → /WEB-INF/views/hello.jsp
    }

    // 处理 /user/detail?id=1 的 GET 请求
    @GetMapping("/detail")
    public String detail(Model model, @RequestParam("id") Long userId) {
        model.addAttribute("userId", userId);
        return "userDetail";
    }
}
```

## 4. 核心注解详解

### 4.1 请求映射注解

```java
@Controller
@RequestMapping("/api") // 类上标注：所有方法的 URL 前缀
public class ApiController {

    // 精确匹配
    @RequestMapping("/hello")
    public String hello() { return "hello"; }

    // HTTP 方法限定
    @RequestMapping(value="/save", method=RequestMethod.POST)
    public String save() { return "success"; }

    // 简写方式
    @GetMapping("/list")     // 等价于 @RequestMapping(method=GET)
    @PostMapping("/create")  // 等价于 @RequestMapping(method=POST)
    @PutMapping("/update")
    @DeleteMapping("/delete")
}
```

### 4.2 获取请求参数

```java
@Controller
@RequestMapping("/user")
public class UserController {

    // 1. 直接写参数名：自动匹配同名的请求参数
    @GetMapping("/detail")
    public String detail(Long id, String name) {
        System.out.println("id=" + id + ", name=" + name);
        return "user";
    }

    // 2. @RequestParam：指定参数名，适用于参数名不一致或必填控制
    @GetMapping("/search")
    public String search(
            @RequestParam(name="keyword", required=false, defaultValue="") String kw,
            @RequestParam(value="page", defaultValue="1") int page) {
        System.out.println("搜索: " + kw + ", 第" + page + "页");
        return "search";
    }

    // 3. @PathVariable：获取 URL 路径中的变量（RESTful 风格）
    @GetMapping("/user/{id}/detail/{type}")
    public String userDetail(
            @PathVariable("id") Long id,
            @PathVariable("type") String type) {
        System.out.println("用户ID: " + id + ", 类型: " + type);
        return "userDetail";
    }

    // 4. @RequestHeader：获取请求头
    public String headerTest(
            @RequestHeader("User-Agent") String userAgent,
            @RequestHeader(value="Authorization", required=false) String token) {
        System.out.println("浏览器: " + userAgent);
        return "test";
    }

    // 5. @CookieValue：获取 Cookie
    public String cookieTest(
            @CookieValue(value="JSESSIONID", required=false) String sessionId) {
        System.out.println("SessionID: " + sessionId);
        return "test";
    }

    // 6. @RequestBody：接收 JSON 请求体（需要 Jackson 依赖）
    @PostMapping("/create")
    public String create(@RequestBody User user) {
        System.out.println("接收用户: " + user.getName());
        return "success";
    }
}
```

### 4.3 处理响应

```java
@Controller
@RequestMapping("/user")
public class UserController {

    // 1. 返回逻辑视图名（用于 JSP 等模板渲染）
    @GetMapping("/list")
    public String list(Model model) {
        List<User> users = userService.list();
        model.addAttribute("users", users);
        return "userList"; // → /WEB-INF/views/userList.jsp
    }

    // 2. @ResponseBody：直接返回数据（JSON/XML），不走视图解析
    @GetMapping("/json/{id}")
    @ResponseBody
    public User getUserJson(@PathVariable Long id) {
        return userService.getById(id); // 直接序列化为 JSON
    }

    // 3. 返回 Map 或 List：自动序列化为 JSON
    @GetMapping("/all")
    @ResponseBody
    public List<User> getAllUsers() {
        return userService.list();
    }

    // 4. @RestController：等价于 @Controller + @ResponseBody，方法默认返回 JSON
    // （如果类标注了 @RestController，则类中所有方法都默认返回 JSON）
}
```

## 5. 参数绑定（核心）

参数绑定是将 HTTP 请求参数自动转换为 Java 方法参数的过程。

### 5.1 简单类型绑定

```java
// 请求: /user/detail?id=1&name=张三&age=25
@GetMapping("/detail")
public String detail(Long id, String name, Integer age) {
    // Spring 自动完成类型转换
    System.out.println(id + "-" + name + "-" + age);
    return "detail";
}
```

### 5.2 POJO 对象绑定

```java
// User 类（必须有 get/set 方法）
public class User {
    private Long id;
    private String name;
    private Integer age;
    // getters and setters...
}

// 请求: /user/save?id=1&name=张三&age=25
// Spring 会自动创建一个 User 对象，并填充属性
@PostMapping("/save")
public String save(User user) {
    userService.save(user);
    return "success";
}
```

### 5.3 嵌套 POJO 绑定

```java
public class Order {
    private Long orderId;
    private User user; // 嵌套对象
    // getters and setters...
}

// 请求: /order/save?orderId=100&user.id=1&user.name=张三
@PostMapping("/save")
public String save(Order order) {
    System.out.println(order.getOrderId() + ", " + order.getUser().getName());
    return "success";
}
```

### 5.4 数组和集合绑定

```java
// 请求: /user/delete?ids=1&ids=2&ids=3
@PostMapping("/delete")
public String delete(Long[] ids) {
    for (Long id : ids) {
        userService.delete(id);
    }
    return "success";
}

// 请求: /user/batch?users[0].id=1&users[0].name=张三&users[1].id=2...
@PostMapping("/batch")
public String batch(@RequestParam("users") List<User> users) {
    userService.saveBatch(users);
    return "success";
}
```

### 5.5 自定义类型转换

```java
// 定义转换器：String → Date
@Component
public class StringToDateConverter implements Converter<String, Date> {
    private final DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public Date convert(String source) {
        try {
            return df.parse(source);
        } catch (ParseException e) {
            throw new IllegalArgumentException("日期格式错误");
        }
    }
}

// 注册转换器（在配置类或 XML 中）
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToDateConverter());
    }
}
```

## 6. 视图解析

### 6.1 JSP 视图解析

```java
// 配置了 InternalResourceViewResolver 后
@GetMapping("/list")
public String list(Model model) {
    model.addAttribute("users", userService.list());
    return "userList"; // 前缀 + "userList" + 后缀 = /WEB-INF/views/userList.jsp
}
```

### 6.2 重定向与转发

```java
@Controller
public class UserController {

    // forward: 转发，不改变 URL（共享 request）
    @GetMapping("/old")
    public String oldUrl() {
        return "forward:/user/list"; // 转发到 /user/list
    }

    // redirect: 重定向，改变 URL（新 request）
    @PostMapping("/save")
    public String save(User user) {
        userService.save(user);
        return "redirect:/user/list"; // 重定向到列表页
    }

    // 重定向带参数
    @GetMapping("/delete")
    public String delete(Long id) {
        userService.delete(id);
        return "redirect:/user/list?success=true";
    }
}
```

### 6.3 RESTful 风格

```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {

    // GET /api/users        - 查询所有
    @GetMapping
    public List<User> list() { return userService.list(); }

    // GET /api/users/{id}  - 查询单个
    @GetMapping("/{id}")
    public User get(@PathVariable Long id) { return userService.getById(id); }

    // POST /api/users      - 新增
    @PostMapping
    public Result<Void> create(@RequestBody User user) {
        userService.save(user);
        return Result.success();
    }

    // PUT /api/users/{id}  - 修改
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.update(user);
        return Result.success();
    }

    // DELETE /api/users/{id} - 删除
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

## 7. 数据共享

| 方式 | 作用域 | 说明 |
|------|--------|------|
| Model / ModelMap | request | 返回视图时传递数据 |
| HttpServletRequest | request | 原始方式 |
| @SessionAttributes | session | 将 Model 中的属性同步到 session |
| @ModelAttribute | request | 方法提前执行，结果存入 Model |
| HttpSession | session | 原始方式 |

```java
@Controller
@RequestMapping("/user")
@SessionAttributes({"user", "token"}) // 将 user、token 存入 session
public class UserController {

    @ModelAttribute // 所有方法执行前先运行此方法
    public void loadCommonData(Model model) {
        model.addAttribute("appName", "用户管理系统");
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        model.addAttribute("user", currentUser());
        return "profile";
    }
}
```

## 8. 异常处理

### 8.1 全局异常处理器

```java
@ControllerAdvice // 控制器增强（所有 @Controller 都会受此影响）
public class GlobalExceptionHandler {

    // 处理特定异常
    @ExceptionHandler(ArithmeticException.class)
    public String handleArith(Exception e, Model model) {
        model.addAttribute("error", "算术错误: " + e.getMessage());
        return "error";
    }

    // 处理业务异常
    @ExceptionHandler(BusinessException.class)
    @ResponseBody // AJAX 请求返回 JSON
    public Result<Void> handleBusiness(BusinessException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }

    // 通用异常处理（兜底）
    @ExceptionHandler(Exception.class)
    public String handleGeneral(Exception e, Model model) {
        model.addAttribute("error", "系统错误，请稍后重试");
        // 记录日志...
        return "error";
    }
}
```

## 总结

SpringMVC 的核心是 **DispatcherServlet** 调度下的请求处理流程：URL 映射 → 参数绑定 → 业务处理 → 视图解析。核心注解包括 `@RequestMapping` 系列、`@RequestParam`、`@PathVariable`、`@RequestBody`、`@ResponseBody`。掌握 RESTful 风格接口设计和全局异常处理，是构建规范 Web API 的关键。

[[返回 Java 首页|../index]]

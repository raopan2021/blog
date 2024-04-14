# SpringBoot快速入门

## SpringBoot特点

- 遵循“约定优于配置”的原则，只需要很少的配置或使用默认的配置。
- 能够使用内嵌的Tomcat、Jetty服务器，不需要部署war文件。
- 提供定制化的启动器Starters，简化Maven配置，开箱即用。
- 纯Java配置，没有代码生成，也不需要XML配置。
- 提供了生产级的服务监控方案，如安全监控、应用监控、健康检测等。

## 开发环境热部署

- 在实际的项目开发调试过程中会频繁地修改后台类文件，导致需要重新编译、重新启动，整个过程非常麻烦，影响开发效率。
- Spring Boot提供了spring-boot-devtools组件，使得无须手动重启Spring Boot应用即可重新编译、启动项目，大大缩短编译启动的时间。
- devtools会监听classpath下的文件变动，触发Restart类加载器重新加载该类，从而实现类文件和属性文件的热部署。
- 并不是所有的更改都需要重启应用（如静态资源、视图模板），可以通过设置spring.devtools.restart.exclude属性来指定一些文件或目录的修改不用重启应用

1、在pom.xml配置文件中添加dev-tools依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

使用optional=true表示依赖不会传递，即该项目依赖devtools；其他项目如果引入此项目生成的JAR包，则不会包含devtools

2、在application.properties中配置devtools。

```properties
#热部署生效
spring.devtools.restart.enabled=true
#设置重启的目录
spring.devtools.restart.additional-paths=src/main/java
#classpath目录下的WEB-INF文件夹内容修改不重启
#spring.mvc.static-path-pattern=/static/**
```

3、最后

- 如果使用了Eclipse，那么在修改完代码并保存之后，项目将自动编译并触发重启，而如果使用了IntelliJ IDEA，还需要配置项目自动编译。
- 打开Settings页面，在左边的菜单栏依次找到Build,Execution,Deployment→Compile，勾选Build project automatically
- 按Ctrl+Shift+Alt+/快捷键调出Maintenance页面，单击Registry，勾选compiler.automake.allow.when.app.running复选框。
- 做完这两步配置之后，若开发者再次在IntelliJ IDEA中修改代码，则项目会自动重启。

## 文件上传大小限制

在配置文件（如application.properties）中加入两个配置

```properties
#文件上传大小限制
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## Swagger

添加 依赖

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

Spring Boot 2.6.X后与Swagger有版本冲突问题，需要在application.properties中加入以下配置：

```properties
spring.mvc.pathmatch.matching-strategy=ant path_matcher
```

启动项目访问 `http://127.0.0.1:8080/swagger-ui.html` ，即可打开自动生成的可视化测试页面

## MyBatis-Plus

- MyBatis是一款优秀的数据持久层ORM框架，被广泛地应用于应用系统。
- MyBatis能够非常灵活地实现动态SQL，可以使用XML或注解来配置和映射原生信息，能够轻松地将Java的POJO（Plain Ordinary Java Object，普通的Java对象）与数据库中的表和字段进行映射关联。
- MyBatis-Plus是一个 MyBatis 的增强工具，在 MyBatis 的基础上做了增强，简化了开发。

添加 依赖

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.20</version>
</dependency>
```

配置数据库相关信息

```properties
spring.datasource.type=com.alibaba.druid.pool.DruidDatasource
spring.datasource.driver-class-name=com.mysgl.jdbc.Driver
spring.datasource.url=jdbc:mysql://1ocalhost:3306/mydb?useSSL=false
spring.datasource.username=root
spring.datasource.password=root
mybatis-plus.configuration,1og-impl=org.apache.ibatis.logging.stdout.stdOutImpl
```

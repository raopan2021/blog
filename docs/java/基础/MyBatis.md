---
title: MyBatis 持久层框架
---

# MyBatis 持久层框架

> MyBatis 是优秀的持久层框架，本节讲解 CRUD 操作、映射文件配置和动态 SQL

## 1. MyBatis 概述

MyBatis 是一个半自动的 ORM（Object Relational Mapping）框架。与 Hibernate 的全自动化不同，MyBatis 需要手写 SQL，但提供了灵活的映射能力和动态 SQL 支持。

### 核心特性

- **半自动映射**：手动编写 SQL，更灵活
- **动态 SQL**：条件拼接更方便
- **逆向工程**：可根据数据库表自动生成实体类和 Mapper
- **延迟加载**：按需加载关联对象
- **缓存支持**：一级缓存、二级缓存

### 添加依赖

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.15</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

## 2. 第一个 MyBatis 程序

### 配置文件 mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 环境配置：可以配置多个环境（如 dev、test、prod）-->
    <environments default="development">
        <environment id="development">
            <!-- 事务管理：JDBC 类型 -->
            <transactionManager type="JDBC"/>
            <!-- 数据源：连接池管理 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/testdb?useSSL=false&amp;serverTimezone=Asia/Shanghai"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 映射文件路径 -->
    <mappers>
        <mapper resource="com/example/mapper/UserMapper.xml"/>
    </mappers>

</configuration>
```

### 实体类

```java
public class User {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private LocalDateTime createTime;

    // 无参构造（MyBatis 需要）
    public User() {}

    // 有参构造
    public User(Long id, String name, String email, Integer age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "', age=" + age + '}';
    }
}
```

### Mapper 接口

```java
public interface UserMapper {

    // 查询所有用户
    List<User> findAll();

    // 根据 ID 查询用户
    User findById(Long id);

    // 插入用户
    int insert(User user);

    // 更新用户
    int update(User user);

    // 删除用户
    int delete(Long id);

    // 模糊查询
    List<User> searchByName(String keyword);
}
```

### 映射文件 UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- namespace: 指向 Mapper 接口的全限定名 -->
<mapper namespace="com.example.mapper.UserMapper">

    <!--
        id: 对应接口中的方法名
        resultType: 返回值类型（如果返回集合，写集合内元素类型）
    -->
    <select id="findAll" resultType="com.example.entity.User">
        SELECT id, name, email, age, create_time AS createTime
        FROM tb_user
        ORDER BY id DESC
    </select>

    <!-- parameterType: 参数类型（简单类型可省略） -->
    <select id="findById" resultType="com.example.entity.User">
        SELECT id, name, email, age, create_time AS createTime
        FROM tb_user
        WHERE id = #{id}
    </select>

    <!-- useGeneratedKeys: 启用自增主键；keyProperty: 主键映射到哪个属性 -->
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO tb_user (name, email, age, create_time)
        VALUES (#{name}, #{email}, #{age}, NOW())
    </insert>

    <update id="update">
        UPDATE tb_user
        SET name = #{name},
            email = #{email},
            age = #{age}
        WHERE id = #{id}
    </update>

    <delete id="delete">
        DELETE FROM tb_user WHERE id = #{id}
    </delete>

    <!-- 模糊查询：#{value} 自动加引号，${value} 直接拼接（有 SQL 注入风险） -->
    <select id="searchByName" resultType="com.example.entity.User">
        SELECT id, name, email, age, create_time AS createTime
        FROM tb_user
        WHERE name LIKE CONCAT('%', #{value}, '%')
    </select>

</mapper>
```

### 测试代码

```java
public class MyBatisTest {

    private SqlSessionFactory sqlSessionFactory;

    @Before
    public void init() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    }

    @Test
    public void testFindAll() {
        // 获取 SqlSession（类似 JDBC Connection）
        try (SqlSession session = sqlSessionFactory.openSession()) {
            // 获取 Mapper 代理对象（MyBatis 自动生成实现类）
            UserMapper mapper = session.getMapper(UserMapper.class);

            List<User> users = mapper.findAll();
            for (User user : users) {
                System.out.println(user);
            }
        }
    }

    @Test
    public void testInsert() {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            UserMapper mapper = session.getMapper(UserMapper.class);

            User user = new User();
            user.setName("张三");
            user.setEmail("zhangsan@example.com");
            user.setAge(25);

            int rows = mapper.insert(user);
            System.out.println("影响行数: " + rows);
            System.out.println("自增ID: " + user.getId()); // 获取自增主键

            session.commit(); // 必须提交事务
        }
    }

    @Test
    public void testCRUD() {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            UserMapper mapper = session.getMapper(UserMapper.class);

            // 插入
            User user = new User(null, "李四", "lisi@example.com", 30);
            mapper.insert(user);
            session.commit();

            // 查询
            User found = mapper.findById(user.getId());
            System.out.println("查询结果: " + found);

            // 更新
            found.setAge(31);
            mapper.update(found);
            session.commit();

            // 删除
            mapper.delete(found.getId());
            session.commit();
        }
    }
}
```

## 3. Mapper 注解方式

对于简单场景，可以不用 XML，直接用注解写 SQL：

```java
public interface UserMapper {

    @Select("SELECT * FROM tb_user WHERE id = #{id}")
    User findById(Long id);

    @Select("SELECT * FROM tb_user ORDER BY id DESC")
    List<User> findAll();

    @Insert("INSERT INTO tb_user (name, email, age) VALUES (#{name}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE tb_user SET name=#{name}, email=#{email}, age=#{age} WHERE id=#{id}")
    int update(User user);

    @Delete("DELETE FROM tb_user WHERE id = #{id}")
    int delete(Long id);

    // 动态 SQL 较复杂时建议用 XML
}
```

## 4. 核心配置详解

### TypeAlias（类型别名）

```xml
<typeAliases>
    <!-- 方式1：指定类型 -->
    <typeAlias type="com.example.entity.User" alias="User"/>

    <!-- 方式2：自动扫描包，别名默认为类名（不区分大小写） -->
    <package name="com.example.entity"/>
</typeAliases>
```

### resultMap（结果映射）

当数据库列名与 Java 属性名不一致时使用：

```xml
<!-- 定义 resultMap -->
<resultMap id="UserResultMap" type="User">
    <!-- 主键映射：column=数据库列名，property=Java 属性名 -->
    <id column="user_id" property="id"/>
    <result column="user_name" property="name"/>
    <result column="user_email" property="email"/>
    <result column="user_age" property="age"/>
    <result column="create_time" property="createTime"/>
</resultMap>

<!-- 使用 resultMap -->
<select id="findAll" resultMap="UserResultMap">
    SELECT user_id, user_name, user_email, user_age, create_time
    FROM tb_user
</select>
```

### 关联查询（嵌套结果）

```java
// Order 实体类
public class Order {
    private Long id;
    private Long userId;
    private Double totalAmount;
    private User user; // 关联用户对象
    // getters and setters
}
```

```xml
<resultMap id="OrderResultMap" type="Order">
    <id column="order_id" property="id"/>
    <result column="user_id" property="userId"/>
    <result column="total_amount" property="totalAmount"/>
    <!-- association: 嵌套对象的映射 -->
    <association property="user" javaType="User">
        <id column="u_id" property="id"/>
        <result column="u_name" property="name"/>
        <result column="u_email" property="email"/>
    </association>
</resultMap>

<select id="findOrderWithUser" resultMap="OrderResultMap">
    SELECT o.id AS order_id, o.user_id, o.total_amount,
           u.id AS u_id, u.name AS u_name, u.email AS u_email
    FROM tb_order o
    LEFT JOIN tb_user u ON o.user_id = u.id
    WHERE o.id = #{id}
</select>
```

### 一对多查询（嵌套查询）

```java
// User 实体类
public class User {
    private Long id;
    private String name;
    private List<Order> orders; // 用户的订单列表
    // getters and setters
}
```

```xml
<resultMap id="UserWithOrdersMap" type="User">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <!-- collection: 一对多关联 -->
    <collection property="orders" ofType="Order">
        <id column="o_id" property="id"/>
        <result column="total_amount" property="totalAmount"/>
    </collection>
</resultMap>

<select id="findUserWithOrders" resultMap="UserWithOrdersMap">
    SELECT u.id, u.name, o.id AS o_id, o.total_amount
    FROM tb_user u
    LEFT JOIN tb_order o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>
```

## 5. 动态 SQL

动态 SQL 是 MyBatis 的核心优势，可以根据条件自动拼接 SQL。

### 5.1 if（条件判断）

```xml
<select id="searchUser" resultType="User">
    SELECT * FROM tb_user WHERE 1=1
    <!-- test: OGNL 表达式，为 true 时拼接内部内容 -->
    <if test="name != null and name != ''">
        AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
    <if test="email != null">
        AND email = #{email}
    </if>
</select>
```

### 5.2 where（智能where）

```xml
<!-- where 标签：自动处理 AND/OR 前缀，避免 1=1 写法 -->
<select id="searchUser" resultType="User">
    SELECT * FROM tb_user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE CONCAT('%', #{name}, '%')
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </where>
</select>
```

### 5.3 set（更新时智能处理）

```xml
<!-- set 标签：自动去掉多余的逗号 -->
<update id="updateUser">
    UPDATE tb_user
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="email != null">email = #{email},</if>
        <if test="age != null">age = #{age},</if>
    </set>
    WHERE id = #{id}
</update>
```

### 5.4 trim（自定义前后缀）

```xml
<!-- 等价于 <where> -->
<trim prefix="WHERE" prefixOverrides="AND|OR">
    <if test="...">AND ...</if>
</trim>

<!-- 等价于 <set> -->
<trim prefix="SET" suffixOverrides=",">
    <if test="...">name = #{name},</if>
</trim>
```

### 5.5 choose/when/otherwise（多条件分支）

```xml
<select id="searchUser" resultType="User">
    SELECT * FROM tb_user
    <where>
        <choose>
            <when test="id != null">
                AND id = #{id}
            </when>
            <when test="name != null">
                AND name = #{name}
            </when>
            <otherwise>
                AND age IS NOT NULL
            </otherwise>
        </choose>
    </where>
</select>
```

### 5.6 foreach（循环遍历）

```xml
<!-- 批量查询：SELECT * FROM tb_user WHERE id IN (1, 2, 3) -->
<select id="findByIds" resultType="User">
    SELECT * FROM tb_user
    <where>
        <if test="ids != null and ids.size > 0">
            id IN
            <!-- collection: 集合属性名，item: 遍历变量名，separator: 分隔符 -->
            <foreach collection="ids" item="id" open="(" separator="," close=")">
                #{id}
            </foreach>
        </if>
    </where>
</select>

<!-- 批量插入 -->
<insert id="batchInsert">
    INSERT INTO tb_user (name, email, age) VALUES
    <foreach collection="users" item="user" separator=",">
        (#{user.name}, #{user.email}, #{user.age})
    </foreach>
</insert>
```

### 5.7 bind（变量绑定）

```xml
<!-- 将表达式结果绑定到变量，供后续使用 -->
<select id="searchUser" resultType="User">
    <bind name="pattern" value="'%' + keyword + '%'"/>
    SELECT * FROM tb_user
    WHERE name LIKE #{pattern}
</select>
```

## 6. Spring 整合 MyBatis

### 添加依赖

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
```

### application.yml 配置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/testdb?useSSL=false
    username: root
    password: 123456

mybatis:
  # mapper XML 文件路径
  mapper-locations: classpath:mapper/*.xml
  # 类型别名包扫描
  type-aliases-package: com.example.entity
  # 开启下划线转驼峰（数据库 user_name → Java userName）
  configuration:
    map-underscore-to-camel-case: true
```

### MapperScan 注解

在启动类或配置类上添加扫描注解：

```java
@SpringBootApplication
@MapperScan("com.example.mapper") // 扫描 Mapper 接口所在包
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Service 层调用

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper; // 直接注入 Mapper（Spring 代理）

    @Override
    public List<User> list() {
        return userMapper.findAll();
    }

    @Transactional // 事务管理
    @Override
    public void save(User user) {
        userMapper.insert(user);
    }
}
```

## 7. 分页插件

### PageHelper 使用

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public PageInfo<User> listByPage(int pageNum, int pageSize) {
        // 紧跟在这个方法后的第一个 MyBatis 查询会被分页
        PageHelper.startPage(pageNum, pageSize);
        List<User> users = userMapper.findAll();
        return new PageInfo<>(users);
    }
}
```

## 总结

MyBatis 通过 **Mapper 映射文件** 或 **注解** 将 SQL 与 Java 方法关联，支持灵活的 CRUD 操作。**动态 SQL**（if、where、set、foreach 等标签）解决了复杂条件拼接问题。配合 **resultMap** 可以处理关联查询和字段映射。Spring Boot 集成后，通过 `@MapperScan` 和 YAML 配置即可快速搭建持久层。

[[返回 Java 首页|../index]]

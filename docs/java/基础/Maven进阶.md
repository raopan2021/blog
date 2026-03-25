---
title: Maven 进阶：依赖管理与私服
---

# Maven 进阶：依赖管理与私服

> 本节深入讲解 Maven 依赖管理机制、插件配置以及如何搭建和使用 Maven 私服

## 1. 依赖管理核心

### 1.1 依赖范围（Scope）

依赖范围控制依赖在编译、测试、运行三种classpath中的作用范围。

| Scope | 编译 | 测试 | 运行 | 打包 | 说明 |
|-------|------|------|------|------|------|
| compile（默认）| ✅ | ✅ | ✅ | ✅ | 参与所有环节 |
| provided | ✅ | ✅ | ❌ | ❌ | 容器已提供（如 Servlet API）|
| runtime | ❌ | ✅ | ✅ | ✅ | 编译不需要（如 JDBC 驱动）|
| test | ❌ | ✅ | ❌ | ❌ | 只参与测试（如 JUnit）|
| system | ✅ | ✅ | ❌ | ❌ | 手动引入的系统路径 |
| import | - | - | - | - | 仅用于 pom 继承 |

```xml
<dependencies>
    <!-- Servlet API：容器已提供，运行时不需要 -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>6.0.0</version>
        <scope>provided</scope>
    </dependency>

    <!-- JDBC 驱动：编译不需要，运行时需要 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
        <scope>runtime</scope>
    </dependency>

    <!-- JUnit：仅测试时使用 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 1.2 依赖传递与冲突

当 A 依赖 B，B 依赖 C 时，A 会自动获得 C 的依赖——这叫**依赖传递**。

```bash
# Maven 依赖树：查看依赖传递和冲突
mvn dependency:tree
mvn dependency:tree -Dincludes=com.alibaba:fastjson  # 过滤只看某个依赖
```

**依赖冲突解决原则**：

1. **最短路径优先**：A → B → C → D（v1），A → X → D（v2），选用 v2
2. **最先声明优先**：路径长度相同时，选用 pom 中先声明的版本

```xml
<!-- 排除传递过来的依赖 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.43</version>
    <exclusions>
        <!-- 排除 spring-aop 依赖 -->
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- 锁定版本（推荐方式） -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson2</artifactId>
            <version>2.0.43</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 1.3 版本管理（依赖版本锁定）

```xml
<!-- 父 pom 中统一定义版本，子 pom 不需要写版本号 -->
<properties>
    <spring.version>6.1.0</spring.version>
    <mybatis.version>3.5.15</mybatis.version>
    <jackson.version>2.16.0</jackson.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

子 pom 引用时无需指定版本：

```xml
<!-- 子 pom -->
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <!-- 不需要写 version，会从父 pom 继承 -->
    </dependency>
</dependencies>
```

## 2. 聚合与继承

### 2.1 聚合（多模块构建）

将多个模块聚合到一个项目，统一构建。

```xml
<!-- 父 pom（聚合工程） -->
<project>
    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging> <!-- 聚合工程必须是 pom -->

    <!-- modules：列出所有子模块 -->
    <modules>
        <module>module-common</module>
        <module>module-dao</module>
        <module>module-service</module>
        <module>module-web</module>
    </modules>

    <!-- 统一版本管理 -->
    <properties>
        <spring.version>6.1.0</spring.version>
    </properties>
</project>
```

执行 `mvn clean install` 会自动按顺序构建所有模块。

### 2.2 继承

子 pom 继承父 pom 的配置：

```xml
<!-- 子 pom -->
<project>
    <!-- 指定父 pom -->
    <parent>
        <groupId>com.example</groupId>
        <artifactId>parent-project</artifactId>
        <version>1.0.0</version>
        <!-- 父 pom 的相对路径（如果是同一项目树下可用） -->
        <relativePath>../parent-project/pom.xml</relativePath>
    </parent>

    <artifactId>module-dao</artifactId>

    <!-- 子 pom 覆盖父 pom 的配置 -->
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

## 3. 插件配置

Maven 插件用于在构建生命周期中执行特定任务（如编译、打包、测试、生成文档）。

### 3.1 常用插件

```xml
<build>
    <plugins>
        <!-- Java 编译插件 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.12.1</version>
            <configuration>
                <source>17</source>
                <target>17</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>

        <!-- 打包 jar（不含依赖） -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>3.3.0</version>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>com.example.Application</mainClass>
                        <addClasspath>true</addClasspath>
                    </manifest>
                </archive>
            </configuration>
        </plugin>

        <!-- 打包依赖 jar（fat jar，可直接运行） -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>3.2.0</version>
        </plugin>

        <!-- 跳过测试 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.2.2</version>
            <configuration>
                <skipTests>true</skipTests>
            </configuration>
        </plugin>

        <!-- 源码打包 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-source-plugin</artifactId>
            <version>3.3.0</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### 3.2 运行插件

```bash
# 跳过测试构建
mvn clean package -DskipTests

# 运行 Spring Boot 应用
mvn spring-boot:run

# 生成依赖树
mvn dependency:tree

# 分析未使用的依赖
mvn dependency:analyze
```

## 4. Maven 私服（Nexus）

私服是搭建在局域网内的 Maven 仓库代理，用于存储内部构件和加速构建。

### 4.1 Nexus 安装启动

```bash
# 下载 Nexus：https://help.sonatype.com/learning/nexus-repository-administration
# 解压后进入 bin 目录

# Linux/Mac 启动
./nexus start

# 查看状态
./nexus status

# 访问管理界面（默认 admin 账户，密码在 sonatype-work/nexus3/admin.password）
http://localhost:8081
```

### 4.2 仓库类型

| 类型 | 说明 |
|------|------|
| hosted（宿主仓库）| 存储内部发布的构件（公司自己的 jar）|
| proxy（代理仓库）| 代理远程中央仓库（如 Maven Central）|
| group（仓库组）| 组合多个仓库，统一提供服务 |

常用仓库规划：

| 仓库名 | 类型 | 用途 |
|--------|------|------|
| maven-releases | hosted | 发布版本（内部 release）|
| maven-snapshots | hosted | 快照版本（内部 SNAPSHOT）|
| maven-central | proxy | 代理 Maven Central |
| public | group | 组合以上所有，统一访问 |

### 4.3 配置 Maven 使用私服

修改 `~/.m2/settings.xml`：

```xml
<settings>
    <!-- 镜像配置：将公共仓库请求重定向到私服 -->
    <mirrors>
        <mirror>
            <id>nexus-public</id>
            <name>Nexus Public</name>
            <!-- 仓库组的 URL（所有请求通过这个代理） -->
            <url>http://localhost:8081/repository/maven-public/</url>
            <mirrorOf>*</mirrorOf> <!-- 镜像所有仓库 -->
        </mirror>
    </mirrors>

    <!-- 服务器认证信息 -->
    <servers>
        <server>
            <id>nexus-public</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <!-- 内部仓库认证 -->
        <server>
            <id>maven-releases</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <server>
            <id>maven-snapshots</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
    </servers>
</settings>
```

### 4.4 发布构件到私服

配置项目的 `pom.xml`：

```xml
<distributionManagement>
    <!-- 发布版本仓库 -->
    <repository>
        <id>maven-releases</id>
        <name>Release Repository</name>
        <url>http://localhost:8081/repository/maven-releases/</url>
    </repository>

    <!-- 快照版本仓库 -->
    <snapshotRepository>
        <id>maven-snapshots</id>
        <name>Snapshot Repository</name>
        <url>http://localhost:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

```bash
# 发布到私服
mvn clean deploy

# 发布时带版本号：
# SNAPSHOT 版本（如 1.0.0-SNAPSHOT）→ 发到 maven-snapshots
# release 版本（如 1.0.0）→ 发到 maven-releases
```

### 4.5 项目中引用内部构件

```xml
<repositories>
    <repository>
        <id>nexus-public</id>
        <url>http://localhost:8081/repository/maven-public/</url>
        <!-- 是否启用发布版本 -->
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>
```

## 5. 常用命令与技巧

```bash
# 创建标准 Maven 项目（不交互）
mvn archetype:generate \
    -DgroupId=com.example \
    -DartifactId=my-app \
    -DarchetypeArtifactId=maven-archetype-quickstart \
    -DinteractiveMode=false

# 编译
mvn clean compile

# 测试
mvn test

# 打包
mvn clean package

# 安装到本地仓库
mvn clean install

# 发布
mvn clean deploy

# 查看有效 pom（合并继承后的完整配置）
mvn help:effective-pom

# 分析依赖
mvn dependency:analyze

# 列出所有插件
mvn help:describe -Dplugin=compiler

# 强制更新依赖（忽略本地缓存）
mvn clean install -U
```

## 6. profile 环境切换

通过 profile 实现多环境配置切换：

```xml
<profiles>
    <!-- 开发环境 -->
    <profile>
        <id>dev</id>
        <activation>
            <activeByDefault>true</activeByDefault> <!-- 默认激活 -->
        </activation>
        <properties>
            <jdbc.url>jdbc:mysql://localhost:3306/dev_db</jdbc.url>
            <jdbc.username>dev</jdbc.username>
            <jdbc.password>dev123</jdbc.password>
        </properties>
    </profile>

    <!-- 测试环境 -->
    <profile>
        <id>test</id>
        <properties>
            <jdbc.url>jdbc:mysql://test-server:3306/test_db</jdbc.url>
            <jdbc.username>test</jdbc.username>
            <jdbc.password>test123</jdbc.password>
        </properties>
    </profile>

    <!-- 生产环境 -->
    <profile>
        <id>prod</id>
        <properties>
            <jdbc.url>jdbc:mysql://prod-server:3306/prod_db</jdbc.url>
            <jdbc.username>prod</jdbc.username>
            <jdbc.password>prod123</jdbc.password>
        </properties>
    </profile>
</profiles>
```

在 `application.yml` 中引用：

```yaml
spring:
  datasource:
    url: ${jdbc.url}
    username: ${jdbc.username}
    password: ${jdbc.password}
```

指定环境构建：

```bash
mvn clean package -Pdev      # 激活 dev profile
mvn clean package -Pprod     # 激活 prod profile
```

## 总结

Maven 进阶的核心在于**依赖传递与冲突处理**、**聚合与继承**的项目结构管理、**插件配置**以及**私服的使用**。通过 `<dependencyManagement>` 锁定版本可以避免冲突；通过 profile 可以实现多环境切换；通过 Nexus 私服可以统一管理内部构件，减少对外部网络的依赖，提升构建速度。

[[返回 Java 首页|../index]]

# jdk与环境变量

## 下载JDK安装包

[官网](https://www.oracle.com/java/technologies/downloads/#java8-windows)

[jdk1.8华为镜像地址（推荐）](https://repo.huaweicloud.com/java/jdk/8u202-b08/)

安装时，点击下一步就行了

## 环境变量配置

[教程](https://blog.csdn.net/u014454538/article/details/88085316)

新建变量名：JAVA_HOME

变量值：`C:\Program Files\java\jdk`

---

新建变量名：CLASSPATH

变量值：`.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar`

Path变量添加： `%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin`

## 测试jdk是否配置完成

打开`cmd`:

```txt
java
```

> 用法: java [-options] class [args...] ......

```txt
java -version
```

> java version "1.8.0_202" ......

```txt
javac
```

> 用法: javac `<options> <source files>`......

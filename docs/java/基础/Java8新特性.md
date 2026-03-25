---
title: Java 函数式编程
---

# Java 函数式编程

## Lambda 表达式

```java
// 匿名内部类 → Lambda 简化
// 旧写法
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("hello");
    }
};

// Lambda 写法（目标类型推断）
Runnable r2 = () -> System.out.println("hello");

// 带参数
Comparator<String> c1 = (String a, String b) -> a.compareTo(b);
// 类型推断，可省略
Comparator<String> c2 = (a, b) -> a.compareTo(b);

// 单行方法体，可省略大括号
Consumer<String> consumer = s -> System.out.println(s);

// 多行方法体
Function<Integer, Integer> f = n -> {
    int result = n * 2;
    return result;
};
```

### 函数式接口

```java
// 有且只有一个抽象方法的接口（Object 的方法不算）
// 常用函数式接口：

// Supplier<T>：无参数，返回 T
Supplier<String> s = () -> "hello";

// Consumer<T>：消费 T，无返回值
Consumer<String> c = s -> System.out.println(s);

// Function<T, R>：输入 T，输出 R
Function<String, Integer> f = s -> s.length();

// Predicate<T>：输入 T，返回 boolean
Predicate<Integer> p = n -> n > 0;

// BiFunction<T, U, R>：输入 T 和 U，输出 R
BiFunction<Integer, Integer, Integer> bf = (a, b) -> a + b;

// UnaryOperator<T>：输入 T，输出 T
UnaryOperator<Integer> uo = n -> n * 2;

// BinaryOperator<T>：输入两个 T，输出 T
BinaryOperator<Integer> bo = (a, b) -> a + b;
```

## Stream API

```java
import java.util.stream.*;

// 创建 Stream
Stream.of(1, 2, 3, 4, 5);
Arrays.asList(1, 2, 3).stream();
Stream.generate(() -> new Random().nextInt()).limit(10);
Stream.iterate(1, n -> n + 1).limit(10);
```

### 中间操作

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// filter：过滤
list.stream()
    .filter(n -> n > 2)
    .collect(Collectors.toList());  // [3, 4, 5]

// map：转换
list.stream()
    .map(n -> n * 2)
    .collect(Collectors.toList());  // [2, 4, 6, 8, 10]

// flatMap：扁平化
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);
nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());  // [1, 2, 3, 4]

// distinct：去重
Stream.of(1, 2, 2, 3, 3)
    .distinct()
    .collect(Collectors.toList());  // [1, 2, 3]

// sorted：排序
Stream.of(3, 1, 2)
    .sorted()
    .collect(Collectors.toList());  // [1, 2, 3]

// limit 和 skip：限制和跳过
list.stream()
    .skip(1)
    .limit(3)
    .collect(Collectors.toList());  // [2, 3, 4]
```

### 终端操作

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// collect：收集
list.stream().collect(Collectors.toList());
list.stream().collect(Collectors.toSet());
list.stream().collect(Collectors.toMap(k, v));

// toList/toSet/toMap（JDK 16+）
list.stream().toList();

// forEach：遍历
list.stream().forEach(System.out::println);

// count：计数
long count = list.stream().count();

// sum/avg（IntStream 等）
int sum = list.stream().mapToInt(Integer::intValue).sum();
double avg = list.stream().mapToInt(Integer::intValue).average().orElse(0);

// max/min
Optional<Integer> max = list.stream().max(Integer::compareTo);
Optional<Integer> min = list.stream().min(Integer::compareTo);

// reduce：聚合
int product = list.stream().reduce(1, (a, b) -> a * b);  // 120

// anyMatch/allMatch/noneMatch
boolean any = list.stream().anyMatch(n -> n > 3);  // true
boolean all = list.stream().allMatch(n -> n > 0);  // true
boolean none = list.stream().noneMatch(n -> n < 0);  // true

// findFirst/findAny
Optional<Integer> first = list.stream().findFirst();  // Optional[1]
Optional<Integer> any_ = list.stream().findAny();  // Optional[1]
```

## 方法引用

```java
// 方法引用是 Lambda 的简化形式

// 静态方法引用
Function<String, Integer> f = Integer::parseInt;

// 实例方法引用（特定对象）
String str = "hello";
Supplier<Integer> s = str::length;

// 实例方法引用（任意对象）
Function<String, String> f2 = String::toUpperCase;

// 构造函数引用
Supplier<ArrayList> s2 = ArrayList::new;
Function<Integer, ArrayList> f3 = ArrayList::new;
```

## Optional 容器

```java
// 避免 NPE
Optional<String> opt = Optional.ofNullable(getName());

// 判断是否有值
if (opt.isPresent()) {  // 不推荐
    System.out.println(opt.get());
}

// 推荐：ifPresent
opt.ifPresent(System.out::println);

// orElse：为空时的默认值
String name = opt.orElse("unknown");

// orElseGet：为空时调用 Supplier
String name2 = opt.orElseGet(() -> "default");

// orElseThrow：为空时抛异常
String name3 = opt.orElseThrow(() -> new RuntimeException("not found"));

// map 转换
Optional<Integer> len = opt.map(String::length);

// flatMap（Optional 的 Optional 拍平）
Optional<String> opt2 = Optional.ofNullable("hello");
Optional<Optional<Integer>> nested = opt2.map(s -> Optional.of(s.length()));
Optional<Integer> flat = opt2.flatMap(s -> Optional.of(s.length()));
```

## 函数组合

```java
import static java.util.Comparator.*;

// Comparator 组合
Comparator<String> c = Comparator.comparingInt(String::length)
    .thenComparing(String::compareTo);

list.stream().sorted(c).collect(Collectors.toList());

// Function 组合
Function<Integer, Integer> f = ((Function<Integer, Integer>) n -> n * 2)
    .andThen(n -> n + 1)
    .compose(n -> n - 1);
f.apply(5);  // (5-1)*2+1 = 9

// Predicate 组合
Predicate<String> p = s -> s.length() > 3;
p.and(s -> s.startsWith("a"));
p.or(s -> s.endsWith("z"));
p.negate();
```

## 实战示例

```java
// 1. 过滤并转换
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<Integer> lengths = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::length)
    .collect(Collectors.toList());  // [5, 7]

// 2. 分组
Map<String, List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));

// 3. 分区（按条件分为两组）
Map<Boolean, List<Person>> byAdult = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() >= 18));

// 4. 统计
IntSummaryStatistics stats = list.stream()
    .mapToInt(Integer::intValue)
    .summaryStatistics();
System.out.println("sum=" + stats.getSum());
System.out.println("avg=" + stats.getAverage());
```

[[返回 Java 首页|../index]]

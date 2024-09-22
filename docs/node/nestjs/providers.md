# providers

Providers 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provider - service, repository, factory, helper 等等。
他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给
Nest 运行时系统。 Provider 只是一个用 @Injectable() 装饰器注释的类。

[详细请看小满 zs](https://xiaoman.blog.csdn.net/article/details/126494064)

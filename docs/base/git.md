# `git` 的基本使用

::: tip 来源
[菜鸟](https://www.runoob.com/git/git-create-repository.html)

[git ssh配置、密钥创建](https://www.jianshu.com/p/3f4b2ede5a93)

[如何将一个项目同时提交到GitHub和Gitee(码云)上](https://zhuanlan.zhihu.com/p/346400298)
:::

## 安装 `git`

[官网下载](https://git-scm.com/download/win)、安装（一直 `next` 就行了）



## 配置密钥 `ssh`

> 查看当前用户信息：

``` txt
git config user.name
``` 

``` txt
git config user.email
``` 

> 设置提交代码时的用户信息：

``` txt
git config --global user.name "raopan2021"
``` 

``` txt
git config --global user.email "raopan2021@outlook.com"
``` 

> 创建 `ssh`

``` txt
ssh-keygen -t rsa -C 'raopan2021@outlook.com'
```

之后不断Enter即可

> 查看你生成的公钥

``` txt
cat ~/.ssh/id_rsa.pub
```

输入该命令回车后，复制看到的公钥，是类似于这样的一串字符

``` 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDY01oB1yY4wbZj8T/
·······
kf82w4u+RZwyu4E20I6p7boP/EKjGXiDBw10/Qc= raopan2021@outlook.com
```

> 将 `ssh` 保存到 [gitee](https://gitee.com/profile/sshkeys) 、[github](https://github.com/settings/keys)




## git同时提交到 `gitee`、`github`

找到 `.git` 文件夹下面的 `config`文件修改，新增行：

``` txt {9,10}
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[remote "origin"]
	    url = https://github.com/raopan2021/blog.git
		url = https://gitee.com/raopan2021/blog.git 
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/main
```


也就是说，在原来的github仓库地址下面再添加一个url配置，指向gitee的地址。

当然，这里有一个前提条件，Gitee和GitHub的账号的公私钥为同一套。

此时再修改本地代码，进行提交，你会发现GitHub和Gitee上的代码同时被修改了。是不是很cool？
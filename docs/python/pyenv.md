# pyenv 和 python-virtualenv

pyenv 托管安装的 python 版本，python-virtualenv 则调用对应的 python 版本

[来源](https://blog.csdn.net/qq_27114273/article/details/90340754)

使用python进行开发，Unix/Linux 的环境会更加友好，不会出现莫名其妙的bug，

虽然 windows store 也发布了 Ubuntu 子系统，但是功能不够全，系统不够完善。

Windows下使用pyenv的方法请移步 pyenv-win 源码地址查看： <https://github.com/pyenv-win/pyenv-win> ，当然pyenv也可以在Windows store的Linux子系统中使用。

## Linux 环境 - 以centos为例

使用 pyenv 和 pyenv-virtualenv ，在 Linux 下完美隔离 python 各个版本

### 安装和环境配置

- 安装 git

```bash
sudo yum install git
```

- 安装 pyenv

把项目克隆下来，放在家目录下的隐藏文件夹中：.pyenv

```bash
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

- 配置环境变量

```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n eval "$(pyenv init -)"\nfi' >> ~/.bashrc
source ~/.bashrc
```

- 安装 pyenv-virtualenv

```bash
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
```

- 配置环境变量

```bash
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc
source ~/.bashrc
```

### 使用 pyenv

```bash
## 查看所有可用的 Python 版
pyenv install --list 

# 会安装3.11的最新版 3.11.10
pyenv install 3.11
# 实时输出安装日志
pyenv install 3.11 -v
# 如果安装失败，试试下方指令
sudo yum install gcc zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel tk-devel libffi-devel
```

::: details 安装python3.7及以上的版本，会因为ssl报错，需要安装openssl，[详情查案看csdn](https://blog.csdn.net/qq_42280510/article/details/130511547)

```bash
# 要求openssl版本1.1.1+，直接更新。
# 查看ssl版本
openssl version
# 下载到根目录
wget --no-check-certificate https://www.openssl.org/source/openssl-1.1.1t.tar.gz
# 解压
tar -zxf openssl-1.1.1t.tar.gz
# 编译安装
cd openssl-1.1.1t
./config -Wl,-rpath=/usr/lib64 --prefix=/usr/local/openssl --openssldir=/usr/local/openssl --libdir=/usr/lib64
make -j 4 && make install
# 替换软连接
mv /usr/bin/openssl /usr/bin/openssl.bak
ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
# 再次查看ssl版本
openssl version

# 重新安装python
CPPFLAGS="-I/usr/local/openssl/include" LDFLAGS="-L/usr/local/openssl/lib" pyenv install -v 3.11.10
```

:::

```bash
## 查看已安装的 Python 版本
pyenv versions

## 查看当前使用的 Python 版本
pyenv version

# 卸载指定版本
pyenv uninstall 3.11.10
```

### 虚拟环境

```bash
# 全局指定 Python 版本（影响所有项目）
pyenv global 3.11.10 

# 局部指定 Python 版本（仅影响当前项目目录），会在当前项目目录内创建 .python-version 文件，保存版本信息
# 优先级高于 global
pyenv local 3.11.10 

# 会话级指定 Python 版本（影响所有项目）
pyenv shell 3.11.10 

# 查看 python 的安装目录
pyenv which python

# 重新生成 pyenv 的 shims 目录中的可执行文件
pyenv rehash 
```

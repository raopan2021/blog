# Conda

在windows系统使用 Conda

## 安装及配置

### 去清华源，安装 [Miniconda](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/) 或 [Anaconda](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/)

- 安装时，可以配置安装目录，例如：D:\IDEs\Anaconda

- 给所有人安装

### 环境配置

将以下2个目录添加到环境变量（系统环境变量 - path）

```txt
D:\IDEs\Anaconda\condabin
```

```txt
D:\IDEs\Anaconda\Scripts
```

### 修改源、包安装位置

修改文件 C:\\Users\\raopan\\.condarc

```txt
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
envs_dirs:
  - D:\IDEs\PythonEnvs\envs
pkgs_dirs:
  - D:\IDEs\PythonEnvs\pkgs
```

## 环境创建、使用等

```bash
# 创建环境
mamba create --name <env_name> python=3.12
mamba create -n py3-12 python=3.12

# 复制环境
conda create --name myclone --clone myenv

# 激活环境
conda activate <env_name>

# 退出环境
conda deactivate

# 删除环境
conda remove --name <env_name> --all
conda remove -n <env_name> --all

# 查看所有环境
conda env list
```

## 安装包

```bash
# 安装包
conda install --name py3-12 <package_name> -y
conda install -n py3-12 black -y

# 更新包
conda update <package_name>

# 查看已安装的包
conda list

# conda查看指定环境的包
conda list -n <env_name>
```

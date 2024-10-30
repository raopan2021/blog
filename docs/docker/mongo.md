# 部署 MongoDB

## 安装

```bash
# 下载 mongodb
docker pull mongo:8

# 创建容器
docker run -d -p 27017:27017 -n mongo8 mongo

# # 进入容器
# docker exec -it mongo /bin/bash
# # 退出容器
# exit

# 重启容器
docker restart mongo
```

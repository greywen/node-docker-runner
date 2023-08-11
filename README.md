# node-docker-runner
使用nodejs+docker实现一个在线编译运行代码后台

## 实现原理
1. 读取配置文件
2. 组装代码/脚本（外部资源注入/执行代码前/后脚本）
3. 配置Docker资源（CPU/内存/超时时间）
4. 拼接成最终的shell命令
5. Docker编译执行

Tips: 
1. 为了省去部署2套语言环境故将代码放入Docker中进行编译
2. 部分需要编译的语言需要对容器进行定制


## 准备环境
Docker（Liunx） 部署:
- javascript:
```sh
docker pull nodejs
```

## 安装依赖/编译/运行

`yarn install`

`yarn build`

`yarn start`


## 测试
Tips: 需先安装依赖/编译/运行

`yarn test`

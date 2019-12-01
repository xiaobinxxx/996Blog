# 996blog

> 996blog 个人开发一套博客，前端vue，后端node，数据库为mongdb

## 演示地址

#### [前端地址](https://blogs.996ico.cn/)

#### [后台地址](https://blogs.996ico.cn/login/index/index)

**演示账号：adminer 密码：adminer**

``` bash
# 安装依赖
npm install

# 本地运行地址 localhost:3304
npm run dev

# 打包
npm run build
```
### 后台（进入目录 /service）
``` bash
# 运行
node app.js
# 本地运行地址 localhost:3001
```

> **温馨提示：请事先安装后node环境和mongdb以及vue环境**

> **搭建完，请先登录后台地址（后台地址运行起来便知晓），进行登录，默认登录账号：admin 密码：admin**

### 搭建请先进入/service/config.json 配置相关信息


```json
{
  "//": "db数据库地址",
  "dbAddress": "localhost:27017",
  "//": "db数据库",
  "dbName": "Blogs",
  "//": "服务器域名",
  "host": ""
}
```

### 使用技术

> 前端：vue element-ui

> 后端：node - bootstrap - 996Popup(弹出层) - editor.md - jquery

> 数据库: mongdb

### 目录结构
```
├── README.md           
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── service            // 服务端目录
│   ├── admin          // 后台渲染的页面
│   ├── dbmodel        // 数组库实例
│   ├── logs           // 日志文件
│   ├── module         // 接口文件（包含后端接口）
│   ├── mongodb        // 数据库结构文件
│   ├── public         // 后端静态文件
│   ├── util           // 工具文件
│   ├── views          // 渲染的模板页面
│   ├── app.js         // 执行文件
│   └── config.json    // 配置文件
├── src                // 生产目录
│   ├── components     // 各种组件
│   │	├── BlogsRight   // 右侧组件
│   │	├── Footer       // 底部组件
│   │	├── GoTop        // 返回顶部组件
│   │	└── Navigation   // 导航组件
│   ├── page           // 页面
│   ├── router         // 路由
│   ├── tool           // 工具
│   ├── App.vue           
│   └── main.js        // Webpack 预编译入口
└──  static            // 前端静态文件  

```
最近一直在学习node和相关后台知识，于是就想到了写一个博客玩玩。

最后还是决定开源吧，不是什么厉害的技术，喜欢朋友可以搭建使用。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

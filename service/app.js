/**
 * app.js
 * 服务端入口文件
 */
// 加载express模块
const express = require('express');
//加载数据库模块
const mongoose = require('mongoose');
// 加载中间件
const bodyParser = require('body-parser');
//加载模板处理模块
const swig = require('swig');
// 加载文件模块
const fs = require('fs');
// 加载路径模块
const path = require('path');
//加载cookies模块
const Cookies = require('cookies');
//引用session
const session = require("express-session");
// 引入配置文件
const config = require('./config');
// 创建实例
const app = express();


//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

// 设置session
app.use(session({
  secret: "AdminInfo",		//设置签名秘钥  内容可以任意填写
  cookie: {maxAge: 10000 * 1000},		//设置cookie的过期时间，例：80s后session和相应的cookie失效过期
  resave: true,			//强制保存，如果session没有被修改也要重新保存
  saveUninitialized: false		//如果原先没有session那么久设置，否则不设置
}));


//获取session
app.use((req, res, next) => {
  let AdminInfo = req.session.AdminInfo;
  req.session.config = {
    host: config.host,
  };
  // 判断是否存在登录状态
  if (!AdminInfo) {
    req.session.AdminInfo = -200;
    next();
    return;
  }
  next();
});

/**
 * 全局js文件
 */
app.get('/mian.js', (req, res, next) => {
  res.send("" +
    "if(" + req.session.AdminInfo + "== -200){\n" +
    "    window.location.href = '/login/index/index';\n" +
    "    Toast('登录状态已失效',2000);\n" +
    "  };");
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * 后台路由设置
 */
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
};

/**
 * 跨域处理
 */
app.all("*", (req, res, next) => {
  // 域名白名单
  let allow_origin = [
    "http://localhost:8080",
    "http://localhost:3304"
  ];
  // 允许的域名
  let origin = req.headers.origin;
  // 跨域判断是否在白名单内
  if (!allow_origin.includes(req.headers.origin)) {
    origin = 'http://localhost:8080'
  }
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", origin);
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type,token,versions,source");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
});

/**
 * 接口拦截所有请求
 */
app.use((req, res, next) => {
  // 连接用户数据表
  const MemberModel = require('./dbmodel/member');
  if (!req.headers.token) {
    next();
    return;
  }
  MemberModel.findOne({
    _id: req.headers.token,
  }).then(ress => {
    if (ress.isDefriend) {
      res.json({
        code: -100,
        message: '已入黑名单',
      });
    }
    next();
  });
});

/**
 * 捕获错误
 */
app.use((req, res, next) => {
  if (res.statusCode === 500) {
    logger.error(req);
  }
  next();
});

/**
 * 接口路由
 * @param filePath
 * @param name
 */
function fileDisplay(filePath, name) {

  fs.readdir(filePath, (err, file) => {
    // if(!(/\.js$/i.test(file))) return;
    file.forEach((filename, index) => {
      //获取当前文件的绝对路径
      let filedir = path.join(filePath, filename);
      fs.stat(filedir, (eror, stats) => {
        let isFile = stats.isFile()//是文件
        let isDir = stats.isDirectory();//是文件夹
        // 判断是否是文件夹
        if (isFile) {

          // 接口文件读取
          let route = (filename in special) ? special[filename] : '/' + filename.replace(/\.js$/i, '').replace(/_/g, '/')
          let question = '';
          if (name) {
            route = '/' + name + route;
            question = require('./module/' + name + '/' + filename);
          } else {
            question = require('./module/' + filename);
          }
          //文件设置
          let query = '';
          app.use(route, question);
        } else {
          fileDisplay(filedir, filename);
        }
      })
    })


  })
}

// 调用接口路由函数
fileDisplay(path.join(__dirname, 'module'));

/**
 * 后台路由
 * @param filePath
 * @param name
 */
function adminDisplay(filePath, name) {
  fs.readdir(filePath, (err, file) => {
    // if(!(/\.js$/i.test(file))) return;
    file.forEach((filename, index) => {
      //获取当前文件的绝对路径
      let filedir = path.join(filePath, filename);
      fs.stat(filedir, (eror, stats) => {
        let isFile = stats.isFile()//是文件
        let isDir = stats.isDirectory();//是文件夹
        // 判断是否是文件夹
        if (isFile) {
          let route = (filename in special) ? special[filename] : '/' + filename.replace(/\.js$/i, '').replace(/_/g, '/')
          let querys = '';
          if (name) {
            route = '/' + name + route;
            querys = require('./admin/' + name + '/' + filename);
          } else {
            querys = require('./admin/' + filename);
          }
          //文件设置
          let query = '';
          app.use(route, querys);
        } else {
          adminDisplay(filedir, filename);
        }
      })
    })


  })
}

// 调用后台路由函数
adminDisplay(path.join(__dirname, 'admin'));

/**
 * 错误捕获
 */
process.on('uncaughtException', (err, origin) => {
  console.log('Caught exception: ' + err);
});

// 连接数据库
mongoose.connect(`mongodb://${config.dbAddress}/${config.dbName}`, {useNewUrlParser: true}, (err) => {
  if (err) {
    console.log('数据库连接失败');
    return
  }
  console.log('数据库连接成功');
  // 渲染前端页面
  app.use(express.static(path.join(__dirname, '../dist')));

  app.listen(3001, () => {
    console.log('后台地址：http://127.0.0.1:3001/login/index/index')
  })
});


module.exports = app;

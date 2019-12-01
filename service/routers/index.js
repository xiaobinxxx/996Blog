var express = require('express');
var router = express.Router();


/*
* 后台文件路由
*/

// 首页
router.get('/index',(req,res,next) =>{
  res.render('admin/index',require('../admin/index/index'))
});
// 登录
router.get('/login',(req,res,next) =>{
  res.render('admin/login',require('../admin/login/index'))
});

module.exports = router;

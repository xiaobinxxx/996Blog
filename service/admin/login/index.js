const express = require('express');
const router = express.Router();
const async = require('async');
const Md5 =require("md5");

// 连接用户数据表
const MemberModel = require('../../dbmodel/member');

/**
 * 登录界面渲染
 */
router.get('/index',(req,res,next) =>{
  // 查询有没有用户，没有创建一个管理员账号
  MemberModel.findOne().then(ress =>{
    if(!ress){
      let Member = new MemberModel({
        username: 'admin',
        password: Md5('admin'),
        nickname: '我是管理员',
        isAdmin: true,
        isBlogger: true,
        description: '我是一个小管理员',
        introduction: '管理权限最大，谁拿我也没有办哦！',
        portrait: '/public/images/portrait.jpg',
        creationTime: new Date(),
        updateTime: new Date(),
      });
      Member.save();
    }
  });

  res.render('admin/login',{
    code: 0,
    message: '成功',
  });
});


module.exports = router;

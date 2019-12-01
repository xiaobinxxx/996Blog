const express = require('express');
const router = express.Router();
const async = require('async');
const Md5 =require("md5");

// 连接用户数据表
const MemberModel = require('../../dbmodel/member');

// 引入统计数据表
const DataStatisticModel = require('../../dbmodel/DataStatistic');

/**
 * 用户注册
 */
router.post('/register',(req,res,next) =>{
  // 账号
  let username = req.body.username||null;
  //  密码
  let password = req.body.password||null;
  // 确认密码
  let RegPassword = req.body.reg_password||null;
  // 昵称
  let nickname = req.body.nickname||null;
  let reg = /^\w+$/;

  // 判断是否输入用户名
  if(!username){
    res.send({
      code: -1,
      message: '请输入用户名或用户名格式错误',
    });
    return;
  }
  if(!reg.test(username)){
    res.send({
      code: -1,
      message: '账号只能为字母和数字的组合',
    });
    return;
  }
  // 判断是否输入密码
  if(!password){
    res.send({
      code: -1,
      message: '请输入密码',
    });
    return;
  }
  // 判断是否输入确认密码
  if(!RegPassword){
    res.send({
      code: -1,
      message: '请输入确认密码',
    });
    return;
  }
  if(!reg.test(RegPassword)){
    res.send({
      code: -1,
      message: '密码只能为字母和数字的组合',
    });
    return;
  }
  // 判断密码和确认密码是否一致
  if(password != RegPassword){
    res.send({
      code: -1,
      message: '两次密码输入的不一致',
    });
    return;
  }
  // 同步处理
  async.series({
    // 查询用户
    FindMember: (callback) =>{
      MemberModel.findOne({
        username: username,
      }).then(ress =>{
        if(ress){
          res.send({
            code: -1,
            message:'账号已存在，换一个试试吧'
          });
          return
        }
        callback(null,ress)
      })
    },
    // 创建用户
    CreatMember: (callback) =>{
      // MD5加密密码
      password = Md5(password);
      //保存用户注册的信息到数据库中
      var member = new MemberModel({
        username: username,
        password: password,
        nickname: nickname,
        creationTime: new Date(),
        updateTime: new Date(),
      });
      callback(null,2);
      return member.save();
    },
  },(err,result) =>{
    res.send({
      code: 0,
      message:'注册成功',
    });
  });
});

/**
 * 用户登录
 */
router.post('/login',(req,res,next) =>{
  // 账号
  let username = req.body.username||null;
  //  密码
  let password = req.body.password||null;

  // 判断是否输入用户名
  if(!username){
    res.send({
      code: -1,
      message: '请输入用户名或用户名格式错误',
    });
    return;
  }
  // 判断是否输入密码
  if(!password){
    res.send({
      code: -1,
      message: '请输入密码',
    });
    return;
  }

  // 同步处理
  async.series({
    // 查询用户
    MemberFind: (callback) =>{
      // MD5加密密码
      password = Md5(password);
      MemberModel.findOne({
        username: username,
        password: password,
      }).then(ress =>{
        callback(null,ress)
      })
    },
    // 统计访问量
    statistics:(callback) =>{
      // 记录用户访问量
      let login_volume = 0;
      DataStatisticModel.findOne().then(ress =>{
        try {
          login_volume = ress.login_volume;
          DataStatisticModel.updateOne({
            login_volume: login_volume+1,
          }).then(s =>{});
          callback(null,ress);
        }catch (e) {
          // 插入新的表
          var DataStatistic = new DataStatisticModel({
            visitor_volume: 0,
            registered_users: 0,
            login_volume: 0,
            adminlogin_volume: 0,
            search_volume: 0,
          });
          DataStatistic.save();
          callback(null,ress);
        }
      });
    },
  },(err,result) =>{
    let MemberInfo = result.MemberFind;
    if(!MemberInfo){
      res.send({
        code: -1,
        message: '账号或密码错误',
      });
      return;
    }
    if(MemberInfo.isDefriend){
      res.send({
        code: -100,
        message: '账号已入黑名单',
      });
      return;
    }
    res.send({
      code: 0,
      data:{
        member_id: MemberInfo._id,
        username: MemberInfo.username,
        description: MemberInfo.description,
        introduction: MemberInfo.introduction,
        portrait: `http://${req.host}${MemberInfo.portrait}`,
        wallpaper: `http://${req.host}${MemberInfo.wallpaper}`,
        nickname: MemberInfo.nickname,
      },
      message: '登录成功'
    });
  });
});

module.exports = router;

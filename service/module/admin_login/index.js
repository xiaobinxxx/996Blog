const express = require('express');
const router = express.Router();
const async = require('async');
const Md5 = require("md5");
const Logs = require('../../util/logs');

// 连接用户数据表
const MemberModel = require('../../dbmodel/member');
// 引入统计数据表
const DataStatisticModel = require('../../dbmodel/DataStatistic');
/**
 * 管理员登录
 */
router.post('/index',(req,res,next) =>{
  let username = req.body.username||null;
  let password = req.body.password||null;

  if(!username){
    res.json({
      code: -1,
      message: '账号不可为空',
    });
    return;
  }

  if(!password){
    res.json({
      code: -1,
      message: '密码不可为空',
    });
    return;
  }
  try {
    DataStatisticModel.findOne().then(ress =>{
      if(!ress){
        // 插入新的表
        var DataStatistic = new DataStatisticModel({
          visitor_volume: 0,
          registered_users: 0,
          login_volume: 0,
          adminlogin_volume: 0,
          search_volume: 0,
        });
        DataStatistic.save();
      }
    });
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
  }
  // 同步方法
  async.series({
    // 查询
    AdminFind: (callback) =>{
      password = Md5(password);
      MemberModel.findOne({
        username: username,
        password: password,
      }).then(ress =>{
        try {
          if(ress && (!ress.isAdmin && !ress.isBlogger)){
            res.json({
              code: -1,
              message: '亲，您还不是管理员哦!'
            });
            return
          }
          if(!ress){
            res.json({
              code: -1,
              message: '账号或密码错误哦！'
            });
            return
          }
        }catch (e) {
          Logs.error(e);
        }
        callback(null,ress);
      })
    },
    // 统计访问量
    statistics:(callback) =>{
      // 记录用户访问量
      let adminlogin_volume = 0;
      DataStatisticModel.findOne().then(ress =>{
        adminlogin_volume = ress.adminlogin_volume;
        DataStatisticModel.updateOne({
          adminlogin_volume: adminlogin_volume+1,
        }).then(s =>{});
        callback(null,ress);
      });
    },
  },(err,result) =>{
    let AdminInfo = result.AdminFind;

    //设置session里面的内容
    req.session.AdminInfo = {
      member_id: AdminInfo._id,
      nickname: AdminInfo.nickname,
      isAdmin: AdminInfo.isAdmin,
      portrait: AdminInfo.portrait,
      isBlogger: AdminInfo.isBlogger,
    };
    res.json({
      code: 0,
      data: {
        member_id: AdminInfo._id,
        nickname: AdminInfo.nickname,
        isAdmin: AdminInfo.isAdmin,
        portrait: AdminInfo.portrait,
      },
      message: '登录成功',
    });
  });
});
/**
 * 退出登录
 */
router.post('/quit',(req,res,next) =>{
  req.session.destroy();
  res.json({
    code: 0,
    message:'退出成功',
  });
});


/**
 * 密码修改
 */
router.post('/changePass',(req,res,next) =>{
  let member_id = req.body.member_id||null;
  let password = req.body.password||null;
  if(!member_id){
    res.json({
      code: -1,
      message: '用户id不可为空',
    });
    return;
  }
  if(!password){
    res.json({
      code: -1,
      message: '密码不可为空',
    });
    return;
  }
  async.series({
    change: (callback) =>{
      // 判断是否是博主
      if (req.session.AdminInfo.isBlogger && !req.session.AdminInfo.isAdmin) {
        res.json({
          code: -1,
          message: '您不是管理员，无此权限',
        });
        return;
      }
      MemberModel.updateOne(
        {
          _id: member_id,
        },{
          password: Md5(password),
        }
      ).then(ress =>{
        callback(null,ress);
      })
    }
  },(err,result) =>{
    res.json({
      code: 0,
      message: '修改成功',
    });
  });
});
module.exports = router;

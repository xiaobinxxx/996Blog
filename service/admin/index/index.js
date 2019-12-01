const express = require('express');
const router = express.Router();
const async = require('async');
const DataStatisticModel = require('../../dbmodel/DataStatistic');
const MemberModel = require('../../dbmodel/member');
// 引入设置表
const SettingModel = require('../../dbmodel/setting');

/**
 * 首页
 */
router.get('/home',(req,res,next) =>{
  let AdminInfo = req.session.AdminInfo;


  async.series({
    // 注册统计
    register_statistics: (callback) =>{
      MemberModel.count().then(ress =>{
        DataStatisticModel.updateOne({
          registered_users: ress,
        }).then(ress =>{});
        callback(null,ress);
      })
    },
    DataFind: (callback) =>{
      DataStatisticModel.findOne().then(ress =>{
          callback(null,ress)
      });
    },
  },(err,result) =>{
    let DataResult = result.DataFind;
    res.render('admin/index',{
      AdminInfo:AdminInfo,
      DataResult: DataResult,
    });
  });
});

/**
 * 设置页面渲染
 */
router.get('/setting',(req,res,next) =>{
  SettingModel.findOne().then(ress =>{
    let settingInfo = ress||{};
    res.render('admin/setting',{
      settingInfo,
    });
  });

});
module.exports = router;

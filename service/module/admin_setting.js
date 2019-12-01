const express = require('express');
const router = express.Router();
const async = require('async');

// 引入设置表
const SettingModel = require('../dbmodel/setting');

router.post('/logo',(req,res,next) =>{
  let logo_url = req.body.logo_url||null;
// // 插入新的分类
//   var Setting = new SettingModel({
//     logo_url: '',
//   });
//   Setting.save();
  if(!logo_url){
    res.json({
      code: -1,
      message: '地址不可为空',
    });
    return;
  }
  // 同步方法
  async.series({
    updateLogo: (callback) =>{
      SettingModel.updateOne({
        logo_url: logo_url,
      }).then(ress =>{
        callback(null,ress);
      })
    }
  },(err,result) =>{
    res.json({
      code: 0,
      message: '更新成功',
    });
  });
});
module.exports = router;

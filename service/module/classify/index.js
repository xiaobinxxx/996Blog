const express = require('express');
const router = express.Router();
const async = require('async');
// 连接分类表
const ClassifyModel = require('../../dbmodel/classify');


/**
 * 分类列表查询
 */
router.get('/list', (req, res, next) => {
  async.series({
    ClassFind: (callback) => {
      ClassifyModel.find().then(ress => {
        
        callback(null, ress)
      });
    },
  },(err,result) =>{
    let ClassList = result.ClassFind;
    let arr = [];
    // 循环重新赋值
    for(let i = 0; i < ClassList.length;i++){
      arr.push({
        class_id: ClassList[i]._id.toString(),
        title: ClassList[i].classify_name,
      });
    }
    res.send({
      code: 0,
      data: arr,
      message: '成功',
    })
  });

});

module.exports = router;

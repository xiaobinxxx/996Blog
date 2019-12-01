const express = require('express');
const router = express.Router();
const async = require('async');

// 导入友情链接表
const BlogrollsModel = require('../../dbmodel/blogroll');

router.get('/BlogrollList',(req,res,next) =>{
  // 同方法
  async.series({
    // 查询友情链接数据
    BlogrollFind: (callback) =>{
      BlogrollsModel.find().then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let BlogrollList = result.BlogrollFind.map(function (item) {
      return{
        blogroll_id:item._id.toString(),
        link_name: item.link_name,
        link_url: item.link_url,
      }
    });
    res.json({
      code: 0,
      data: BlogrollList,
      message: '成功'
    });
  });

});

module.exports = router;

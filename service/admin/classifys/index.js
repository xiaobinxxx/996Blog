const express = require('express');
const router = express.Router();
const async = require('async');

// 连接分类表
const ClassifyModel = require('../../dbmodel/classify');

/**
 * 分类列表
 */
router.get('/list',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 10;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');

  // 同步方法
  async.series({
    // 查询总条数
    ClassCount:(callback) =>{
      ClassifyModel.count(
        {
          $or : [ //多条件，数组
            {classify_name : {$regex : reg}},
          ],
        }
      ).then(ress =>{
        counts = ress;
        //计算总页数
        pages = Math.ceil(counts / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );
        skip = (page - 1) * limit;
        callback(null,ress);
      })
    },
    // 查询分类列表
    ClassFind: (callback) =>{
      ClassifyModel.find(
        {
          $or : [ //多条件，数组
            {classify_name : {$regex : reg}},
          ],
        }
      ).sort({
        _id: -1,
      }).then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let ClassifyList = result.ClassFind.map(function (item) {
      return{
        class_id:item._id,
        classify_name:item.classify_name,
      }
    });
    //
    let page_for = new Array(pages).fill(1);
    res.render('admin/ClassifyAdmin',{
      code: 0,
      ClassifyList,
      page: page,
      limit: limit,
      total: counts,
      pages: pages,
      page_for: page_for,
      keyword: keyword,
      AdminInfo: req.session.AdminInfo,
    });
  });
});

module.exports = router;

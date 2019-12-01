const express = require('express');
const router = express.Router();
const async = require('async');

// 连接分类表
const ClassifyModel = require('../../dbmodel/classify');
// 连接文章表
const ArticleModel = require('../../dbmodel/article');

/**
 * 文章列表
 */
router.get('/ArticesList',(req,res,next) =>{
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
    ArticleCount:(callback) =>{
      ArticleModel.count(
        {
          $or : [ //多条件，数组
            {title : {$regex : reg}},
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
    // 查询文章
    ArticleFind: (callback) =>{
      ArticleModel.find(
        {
          $or : [ //多条件，数组
            {title : {$regex : reg}},
          ],
        }
      ).limit(limit).skip(skip).populate('class_id').sort({
        release_time: -1,
      }).then(ress =>{
        callback(null,ress);
      });
    },
  },(err,resulst) =>{
    let ArticleList = resulst.ArticleFind.map(function (item) {
      return{
        article_id:item._id.toString(),
        classify:item.class_id,
        release_time:item.release_time,
        modification_time:item.modification_time,
        author:item.author,
        pageview:item.pageview,
        comments:item.comments,
        title:item.title,
        description:item.description,
        article_cover: item.article_cover
      }
    });
    let page_for = new Array(pages).fill(1);
    res.render('admin/ArticlesAdmin',{
      code: 0,
      ArticleList: ArticleList,
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

/**
 * 添加文章页面渲染
 */
router.get('/ArticleAdd',(req,res,next) =>{
  // 同步方法
  async.series({
    // 查询分类列表
    ClassFind: (callback) =>{
      ClassifyModel.find().then(ress =>{
        callback(null,ress);
      })
    }
  },(err,result) =>{
    let ClassifyList = result.ClassFind.map(function (item) {
      return{
        class_id:item._id.toString(),
        classify_name:item.classify_name,
      }
    });
    res.render('admin/ArticlesEdit',{
      code: 0,
      ClassifyList: ClassifyList,
      AdminInfo: req.session.AdminInfo,
    });
  });

});

/**
 * 修改文章页面渲染
 */
router.get('/ArticleEdit',(req,res,next) =>{
  var Article_id = req.query.article_id||null;
  if(!Article_id){
    res.render('admin/HintPage',{
      code: -1,
      message: '文章id不可为空'
    });
    return;
  }

  // 同步方法
  async.series({
    // 查询文章
    ArticlesFind: (callback) =>{
      ArticleModel.findOne({
        _id: Article_id,
      }).populate('class_id').then(ress =>{
        if(!ress){
          res.render('admin/HintPage',{
            code: -1,
            message: '未找到文章'
          });
         return;
        }
        callback(null,ress);
      })
    },
    // 查询分类列表
    ClassFind: (callback) =>{
      ClassifyModel.find().then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let ArticleInfo = result.ArticlesFind;
    let ClassifyList = result.ClassFind.map(function (item) {
      return{
        class_id:item._id.toString(),
        classify_name:item.classify_name,
      }
    });
    res.render('admin/ArticlesEdit',{
      code: 0,
      ArticleInfo: {
        title: ArticleInfo.title,
        description: ArticleInfo.description,
        content: ArticleInfo.content,
        class_id: ArticleInfo.class_id._id.toString(),
        article_cover: ArticleInfo.article_cover,
        author: ArticleInfo.author,
        content_edit: ArticleInfo.content_edit,
      },

      ClassifyList: ClassifyList,
      article_id: Article_id,
      AdminInfo: req.session.AdminInfo,
    });
  });
});

module.exports = router;

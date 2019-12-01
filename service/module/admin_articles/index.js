const express = require('express');
const router = express.Router();
const async = require('async');


// 连接分类表
const ClassifyModel = require('../../dbmodel/classify');
// 连接文章表
const ArticleModel = require('../../dbmodel/article');

/**
 * 添加文章,修改文章
 */
router.post('/ArticlesEdit',(req,res,next) =>{
  let title = req.body.title||null;
  let description = req.body.description||null;
  let content = req.body.content||null;
  let class_id = req.body.class_id||null;
  let author = req.body.author||null;
  let article_cover = req.body.article_cover||null;
  let content_edit = req.body.content_edit||null;
  let article_id = req.body.article_id||null;
  let article_type = req.body.article_type; // 0 添加文章 1 修改文章

  if(parseInt(article_type) === 1 && !article_id){
    res.json({
      code: -1,
      message:'修改文章文章id不可为空',
    });
    return;
  }
  if(!title){
    res.json({
      code: -1,
      message:'标题不可为空',
    });
    return;
  }
  if(!description){
    res.json({
      code: -1,
      message:'描述不可为空',
    });
    return;
  }
  if(!content){
    res.json({
      code: -1,
      message:'内容不可为空',
    });
    return;
  }
  if(!class_id){
    res.json({
      code: -1,
      message:'分类id不可为空',
    });
    return;
  }
  if(!article_cover){
    res.json({
      code: -1,
      message:'封面不可为空',
    });
    return;
  }

  // 判断是否是博主
  if (req.session.AdminInfo.isBlogger && !req.session.AdminInfo.isAdmin) {
    res.json({
      code: -1,
      message: '您不是管理员，无此权限',
    });
    return;
  }
  // 同步方法
  async.series({
    // 添加文章
    ArticleAdd: (callback) =>{
      // 判断是否添加文章
      if(parseInt(article_type) === 0){
        var Article = new ArticleModel({
          title: title,
          description: description,
          content: content,
          class_id: class_id,
          article_cover: article_cover,
          author: author,
          content_edit:content_edit,
          modification_time: new Date().toString(),
          release_time: new Date().toString(),
        });
        Article.save();
        callback(null,1);
        return
      }
      callback(null,1)
    },
    // 更新文章
    ArticleUpdate: (callback) =>{
      // 判断是否是修改文章
      if(parseInt(article_type) === 1){
        ArticleModel.updateOne(
          {
            _id: article_id,
          },
          {
            title: title,
            description: description,
            content: content,
            class_id: class_id,
            article_cover: article_cover,
            author: author,
            content_edit:content_edit,
            modification_time: new Date().toString(),
          }
        ).then(ress =>{
          callback(null,2);
        });
        return
      }
      callback(null,2)
    },
  },(err,result) =>{
    res.json({
      code: 0,
      message: '成功',
    });
  });
});

/**
 * 删除文章
 */
router.post('/ArticlesDel',(req,res,next) =>{
  let article_id = req.body.article_id||null;

  if(!article_id){
    res.json({
      code: -1,
      message: '分类id不可为空',
    });
    return;
  }
// 判断是否是博主
  if (req.session.AdminInfo.isBlogger && !req.session.AdminInfo.isAdmin) {
    res.json({
      code: -1,
      message: '您不是管理员，无此权限',
    });
    return;
  }
  async.series({
    // 删除文章
    ArticlesDel: (callback) =>{
      ArticleModel.deleteOne({
        _id: article_id
      }).then(ress =>{
        callback(null,ress);
      });
    }
  },(err,result) =>{
    res.json({
      code: 0,
      message: '删除成功',
    });
  });
});
module.exports = router;

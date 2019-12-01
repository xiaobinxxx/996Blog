const express = require('express');
const router = express.Router();
const async = require('async');

// 导入评论表
const CommentModel = require('../dbmodel/comment');
// 导入文章表
const ArticleModel = require('../dbmodel/article');
// 导入用户表
const MemberModel = require('../dbmodel/member');
/**
 * 发表评论
 */
router.post('/PublishComment',(req,res,next) =>{
  let member_id = req.headers.token||null;
  let content = req.body.content||null;
  let article_id = req.body.article_id||null;
  let counts = 0;

  if(!member_id){
    res.json({
      code: -1,
      message: '会员id不可为空',
    });
    return;
  }

  if(!content){
    res.json({
      code: -1,
      message: '内容不可为空',
    });
    return;
  }
  if(!article_id){
    res.json({
      code: -1,
      message: '文章id不可为空',
    });
    return;
  }
  // 同步方法
  async.series({
    // 查询用户
    findUser: (callback) =>{
      MemberModel.findOne({
        _id: member_id,
      }).then(ress =>{
        if(!ress){
          res.json({
            code: -1,
            message: '用户参数错误，请检查是否存在此用户'
          });
          return;
        }
        callback(null,ress);
      })
    },
    // 文章查询
    articleFind:(callback) =>{
      ArticleModel.findOne({
        _id: article_id,
      }).then(ress =>{
        if(!ress){
          res.json({
            code: -1,
            message: '文章参数错误，请检查是否存在此文章'
          });
          return;
        }
        callback(null,ress);
      });
    },
    // 添加评论
    addComment: (callback) =>{
      let Comment = new CommentModel({
        content: content,
        member_id: member_id,
        article_id: article_id,
        creation_time: new Date().getTime()
      });
      Comment.save();
      callback(null,2);
    },
    // 查询总条数
    CommentCount:(callback) =>{
      CommentModel.count({
        article_id: article_id,
      }).then(ress =>{
        counts = ress;
        callback(null,ress);
      })
    },
    // 增加评论数量
    AddCmments: (callback) =>{
      ArticleModel.updateOne(
        {
          _id: article_id,
        },
        {
          comments: counts,
        }
      ).then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    res.json({
      code: 0,
      message: '评论成功'
    });
  });
});

/**
 * 获取评论列表
 */
router.get('/CommentList',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 10;
  let skip = (page - 1) * limit;
  let counts = 0;
  let article_id = req.query.article_id||null;
  if(!article_id){
    res.json({
      code: -1,
      message: '文章id不可为空',
    });
    return;
  }

  // 同步
  async.series({
    // 查询总条数
    CommentCount:(callback) =>{
      CommentModel.count({
        article_id: article_id,
      }).then(ress =>{
        counts = ress;
        //计算总页数
        pages = Math.ceil(counts / limit);
        callback(null,ress);
      })
    },
    // 查询评论列表
    findCommentList: (callback) =>{
      CommentModel.find({
        article_id: article_id,
      }).sort({
        _id: -1,
      }).limit(limit).skip(skip).populate('member_id').then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let CommentList = result.findCommentList.map(function (item) {
      return{
        comment_id:item._id.toString(),
        content:item.content,
        nickname: item.member_id.nickname,
        portrait: item.member_id.portrait,
        creation_time: item.creation_time,
      }
    });
    res.json({
      code: 0,
      result: CommentList,
      page: page,
      limit: limit,
      total: counts,
      pages: pages,
    });
  });
});
module.exports = router;

const express = require('express');
const router = express.Router();
const async = require('async');
// const Global = require('/util/Global');

// 导入文章表
const ArticleModel = require('../../dbmodel/article');
// 导入广告表
const AdvertisingModel = require('../../dbmodel/advertising');
// 导入用户表
const MemberModel = require('../../dbmodel/member');
// 引入统计数据表
const DataStatisticModel = require('../../dbmodel/DataStatistic');
/**
 * 最新文章列表
 */
router.get('/new/article_list',(req,res,next) =>{
  let config = req.session.config;
  var page = Number(req.query.page)||1;
  var pages = 0;
  var limit = 10;
  var skip = (page - 1) * limit;
  var counts = 0;

   async.series({
     // 查询总数
     ArticleCount: (callback) =>{
       ArticleModel.count().then(ress =>{
         counts = ress;
         callback(null,ress)
       })
     },
     // 查询
     ArticleFind: (callback) =>{
       ArticleModel.find().limit(limit).skip(skip).populate(['class_id']).sort({
         release_time: -1
       }).then(ress =>{
         callback(null,ress)
       })
     },
     // 统计访问量
     statistics:(callback) =>{
       // 记录用户访问量
       let visitor_volume = 0;
       DataStatisticModel.findOne().then(ress =>{
         visitor_volume = ress.visitor_volume;
         DataStatisticModel.updateOne({
           visitor_volume: visitor_volume+1,
         }).then(s =>{});
         callback(null,ress);
       });
     },
   },(err,result) =>{
     let ArticleList = result.ArticleFind.map(function (item) {
       return{
         article_id:item._id,
         classify:item.class_id,
         release_time:item.release_time.toString(),
         modification_time:item.modification_time.toString(),
         author:item.author,
         pageview:item.pageview,
         comments:item.comments,
         title:item.title,
         description:item.description,
         article_cover: `${req.session.config.host}${item.article_cover}`,
       }
     });
     res.send({
       code: 0,
       data:{
         data:ArticleList,
         page: page,
         limit: limit,
         total: counts,
       },
       message:'成功',
     })
   });
});

/**
 * 热门、点击文章列表
 */
router.get('/hotclick/article_list',(req,res,next) =>{
  let counts = 0;
  let limit = 6;
  async.series({
    // 查询总数
    ArticleCount: (callback) =>{
      ArticleModel.count().then(ress =>{
        counts = ress;
        callback(null,ress)
      })
    },
    // 查询热门文章
    ArticleFind: (callback) =>{
      ArticleModel.find().limit(limit).sort({
        comments: -1
      }).then(ress =>{
        callback(null,ress)
      })
    },
    // 查询点击排行
    ArticleClickFind: (callback) =>{
      ArticleModel.find().limit(limit).sort({
        pageview: -1
      }).then(ress =>{

        callback(null,ress)
      })
    },
    // 查询banner
    ClickBannerFind: (callback) =>{
      AdvertisingModel.find({
        ad_type: 1,
      }).limit(3).then(ress =>{
        callback(null,ress)
      })
    },
  },(err,result) =>{
    let HotArticleList = result.ArticleFind.map(function (item) {
      return{
        article_id:item._id,
        classify:item.class_id,
        pageview:item.pageview,
        comments:item.comments,
        title:item.title,
        description:item.description,
        article_cover: `${req.session.config.host}${item.article_cover}`
      }
    });
    let ArticleClickList = result.ArticleClickFind.map(function (item) {
      return{
        article_id:item._id,
        classify:item.class_id,
        pageview:item.pageview,
        comments:item.comments,
        title:item.title,
        description:item.description,
        article_cover: `${req.session.config.host}${item.article_cover}`
      }
    });
    let ClickBanner = result.ClickBannerFind.map(function (item) {
      return{
        adv_id:item._id,
        ad_cover: `${req.session.config.host}${item.ad_cover}`,
        skip_link: item.skip_link,
        article_id: item.article_id,
        ad_skip: item.ad_skip,
      }
    });
    res.send({
      code: 0,
      data: {
        HotArticleList: HotArticleList,
        ArticleClickList: ArticleClickList,
        ClickBanner: ClickBanner,
      },
      message: '成功',
    });
  });
});

/**
 * 文章详情
 */
router.get('/details',(req,res,next) =>{
  let article_id = req.query.article_id||null;
  let pageview = 0;
  if(!article_id){
    res.send({
      code: -1,
      message: 'article_id不可为空'
    });
    return;
  }

  // 同步方法
  async.series({
    // 查询单个文章
    ArticleFind: (callback) =>{
      ArticleModel.findOne({
        _id: article_id,
      }).populate(['class_id']).then(ress =>{
        pageview = ress.pageview;
        callback(null,ress);
      })
    },
    //更新点击
    ArticleUpdate: (callback) =>{
      ArticleModel.updateOne(
        {
          _id: article_id,
        },
        {
          pageview: pageview+1
        }
      ).then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let ArticleInfo = {};
    ArticleInfo['article_id'] = result.ArticleFind._id;
    ArticleInfo['classify'] = result.ArticleFind.class_id;
    ArticleInfo['pageview'] = result.ArticleFind.pageview;
    ArticleInfo['comments'] = result.ArticleFind.comments;
    ArticleInfo['description'] = result.ArticleFind.description;
    ArticleInfo['article_cover'] = `${req.session.config.host}${result.ArticleFind.article_cover}`;
    ArticleInfo['release_time'] = result.ArticleFind.release_time;
    ArticleInfo['modification_time'] = result.ArticleFind.modification_time;
    ArticleInfo['title'] = result.ArticleFind.title;
    ArticleInfo['author'] = result.ArticleFind.author;
    ArticleInfo['commentArr'] = result.ArticleFind.commentArr;
    ArticleInfo['content'] = result.ArticleFind.content;
    ArticleInfo['content_edit'] = result.ArticleFind.content_edit;
    res.send({
      code: 0,
      data: ArticleInfo,
      message: '成功',
    })
  });
});

/**
 * 文章列表
 */
router.get('/article/list',(req,res,next)=>{
  let class_id = req.query.class_id||0;
  var page = Number(req.query.page)||1;
  var pages = 0;
  var limit = 10;
  var skip = (page - 1) * limit;
  var counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');

  // if(!class_id){
  //   res.send({
  //     code: -1,
  //     message: 'article_id不可为空'
  //   });
  //   return;
  // }
  // 同步方法
  async.series({
    // 查询总数
    ArticleCount: (callback) =>{
      if(parseInt(class_id) === 0){
        ArticleModel.count({
          $or : [ //多条件，数组
            {title : {$regex : reg}},
          ]
        }).then(ress =>{
          counts = ress;
          callback(null,ress)
        });
        return
      }
      ArticleModel.count({
        class_id,
        $or : [ //多条件，数组
          {title : {$regex : reg}},
        ]
      }).then(ress =>{
        counts = ress;
        callback(null,ress)
      })
    },
    // 查询文章
    ArticleFind: (callback) =>{
      // 判断class_id 是否为0 0为搜索查询
      if(parseInt(class_id) === 0){
        ArticleModel.find({
          $or : [ //多条件，数组
            {title : {$regex : reg}},
          ]
        }).limit(limit).skip(skip).populate(['class_id']).then(ress =>{
          // 记录用搜索量
          let search_volume = 0;
          DataStatisticModel.findOne().then(ress =>{
            search_volume = ress.search_volume;
            DataStatisticModel.updateOne({
              search_volume: search_volume+1,
            }).then(s =>{});
          });
          callback(null,ress);
        });
        return;
      }
      ArticleModel.find({
        class_id,
        $or : [ //多条件，数组
          {title : {$regex : reg}},
        ]
      }).limit(limit).skip(skip).populate(['class_id']).then(ress =>{
        callback(null,ress);
      })

    }
  },(err,result) =>{
    let ArticleList = result.ArticleFind.map(function (item) {
      return{
        article_id:item._id,
        classify:item.class_id,
        release_time:item.release_time,
        modification_time:item.modification_time,
        author:item.author,
        pageview:item.pageview,
        comments:item.comments,
        title:item.title,
        description:item.description,
        article_cover: `${req.session.config.host}${item.article_cover}`
      }
    });
    res.json({
      code: 0,
      data:{
        data:ArticleList,
        page: page,
        limit: limit,
        total: counts,
      },
      message: '成功'
    })
  });
});

module.exports = router;

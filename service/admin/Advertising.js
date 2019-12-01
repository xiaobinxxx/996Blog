const express = require('express');
const router = express.Router();
const async = require('async');

// 导入广告表
const AdvertisingModel = require('../dbmodel/advertising');
// 连接文章表
const ArticleModel = require('../dbmodel/article');
// 导入标签表
const BlogrollsModel = require('../dbmodel/blogroll');
/**
 * 广告列表页面渲染
 */
router.get('/adertisngList',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 10;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');

  async.series({
    // 查询总条数
    ArticleCount:(callback) =>{
      AdvertisingModel.count().then(ress =>{
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
    // 查询广告列表
    AdvertisingFind: (callback) =>{
      AdvertisingModel.find().limit(limit).skip(skip).sort({
        _id: -1,
      }).then(ress =>{
        callback(null,ress);
      });
    },
  },(err,result) =>{
    let AdvertisingList = result.AdvertisingFind.map(function (item) {
      return{
        adv_id:item._id.toString(),
        ad_type: item.ad_type,
        ad_cover: item.ad_cover,
        ad_skip: item.ad_skip,
      }
    });

    let page_for = new Array(pages).fill(1);
    res.render('admin/AdvertisingAdmin',{
      AdvertisingList: AdvertisingList,
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
 * 添加广告页面渲染
 */
router.get('/adertisngAdd',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 5;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');
  let Adv_type = req.query.Adv_type||null;
  let adv_id = req.query.adv_id||null;
  async.series({
    // 查询总条数
    ArticleCount:(callback) =>{
      ArticleModel.count().then(ress =>{
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
    // 查询文章列表
    ArticleFind: (callback) =>{
      ArticleModel.find().limit(limit).skip(skip).populate('class_id').sort({
        release_time: -1,
      }).then(ress =>{
        callback(null,ress);
      });
    },
    // 查询已选广告
    AdvFind: (callback) =>{
      if(parseInt(Adv_type) === 0){
        callback(null,null);
        return;
      }
      AdvertisingModel.findOne({
        _id: adv_id
      }).then(ress =>{
        ArticleModel.findOne({
          _id: ress.article_id,
        }).then(resss =>{
          let info = {
            ad_type: ress.ad_type,
            ad_cover: ress.ad_cover,
            ad_skip: ress.ad_skip,
            article_id: ress.article_id,
            skip_link: ress.skip_link,
            _id: ress._id.toString(),
            title: resss?resss.title:'',
          };
          callback(null,info);
        })
      })
    },
  },(err,result) =>{
    let ArticleList = result.ArticleFind.map(function (item) {
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
    let AdvInfo = result.AdvFind||null;
    let page_for = new Array(pages).fill(1);
    res.render('admin/AdvertisingEdit',{
      ArticleList: ArticleList,
      Adv_type: Adv_type,
      AdvInfo: AdvInfo,
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
 * 标签列表渲染
 */
router.get('/TagList',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 10;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');
  // 同方法
  async.series({
    // 查询总条数
    BlogrollCount:(callback) =>{
      BlogrollsModel.count({
        $or : [ //多条件，数组
          {link_name : {$regex : reg}},
        ],
      }).then(ress =>{
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
    // 查询友情链接数据
    BlogrollFind: (callback) =>{
      BlogrollsModel.find({
        $or : [ //多条件，数组
          {link_name : {$regex : reg}},
        ],
      }).limit(limit).skip(skip).sort({
        _id: -1,
      }).then(ress =>{
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
    let page_for = new Array(pages).fill(1);
    res.render('admin/TagList',{
      BlogrollList:BlogrollList,
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
 * 标签添加页面渲染
 */
router.get('/TagAdd',(req,res,next) =>{
  res.render('admin/TagAdd');
});
module.exports = router;

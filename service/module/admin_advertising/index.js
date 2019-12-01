const express = require('express');
const router = express.Router();
const async = require('async');

// 导入广告表
const AdvertisingModel = require('../../dbmodel/advertising');
// 连接文章表
const ArticleModel = require('../../dbmodel/article');
// 导入标签表
const BlogrollsModel = require('../../dbmodel/blogroll');

/**
 * 文章列表
 */
router.get('/ArticlseList', (req, res, next) => {
  let page = Number(req.query.page) || 1;
  let pages = 0;
  let limit = 5;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword || '';
  let reg = new RegExp(keyword, 'i');

  async.series({
    // 查询总条数
    ArticleCount: (callback) => {
      ArticleModel.count().then(ress => {
        counts = ress;
        //计算总页数
        pages = Math.ceil(counts / limit);
        callback(null, ress);
      })
    },
    // 查询文章列表
    ArticleFind: (callback) => {
      ArticleModel.find().limit(limit).skip(skip).populate('class_id').sort({
        release_time: -1,
      }).then(ress => {
        callback(null, ress);
      });
    },
  }, (err, result) => {
    let ArticleList = result.ArticleFind.map(function (item) {
      return {
        article_id: item._id.toString(),
        classify: item.class_id,
        release_time: item.release_time,
        modification_time: item.modification_time,
        author: item.author,
        pageview: item.pageview,
        comments: item.comments,
        title: item.title,
        description: item.description,
        article_cover: item.article_cover
      }
    });

    let page_for = new Array(pages).fill(1);
    res.json({
      code: 0,
      data: ArticleList,
      page: page,
      limit: limit,
      total: counts,
      pages: pages,
      page_for: page_for,
      keyword: keyword,
    });
  });
});
/**
 * 添加广告
 */
router.post('/advEdit', (req, res, next) => {
  let ad_type = req.body.ad_type || null;
  let ad_cover = req.body.ad_cover || null;
  let ad_skip = req.body.ad_skip || null;
  let article_id = req.body.article_id || null;
  let skip_link = req.body.skip_link || null;
  let Adv_type = req.body.Adv_type || null;
  let Adv_id = req.body.Adv_id || null;
  if (parseInt(Adv_type) === 1 && !Adv_id) {
    res.json({
      code: -1,
      message: '广告id不可为空',
    });
    return;
  }
  if (!ad_type) {
    res.json({
      code: -1,
      message: '广告类型不可为空',
    });
    return;
  }
  if (!ad_cover) {
    res.json({
      code: -1,
      message: '广告封面不可为空',
    });
    return;
  }
  if (!ad_skip) {
    res.json({
      code: -1,
      message: '跳转方式不可为空',
    });
    return;
  }
  if (parseInt(ad_skip) === 0 && !article_id) {
    res.json({
      code: -1,
      message: '文章不可为空',
    });
    return;
  }
  if (parseInt(ad_skip) === 1 && !skip_link) {
    res.json({
      code: -1,
      message: '跳转链接不可为空',
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
  // 同步方式
  async.series({
    AdvertisingAdd: (callback) => {
      if (parseInt(Adv_type) === 0) {
        var Advertising = new AdvertisingModel({
          ad_type: ad_type,
          ad_cover: ad_cover,
          ad_skip: ad_skip,
          article_id: article_id,
          skip_link: skip_link,
        });
        Advertising.save();
        callback(null, 1);
        return
      }
      callback(null, 1)
    },
    AdvertisingEdit: (callback) => {
      if (parseInt(Adv_type) === 1) {
        AdvertisingModel.updateOne(
          {
            _id: Adv_id,
          },
          {
            ad_type: ad_type,
            ad_cover: ad_cover,
            ad_skip: ad_skip,
            article_id: article_id,
            skip_link: skip_link,
          }
        ).then(ress => {
          callback(null, 2);
        })
        return
      }
      callback(null, 2);
    }
  }, (err, result) => {
    res.json({
      code: 0,
      message: '成功',
    });
  });
});

/**
 * 删除广告
 */
router.post('/AdvDel', (req, res, next) => {
  let adv_id = req.body.adv_id || null;

  if (!adv_id) {
    res.json({
      code: -1,
      message: '广告id不可为空',
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
    advDel: (callback) => {
      AdvertisingModel.deleteOne({
        _id: adv_id
      }).then(res => {
        callback(null, 1);
      });
    }
  }, (err, result) => {
    res.json({
      code: 0,
      message: '删除成功',
    });
  });
});

/**
 * 修改标签
 */
router.post('/TagEdit', (req, res, next) => {
  let blogroll_id = req.body.blogroll_id || null;
  let link_name = req.body.link_name || null;
  let link_url = req.body.link_url || null;

  if (!blogroll_id) {
    res.json({
      code: -1,
      message: '标签id不可为空'
    });
    return;
  }
  if (!link_name) {
    res.json({
      code: -1,
      message: '标签名字不可为空'
    });
    return;
  }
  if (!link_url) {
    res.json({
      code: -1,
      message: '跳转链接不可为空'
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
    TagUpdate: (callback) => {
      BlogrollsModel.updateOne(
        {
          _id: blogroll_id,
        },
        {
          link_name: link_name,
          link_url: link_url,
        }
      ).then(ress => {
        callback(null, ress);
      })
    }
  }, (err, result) => {
    res.json({
      code: 0,
      message: '修改成功'
    });
  });
});
/**
 * 添加标签
 */
router.post('/TagAdd', (req, res, next) => {
  let link_name = req.body.link_name || null;
  let link_url = req.body.link_url || null;

  if (!link_name) {
    res.json({
      code: -1,
      message: '标签标题不可为空',
    });
    return;
  }
  if (!link_url) {
    res.json({
      code: -1,
      message: '标签跳转链接不可为空',
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
    TagAdd: (callback) => {
      var Blogrolls = new BlogrollsModel({
        link_name: link_name,
        link_url: link_url,
      });
      Blogrolls.save();
      callback(null, 1);
    },
  }, (err, result) => {
    res.json({
      code: 0,
      message: '添加成功',
    });
  });
});
/**
 * 删除标签
 */
router.post('/TagDel', (req, res, next) => {
  let blogroll_id = req.body.blogroll_id || null;

  if (!blogroll_id) {
    res.json({
      code: -1,
      message: 'id不可为空',
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
    TagDel: (callback) => {
      BlogrollsModel.deleteOne({
        _id: blogroll_id
      }).then(res => {
        callback(null, 1);
      });
    }
  }, (err, result) => {
    res.json({
      code: 0,
      message: '删除成功',
    });
  })
});
module.exports = router;

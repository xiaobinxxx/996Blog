const express = require('express');
const router = express.Router();
const async = require('async');

// 连接分类表
const ClassifyModel = require('../../dbmodel/classify');
// 导入文章表
const ArticleModel = require('../../dbmodel/article');

/**
 * 添加分类
 */
router.post('/ClassAdd', (req, res, next) => {
  let classify_name = req.body.classify_name || null;

  if (!classify_name) {
    res.json({
      code: -1,
      message: '分类内容不可为空',
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
    // 查询有没有重复的分类名称
    ClassFind: (callback) => {
      ClassifyModel.findOne({
        classify_name,
      }).then(ress => {
        if (ress) {
          res.send({
            code: -1,
            message: '已存在此分类名称'
          });
          return
        }
        // 插入新的分类
        var Classify = new ClassifyModel({
          classify_name: classify_name,
        });
        Classify.save();
        callback(null, ress);
      })
    }
  }, (err, result) => {
    res.json({
      code: 0,
      message: '添加成功',
    });
  });
});
/**
 * 删除分类
 */
router.post('/ClassDel',(req,res) => {
  let class_id = req.body.class_id || null;
  let isArticles = false;
  if (!class_id) {
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
  // 同步方法
  async.series({
    // 查询分类下是否存在文章
    ArticlesFind: (callback) => {
      ArticleModel.findOne({
        class_id: class_id,
      }).then(ress => {
        if (ress) {
          res.json({
            code: -1,
            message: '该分类下存在文章，请先删除文章'
          });
          return;
        }
        callback(null, ress);
      })
    },
    // 删除分类
    ClassDel: (callback) => {
      ClassifyModel.deleteOne({
        _id: class_id,
      }).then(ress => {
        callback(null, ress);
      })
    },
  }, (err, result) => {
    res.json({
      code: 0,
      message: '删除成功',
    })
  });
});

/**
 * 修改分类名称
 */
router.post('/edit', (req, res,next) => {
  let class_id = req.body.class_id || null;
  let classify_name = req.body.classify_name || null;

  if (!class_id) {
    res.json({
      code: -1,
      message: '分类id不可为空',
    });
    return;
  }

  if (!classify_name) {
    res.json({
      code: -1,
      message: '分类名称不可为空',
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
    ClassUpdate: (callback) => {
      ClassifyModel.update(
        {
          _id: class_id,
        },
        {
          classify_name: classify_name,
        }
      ).then(ress => {
        callback(null, ress);
      });
    },
  }, (err, result) => {
    res.json({
      code: 0,
      message: '修改成功',
    });
  });
});
module.exports = router;

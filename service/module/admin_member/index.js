const express = require('express');
const router = express.Router();
const async = require('async');

// 连接用户数据表
const MemberModel = require('../../dbmodel/member');

/**
 * 会员拉黑
 */
router.post('/defriend', (req, res, next) => {
  let member_id = req.body.member_id || null;
  let isAdmin = false;
  if (!member_id) {
    res.json({
      code: -1,
      message: '用户id可为空',
    });
    return;
  }
  // 同步方法
  async.series({
    // 查询用户是否是管理员
    MemberFind: (callback) => {
      MemberModel.findOne({
        _id: member_id,
      }).then(ress => {
        if (ress) {
          isAdmin = ress.isAdmin;
        }
        callback(null, ress);
      })
    },
    // 更新把用户拉入黑名单
    MemberUpdate: (callback) => {
      // 判断是否是管理员
      if (isAdmin) {
        res.json({
          code: -1,
          message: '管理员不允许拉黑',
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
      MemberModel.updateOne(
        {
          _id: member_id,
        },
        {
          isDefriend: true
        }
      ).then(ress => {
        callback(null, ress);
      })
    },
  }, (err, result) => {
    res.json({
      code: 0,
      message: '拉黑成功',
    });
  });
});

/**
 * 会员移出黑名单
 */
router.post('/shiftOut', (req, res, next) => {
  let member_id = req.body.member_id || null;
  let isAdmin = false;
  if (!member_id) {
    res.json({
      code: -1,
      message: '用户id可为空',
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
    // 更新把用户移出黑名单
    MemberUpdate: (callback) => {
      MemberModel.updateOne(
        {
          _id: member_id,
        },
        {
          isDefriend: false
        }
      ).then(ress => {
        callback(null, ress);
      })
    },
  }, (err, result) => {

    res.json({
      code: 0,
      message: '移出成功',
    });
  });
});
module.exports = router;

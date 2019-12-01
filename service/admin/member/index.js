const express = require('express');
const router = express.Router();
const async = require('async');

// 连接用户数据表
const MemberModel = require('../../dbmodel/member');

/**
 * 会员列表
 */
router.get('/management',(req,res,next) =>{
  let page = Number(req.query.page)||1;
  let pages = 0;
  let limit = 10;
  let skip = (page - 1) * limit;
  let counts = 0;
  let keyword = req.query.keyword||'';
  let reg = new RegExp(keyword, 'i');
  
  // 同步方法
  async.series({
    // 查询总数
    ArticleCount: (callback) =>{
      MemberModel.count(
        {
          $or : [ //多条件，数组
            {username : {$regex : reg}},
            {nickname : {$regex : reg}},
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
        callback(null,ress)
      })
    },
    // 查找用户
    MemberFind: (callback) =>{
      MemberModel.find(
        {
          $or : [ //多条件，数组
            {username : {$regex : reg}},
            {nickname : {$regex : reg}},
          ],
        }
      ).limit(limit).skip(skip).sort({
        creationTime: -1
      }).then(ress =>{
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let MemberList = result.MemberFind.map(function (item) {
      return{
        member_id:item._id,
        nickname: item.nickname,
        username: item.username,
        portrait: item.portrait,
        creationTime: item.creationTime,
        isAdmin: item.isAdmin,
        isDefriend:item.isDefriend,
      }
    });
    let page_for = new Array(pages).fill(1);
    res.render('admin/MemberManagement',{
      code: 0,
      MemberList:MemberList,
      page: page,
      limit: limit,
      total: counts,
      pages: pages,
      page_for: page_for,
      keyword: keyword,
      AdminInfo: req.session.AdminInfo,
      message: '成功'
    });
  });

});

/**
 * 会员详情
 */
router.get('/datails',(req,res,next) =>{
  let member_id = req.query.member_id||null;

  if(!member_id){
    res.render('admin/MemberDetails',{
      code: -1,
      message: '用户id不可为空',
    });
    return;
  }

  // 同步方法
  async.series({
    // 查询用户
    MemberFind: (callback) =>{
      MemberModel.findById(member_id).then(ress =>{
        if(!ress){
          res.render('admin/MemberDetails',{
            code: -1,
            message: '没有找到此用户',
          });
          return
        }
        callback(null,ress);
      })
    },
  },(err,result) =>{
    let MemberInfo = {
      nickname: result.MemberFind.nickname,
      username: result.MemberFind.username,
      portrait: result.MemberFind.portrait,
      creationTime: result.MemberFind.creationTime,
      isAdmin: result.MemberFind.isAdmin,
      updateTime: result.MemberFind.updateTime,
      wallpaper: result.MemberFind.wallpaper,
      description: result.MemberFind.description,
      introduction: result.MemberFind.introduction,
      member_id: result.MemberFind._id.toString(),
    };
    res.render('admin/MemberDetails',{
      MemberInfo,
      AdminInfo: req.session.AdminInfo,
    });
  });
});

module.exports = router;

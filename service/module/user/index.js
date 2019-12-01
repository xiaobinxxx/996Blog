const express = require('express');
const router = express.Router();
const async = require('async');
// 连接用户数据表
const MemberModel = require('../../dbmodel/member');

/**
 * 更新用户信息
 */
router.post('/update/user',(req,res,next) =>{
  let member_id = req.headers.token||null;
  let photoUrl = req.body.photoUrl||null;
  let headUrl = req.body.headUrl||null;
  let nickname = req.body.nickname||null;
  let signature = req.body.signature||null;
  let introduce = req.body.introduce||null;

  if(!member_id){
    res.json({
      code: -1,
      message: '用户id不可为空',
    });
    return;
  }
  if(!photoUrl){
    res.json({
      code: -1,
      message: '照片墙不可为空',
    });
    return;
  }
  if(!headUrl){
    res.json({
      code: -1,
      message: '头像不可为空',
    });
    return;
  }
  if(!nickname){
    res.json({
      code: -1,
      message: '昵称不可为空',
    });
    return;
  }
  if(!signature){
    res.json({
      code: -1,
      message: '签名不可为空',
    });
    return;
  }
  if(!introduce){
    res.json({
      code: -1,
      message: '介绍不可为空',
    });
    return;
  }
  // 同步方法
  async.series({
    // 更新用户
    UserUpdate: (callback) =>{
      MemberModel.update(
        {
          _id: member_id,
        },
        {
          description: signature,
          introduction: introduce,
          nickname: nickname,
          portrait: headUrl,
          wallpaper: photoUrl,
          updateTime: new Date().toString(),
        }
      ).then(ress =>{
        callback(null,ress);
      })
    },
    UserFind: (callback) =>{
      MemberModel.findOne({
        _id: member_id,
      }).then(ress =>{
        callback(null,ress)
      });
    },
  },(err,result) =>{
    let UserInfo = result.UserFind;
    res.json({
      code: 0,
      data:{
        member_id: UserInfo._id,
        username: UserInfo.username,
        description: UserInfo.description,
        introduction: UserInfo.introduction,
        portrait: UserInfo.portrait,
        wallpaper: UserInfo.wallpaper,
        nickname: UserInfo.nickname,
      },
      message: '更新成功',
    });
  });
});
module.exports = router;

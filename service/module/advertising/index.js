const express = require('express');
const router = express.Router();
const async = require('async');

// 导入广告表
const AdvertisingModel = require('../../dbmodel/advertising');

/**
 * banner广告查询
 */
router.get('/banner',(req,res,next) =>{
  // var Advertising = new AdvertisingModel({
  //   ad_type: 0,
  //   ad_cover: [
  //     {
  //       img: 'https://csdnimg.cn/feed/20190830/5e601d85d4eb0dd3d2ad51632e0c57b5.jpg'
  //     }
  //   ],
  //   ad_skip: 0,
  //   article_id: '5d69e73707cd540824675bc2',
  //   skip_link: '',
  // });
  // res.send({
  //   code: 0
  // })
  // return Advertising.save();
  async.series({
    adFind: (callback) =>{
      AdvertisingModel.find({
        ad_type: 0,
      }).limit(5).then(ress =>{
        callback(null,ress)
      })
    },
  },(err,result) =>{
    let adArr = result.adFind.map(function (item) {
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
      data: adArr,
      message: '成功'
    })
  })
});

module.exports = router;

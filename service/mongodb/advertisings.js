const mongoose = require('mongoose');

//广告表结构
module.exports = new mongoose.Schema({

  // 广告类型   0 首页banner广告  1 热门文章广告
  ad_type: {
      type: Number,
      default: 0,
  },
  // 广告封面
  ad_cover: {
    type: String,
    default: '',
  },
  // 广告跳转方式 0 文章 1 外链
  ad_skip:{
    type: Number,
    default: 0,
  },
  // 文章id
  article_id: {
    type: String,
    default: '',
  },
  // 跳转链接
  skip_link: {
    type: String,
    default: '',
  }
});

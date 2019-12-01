const mongoose = require('mongoose');

//文章表结构
module.exports = new mongoose.Schema({
  // 对应分类id
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classify',
  },
  // 标题
  title: String,
  // 描述
  description: String,
  // 内容
  content: String,
  // 编辑的内容
  content_edit:String,
  // 文章封面
  article_cover: String,
  // 发布时间
  release_time: {
    type: Date,
    default: new Date(),
  },
  // 修改时间
  modification_time: {
    type: Date,
    default: new Date(),
  },
  // 作者
  author: {
    type: String,
    default: '匿名',
  },
  // 阅读数
  pageview: {
    type: Number,
    default: 0,
  },
  // 评论数
  comments: {
    type: Number,
    default: 0,
  },
  // 评论区
  commentArr:{
    type: Array,
    default: [],
  }
});

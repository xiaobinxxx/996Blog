const mongoose = require('mongoose');

//评论表结构
module.exports = new mongoose.Schema({
  // 评论内容
  content: String,
  // 评论用户id
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  // 评论的文章id
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article',
  },
  // 评论时间
  creation_time: {
    type: Number,
    default:  parseInt(new Date().getTime()),
  }
});

var mongoose = require('mongoose');
var CommentModel = require('../mongodb/comments');
// 用户表
module.exports = mongoose.model('comment', CommentModel);

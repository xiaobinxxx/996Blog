var mongoose = require('mongoose');
var ArticleModel = require('../mongodb/articles');
// 文章表结构
module.exports = mongoose.model('article', ArticleModel);

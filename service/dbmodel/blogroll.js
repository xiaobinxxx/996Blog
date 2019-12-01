var mongoose = require('mongoose');
var BlogrollsModel = require('../mongodb/blogrolls');
// 友情链接表
module.exports = mongoose.model('blogrolls', BlogrollsModel);

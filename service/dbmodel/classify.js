var mongoose = require('mongoose');
var ClassifyModel = require('../mongodb/classifys');
// 用户表
module.exports = mongoose.model('classify', ClassifyModel);

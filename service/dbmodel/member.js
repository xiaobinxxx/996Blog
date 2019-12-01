var mongoose = require('mongoose');
var MemberModel = require('../mongodb/members');
// 用户表
module.exports = mongoose.model('member', MemberModel);

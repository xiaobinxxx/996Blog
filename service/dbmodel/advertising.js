var mongoose = require('mongoose');
var AdvertisingModel = require('../mongodb/advertisings');
// 用户表
module.exports = mongoose.model('advertising', AdvertisingModel);

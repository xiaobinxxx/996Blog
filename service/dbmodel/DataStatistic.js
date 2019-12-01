var mongoose = require('mongoose');
var DataStatisticModel = require('../mongodb/DataStatistics');
// 统计表
module.exports = mongoose.model('DataStatistic', DataStatisticModel);

var mongoose = require('mongoose');
var SettingModel = require('../mongodb/settings');

module.exports = mongoose.model('setting', SettingModel);

var mongoose = require('mongoose');
var UserModel = require('../mongodb/users');

module.exports = mongoose.model('user', UserModel);

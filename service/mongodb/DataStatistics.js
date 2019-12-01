const mongoose = require('mongoose');

//统计表结构
module.exports = new mongoose.Schema({
  // 访问量
  visitor_volume: {
    type: Number,
    default: 0,
  },
  // 注册量
  registered_users: {
    type: Number,
    default: 0,
  },
  // 登录量
  login_volume: {
    type: Number,
    default: 0,
  },
  // 后台登录量
  adminlogin_volume: {
    type: Number,
    default:  0,
  },
  // 搜索量
  search_volume: {
    type: Number,
    default:  0,
  }
});

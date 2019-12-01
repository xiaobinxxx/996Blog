const mongoose = require('mongoose');

//友情链接表结构
module.exports = new mongoose.Schema({
  // 链接地址名字
  link_name: {
    type: String,
    default: '996Music',
  },
  // 链接地址
  link_url: {
    type: String,
    default: 'https://music.996ico.cn',
  }
});

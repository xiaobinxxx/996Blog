const mongoose = require('mongoose');
const Config = require('../config');
//用户的表结构
module.exports = new mongoose.Schema({

  //用户名
  username: String,
  //密码
  password: String,
  // 创建时间
  creationTime:{
    type: Date,
    default: new Date(),
  },
  // 更新信息时间
  updateTime:{
    type: Date,
    default: new Date(),
  },
  //是否是博主
  isBlogger: {
    type:Boolean,
    default: false
  },
    //是否是管理员
    isAdmin: {
    type: Boolean,
    default: false
  },
  // 描述
  description: {
    type: String,
    default: '无',
  },
  // 介绍
  introduction:{
    type: String,
    default: '无'
  },
  // 头像
  portrait: {
    type: String,
    default: `/public/images/portrait.jpg`,
  },
  // 背景
  wallpaper: {
    type: String,
    default: `/public/images/wallpaper.jpg`
  },
  // 用户昵称
  nickname: {
    type: String,
    default: '一位社会人'
  },
  // 黑名单状态
  isDefriend: {
    type: Boolean,
    default: false,
  }

});

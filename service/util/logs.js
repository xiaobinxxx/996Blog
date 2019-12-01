// 引日志模块
const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },//设置是否在控制台打印日志
    info: { type: 'file', filename: './logs/info.log' },
    error: { type: 'file', filename: './logs/error.log' },
  },
  categories: {
    default: { appenders: [ 'out', 'info' ], level: 'info' }//去掉'out'。控制台不打印日志
  }
});

const logger = log4js.getLogger('info');

module.exports = logger;

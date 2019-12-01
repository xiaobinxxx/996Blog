const express = require('express');
const router = express.Router();
const async = require('async');
const fs = require('fs');
const path = require('path');
// const path = require('../../public/ClientFile/img');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/**
 * 上传图片文件
 */
router.post('/images',multipartMiddleware,(req,res,next) =>{
  if(!req.files.file.name){
    res.json({
      code: -1,
      message: '参数格式错误',
    });
    return;
  }
  // 随机字符
  let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  // 生成随机字符函数
  function generateMixed(n) {
    let res = "";
    for(let i = 0; i < n ; i ++) {
      let id = Math.ceil(Math.random()*35);
      res += chars[id];
    }
    return res;
  }

  let timestamp = new Date().getTime();
  let fiileName = generateMixed(6) + '!' + timestamp + '.jpg';
  let source = req.files.file.path;
  let dest = path.join(__dirname, "../../public/ClientFile/img",fiileName);
  let readStream = fs.createReadStream(source);
  let writeStream = fs.createWriteStream(dest);
  readStream.pipe(writeStream);

  let FileUrl = `/public/ClientFile/img/${fiileName}`;
  res.json({
    code: 0,
    data:{
      url: FileUrl,
    },
    message: '成功',
  })
});
module.exports = router;

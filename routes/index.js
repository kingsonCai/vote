const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(__dirname);

/** 注册路由 **/
for(let filename of files) {
  // require 所有路由模块
  if(!filename.includes('index')) {
    const router = require(`./${filename}`);
    app.use(router.routes(), router.allowedMethods())
  }
}


const pathToRegexp = require('path-to-regexp');
const loginWhitelist = [
  '/api/login',
  '/api/register',
  '/mock/*',
  /test\/[\s\S]*?/,
];
module.exports = function(req,res,next){
  let url = req.originalUrl;//获取浏览器中当前访问的nodejs路由地址；
  const mockUrlExp = pathToRegexp('/mock/:projectSign(.{32})/:mockURL*');
  // console.log("当前请求地址" + url);
  const whiteListHasCurrentUrl = loginWhitelist.some(item => {
    if (typeof item === 'string') {
      return item === url
    } else {
      return item.test(url);
    }
    
  });
  if (!whiteListHasCurrentUrl && !mockUrlExp.exec(url)) {
    let reqToken = req.get('token');
    if (reqToken && req.session.token === reqToken) {
      next();
    } else {
      res.json({
        code: '0004',
        desc: '登录超时'
      })
    }
  } else {
    next();
  }
}

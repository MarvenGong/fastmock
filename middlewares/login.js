const pathToRegexp = require('path-to-regexp');
var loginWhitelist = [
  '/api/login',
  '/api/register',
  '/mock/*',
  '/test'
];
module.exports = function(req,res,next){
  var url = req.originalUrl;//获取浏览器中当前访问的nodejs路由地址；
  const mockUrlExp = pathToRegexp('/mock/:projectSign(.{32})/:mockURL*');
  // console.log("当前请求地址" + url);
  if (loginWhitelist.indexOf(url) === -1 && !mockUrlExp.exec(url)) {
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

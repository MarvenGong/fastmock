const pathToRegexp = require('path-to-regexp');
const loginWhitelist = [
  '/api/login',
  '/api/register',
  '/api/countData',
  '/mock/*',
  /test\/[\s\S]*?/,
];
module.exports = function(req,res,next){
  let url = req.originalUrl;//获取浏览器中当前访问的nodejs路由地址；
  const requestAccept = req.headers.accept;
  const isAjaxRequest = req.xhr || /json/i.test(requestAccept);
  const mockUrlExp = pathToRegexp('/mock/:projectSign(.{32})/:mockURL*');
  const whiteListHasCurrentUrl = loginWhitelist.some(item => {
    if (typeof item === 'string') {
      return item === url
    } else {
      return item.test(url);
    }
  });
  if (!whiteListHasCurrentUrl && !mockUrlExp.exec(url)) {
    let reqToken = req.get('token');
    // 如果是ajax请求则验证token
    if (isAjaxRequest && req.session.token === reqToken) {
      next();
    } else if (!isAjaxRequest && req.session.token && req.session.userInfo.role === 1) {
      next();
    } else {
      isAjaxRequest ? res.json({
        code: '0004',
        desc: '登录超时'
      }) : res.redirect('/');
    }
  } else {
    next();
  }
}

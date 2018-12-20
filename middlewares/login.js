var loginWhitelist = ['/api/login'];
module.exports = function(req,res,next){
  var url = req.originalUrl;//获取浏览器中当前访问的nodejs路由地址；
  console.log(url);
  if (loginWhitelist.indexOf(url) === -1) {
    let reqToken = req.get('token');
    if (req.session.token === reqToken) {
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

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var index = require('./routes/index');
var users = require('./routes/test');
var mock = require('./routes/mock');
var api = require('./routes/api');
var admin = require('./routes/admin');
var cors = require('cors');
var config = require('config');
var compression = require('compression')
// import restc https://elemefe.github.io/restc/
const restc = require('restc');
var app = express();

var loginMiddleware = require('./middlewares/login');

// 跨域允许
var corsOptions = {
  origin: true,
  credentials: true,
  maxAge: 2592000
}
global.config = config;
// 压缩相应资源
app.use(compression());
app.use(cors(corsOptions));
// view engine setup
app.engine('html', require('ejs-mate'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// app.locals._layoutFile = 'layout.html';

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'views/index/static')));
app.use('/assets', express.static(path.join(__dirname, 'views/index/assets')));
app.use(express.static(path.join(__dirname, 'public')));
// 使用 session 中间件
var radisOptions = config.get('radis');
var sessionOptions = {
  secret : 'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  rolling: true,
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 60 * 2, // 设置 session 的有效时间，单位毫秒
  },
};
if (config.get('enviroment') === 'prod') {
  sessionOptions.store = new RedisStore(radisOptions)
}
app.use(session(sessionOptions));
// 对mock类型的接口（即录入的接口的访问）挂载restc中间件，
// 实现通过浏览器地址栏请求地址时可以像类似于postman一样调试接口
app.use('/mock/*', restc.express());

// 前端部分
app.use('/', index);
app.use(loginMiddleware); // 登录拦截
app.use('/api', api);
app.use('/test', users);
app.use('/mock', mock);
// 后台管理部分
app.use('/admin', admin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

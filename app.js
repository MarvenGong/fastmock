var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var mock = require('./routes/mock');
var api = require('./routes/api');
var cors = require('cors');
var config = require('./config');
var app = express();
var loginMiddleware = require('./middlewares/login');

// 跨域允许
var whitelist = ['http://localhost:8888', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  "optionsSuccessStatus": 200,
  allowedHeaders: ['Content-Type', 'token', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  credentials: true
}
global.config = config;
// app.use(cors(corsOptions));
// view engine setup
app.engine('html', require('ejs-mate'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// app.locals._layoutFile = 'layout.html';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'views/index/static')));
// 使用 session 中间件
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  rolling: true,
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 60 * 2, // 设置 session 的有效时间，单位毫秒
  },
}));
// 登录拦截

app.use('/', index);
app.use(loginMiddleware);
app.use('/api', api);
app.use('/users', users);
app.use('/mock', mock);

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

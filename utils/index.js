const ResponseFormat = require('./ResponseFormat');
const StringUtils = require('./StringUtils');
var nodemailer = require('nodemailer');
var sendMail = function(to, content) {
  var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: '1637077309@qq.com', //这里填自己的 qq号
      pass: 'qrrxsaiosqaqbdch' //授权码,通过QQ邮箱获取 
    }
  });
  var mailOptions = {
    from: '1637077309@qq.com', // 发送者
    to: [to], // 接受者,可以同时发送多个,以逗号隔开
    subject: 'fastmock', // 标题
    text: content, // 文本
    html: content,//html页面
    attachments: []
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        reject(err);
      }
      console.log('发送成功');
      resolve();
    });
  });
};
module.exports = {
  ResponseFormat,
  StringUtils,
  sendMail
};
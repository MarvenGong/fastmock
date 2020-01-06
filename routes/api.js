var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const ETools = require('etools');
var config = require('config');
var wwwBaseUrl = config.get('wwwBaseUrl');
const apiInterface = require('./api-interface');
const apiProject = require('./api-project');
const LoginModel = require('../models/LoginModel');
const ProjectModel = require('../models/ProjectModel');
const ApiModel = require('../models/ApiModel');
const FeedbackModel = require('../models/FeedbackModel');
const { ResponseFormat, sendMail, StringUtils } = require('../utils');
/* GET home page. */
const loginModel = new LoginModel();
const projectModel = new ProjectModel();
const apiModel = new ApiModel();
const feedbackModel = new FeedbackModel();
const stringUtils = new StringUtils();
router.get('/sendMail', async function(req, res) {
  try {
    await sendMail('15696544221@163.com', '呵呵');
    res.send('发送成功');
  } catch (error) {
    res.send(error);
  }
});
// 登录验证
router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = crypto.createHash('md5').update('' + req.body.password).digest('hex');  // 先加密后验证
  const responseFormat = new ResponseFormat(res);
  loginModel.verifyLogin(username, password).then(rows => {
    if (rows.length <= 0) {
      responseFormat.jsonError('用户名或密码错误');
      return false;
    }
    const user = rows[0];
    if (parseInt(user.status) === 0) {
      res.json({
        code: '0005',
        desc: '该账号还未激活，请先激活再登录',
        data: {
          user
        }
      });
      return false;
    }
    const token = crypto.createHash('md5').update('' + user.id).digest('hex');
    req.session.token = token;
    req.session.userInfo = user;
    req.session.userId = user.id;
    req.session.username = user.username;
    responseFormat.jsonSuccess({
      loginSuccess: true,
      userInfo: { ...{
        username: user.username,
        id: user.id,
        role: user.role
      }, token}
    });
  }).catch(err => {
    responseFormat.jsonError(err);
  });
});
// 注册
function getCodeAndExpire() {
  // 生成激活码
  const currTime = new Date().getTime();
  const activeCodeStr = ETools.string.generateUUID() + currTime;
  const activeCodeMD5 = crypto.createHash('md5').update('' + activeCodeStr).digest('hex'); // 密码加密
  // 计算激活码的失效时间 30分钟后过期
  const codeExpire = currTime + 1000 * 60 * 30;
  return {
    code: activeCodeMD5,
    expire: codeExpire
  }
}
router.post('/register', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  let requestData = {...req.body};
  // console.log(requestData);
  try {
    const resp = await loginModel.findUserByUsername(requestData.username);
    if (resp && resp.length > 0) {
      responseFormat.jsonError('该用户名已经被注册');
      return false;
    }
    const resp2 = await loginModel.findUserByEmail(requestData.email);
    if (resp2 && resp2.length > 0) {
      responseFormat.jsonError('该邮箱已经被注册');
      return false;
    }
    const pwd = crypto.createHash('md5').update('' + requestData.password).digest('hex'); // 密码加密
    requestData.password = pwd;
    // 生成激活码
    const jsonObj = getCodeAndExpire();
    requestData.activeCode = jsonObj.code;
    requestData.codeExpire = jsonObj.expire;
    const resp3 = await loginModel.register(requestData);
    // 注册成功发送邮件激活
    if (resp3.id) {
      const sendInfo = '您好，亲爱的'+ requestData.nickname +'<br/>恭喜您注册成功，你在本站注册的邮箱需要验证！请点击链接激活(或者复制到浏览器打开)，完成验证！'
        + '<br/><a href="'+ wwwBaseUrl + '/#/active/'+ jsonObj.code +'">'+ wwwBaseUrl + '/#/active/'+ jsonObj.code +'</a>'
      await sendMail(requestData.email, sendInfo);
      responseFormat.jsonSuccess({
        regSuccess: true,
        user: resp3
      });
    } else {
      responseFormat.jsonError('注册失败');
    }
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
// 修改密码
router.post('/modifyPwd', async function(req, res) {
  const { oldPwd, newPwd, repeatNewPwd } = req.body;
  if (newPwd !== repeatNewPwd) {
    res.responseFormat.jsonError('两次输入密码不一致，请重新输入!');
    return false;
  }
  const username = req.session.username;
  const password = crypto.createHash('md5').update('' + oldPwd).digest('hex');  // 先加密后验证
  const rows = await loginModel.verifyLogin(username, password);
  console.log(rows);
  if (rows.length <= 0) {
    res.responseFormat.jsonError('旧密码错误，请重新输入!');
    return false;
  }
  const userObj = rows[0].get({plain:true});
  const newPwdMD5 = crypto.createHash('md5').update('' + newPwd).digest('hex');
  userObj.password = newPwdMD5;
  const resendResp = await loginModel.modify(userObj);
  res.responseFormat.jsonSuccess({
    success: resendResp.length > 0,
  });
});
// 重新发送激活码
router.get('/resendCode', async function(req, res) {
  const { userId } = req.query;
  const users = await loginModel.findUserByUserId(userId);
  const userObj = users[0].get({plain:true});
  const jsonObj = getCodeAndExpire();
  userObj.activeCode = jsonObj.code;
  userObj.codeExpire = jsonObj.expire;
  const sendInfo = '您好，亲爱的'+ userObj.nickname +'<br/>恭喜您注册成功，你在本站注册的邮箱需要验证！请点击链接激活(或者复制到浏览器打开)，完成验证！'
        + '<br/><a href="'+ wwwBaseUrl + '/#/active/'+ jsonObj.code +'">'+ wwwBaseUrl + '/#/active/'+ jsonObj.code +'</a>'
  await sendMail(userObj.email, sendInfo);
  const resendResp = await loginModel.modify(userObj);
  res.responseFormat.jsonSuccess({
    success: resendResp.length > 0,
  });
});
// 发送验证码找回密码
router.get('/sendForgetPwdCode', async function(req, res) {
  const { email } = req.query;
  const code = stringUtils.getRandomCode(6);
  const sendInfo = '您好，尊敬的'+ email +'<br/>您正在fastmock.site找回登录密码，如果此操作并非您本人意愿，请勿透露验证码给其他人，否则可能导致域名被盗等风险！'
        + '验证码为：' + code;
  req.session.fpwdEmail = email;
  req.session.fpwdCode = code;
  await sendMail(email, sendInfo);
  res.responseFormat.jsonSuccess({
    success: true
  })
});
// 发送验证码找回密码
router.post('/sureForgetPwd', async function(req, res) {
  const { email, code, newPwd } = req.body;
  if (code !== req.session.fpwdCode || email !== req.session.fpwdEmail) {
    res.responseFormat.jsonError('验证码输入错误或已经失效，请重试!');
    return false;
  }
  const newPwdMD5 = crypto.createHash('md5').update('' + newPwd).digest('hex');
  const rows = await loginModel.findUserByEmail(email);
  const userObj = rows[0].get({plain:true});
  userObj.password = newPwdMD5;
  const resendResp = await loginModel.modify(userObj);
  res.responseFormat.jsonSuccess({
    success: resendResp.length > 0,
  });
});
// 激活账号
router.post('/active', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  const { activeCode } = req.body;
  try {
    const respUsers = await loginModel.findUserByActiveCode(activeCode);
    if (respUsers.length <= 0) {
      responseFormat.jsonError('链接无效');
      return false;
    }
    const respUser = respUsers[0];
    if (parseInt(respUser.codeExpire) < new Date().getTime()) {
      responseFormat.jsonError('激活码已过期');
    } else {
      respUser.status = 1;
      const resp = await loginModel.activeUser(respUser);
      responseFormat.jsonSuccess({
        success: resp.length > 0,
      });
    }
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
// 退出登录
router.get('/logout', function(req, res) {
  const responseFormat = new ResponseFormat(res);
  req.session.token = null;
  req.session.userId = null;
  responseFormat.jsonSuccess({
    success: true
  });
});
// 根据用户名，邮箱搜索用户
router.get('/searchUser', async function(req, res) {
  try {
    const resp = await loginModel.searchUser(req.query.key);
    if (resp) {
      res.responseFormat.jsonSuccess(resp);
    } else {
      res.responseFormat.jsonError('搜索失败');
    }
  } catch (error) {
    res.responseFormat.jsonError(error);
  }
});
// 根据用户名，邮箱精确搜索用户
router.get('/searchUserExact', async function(req, res) {
  try {
    const resp = await loginModel.searchUserExact(req.query.key);
    if (resp) {
      res.responseFormat.jsonSuccess(resp);
    } else {
      res.responseFormat.jsonError('搜索失败');
    }
  } catch (error) {
    res.responseFormat.jsonError(error);
  }
});
// 提交问题与建议
router.post('/feedback', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  const { email, content } = req.body;
  try {
    const resp = await feedbackModel.addFeedback({
      email,
      content
    });
    if (resp) {
      responseFormat.jsonSuccess(resp);
    } else {
      responseFormat.jsonError('提交失败');
    }
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
// 获取首页统计信息
router.get('/countData', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  try {
    const userCount = await loginModel.countAll();
    const projectCount = await projectModel.countAllProject();
    const apiCount = await apiModel.countAll();
    responseFormat.jsonSuccess({
      users: userCount,
      projects: projectCount,
      apis: apiCount,
      mocks: parseInt(new Date().getTime() / 400000)
    });
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
apiProject(router, projectModel, loginModel, apiModel, crypto);
apiInterface(router, apiModel);
module.exports = router;

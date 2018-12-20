var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const ETools = require('etools');
import apiInterface from './api-interface';
import LoginModel from '../models/LoginModel';
import ProjectModel from '../models/ProjectModel';
import ApiModel from '../models/ApiModel';
const { ResponseFormat } = require('../utils');
/* GET home page. */
const loginModel = new LoginModel();
const projectModel = new ProjectModel();
const apiModel = new ApiModel();
router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const responseFormat = new ResponseFormat(res);
  loginModel.verifyLogin(username, password).then(rows => {
    if (rows.length > 0) {
      const user = rows[0];
      const token = crypto.createHash('md5').update('' + user.id).digest('hex');
      req.session.token = token;
      req.session.userId = user.id;
      responseFormat.jsonSuccess({
        loginSuccess: true,
        userInfo: {
          username,
          token
        }
      });
    } else {
      responseFormat.jsonError('用户名或密码错误');
    }
  }).catch(err => {
    responseFormat.jsonError(err);
  });
});
router.get('/logout', function(req, res) {
  const responseFormat = new ResponseFormat(res);
  req.session.token = null;
  req.session.userId = null;
  responseFormat.jsonSuccess({
    success: true
  });
});
router.get('/project/list', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  let userId = req.session.userId;
  let source = req.query.source;
  try {
    const rows = await projectModel.getProjectList(userId, source);
    if (rows) {
      responseFormat.jsonSuccess({ projectList: rows });
    } else {
      responseFormat.jsonError('查询失败');
    }
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
router.post('/project/add', function(req, res) {
  const responseFormat = new ResponseFormat(res);
  let userId = req.session.userId;
  const now = new Date();
  const nowStr = ETools.datetime.format(now, 'yyyy-MM-dd hh:mm:ss');
  const sign = ETools.string.generateUUID();
  const signMD5 = crypto.createHash('md5').update('' + sign).digest('hex');
  const project = {
    create_user: userId,
    name: req.body.name,
    description: req.body.description,
    baseurl: req.body.baseurl,
    create_time: nowStr,
    update_time: nowStr,
    sign: signMD5
  }
  projectModel.addProject(project).then(rows => {
    if (rows) {
      responseFormat.jsonSuccess({ projectList: rows });
    } else {
      responseFormat.jsonError('添加失败');
    }
  }).catch(error => {
    responseFormat.jsonError(error);
  });
});
router.get('/project/:id', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  const id = req.params.id;
  try {
    const resp = await projectModel.find(id);
    if (resp) {
      let p = resp[0];
      p.mockBasePath = config.WWW_BASE_URL + '/mock/' + p.sign + p.baseurl;
      responseFormat.jsonSuccess({ project: p });
    }else {
      responseFormat.jsonError('查询失败');
    }
  } catch (err) {
    responseFormat.jsonError(err);
  }
});
apiInterface(router, apiModel);
module.exports = router;

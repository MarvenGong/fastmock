import LoginModel from '../models/LoginModel';
import FeedbackModel from '../models/FeedbackModel';
import { request } from 'express';
import { ResponseFormat, sendMail } from '../utils';
var express = require('express');
var router = express.Router();
const loginModel = new LoginModel();
const feedbackModel = new FeedbackModel();
router.get('/users', async function(req, res) {
  const { pageNo = 1, pageSize = 15 } = req.query;
  try {
    const resp = await loginModel.findAll(pageNo / 1, pageSize / 1);
    res.render('admin/user/user-list', {
      title: '用户列表',
      pageSize: pageSize,
      pageNo: pageNo,
      totalCount: resp.count,
      users: resp.rows,
      token: req.session.token || ''
    });
  } catch (error) {
    res.render('error', {
      message: '查询失败',
      error
    });
  }
});
router.get('/feedbacks', async function(req, res) {
  const { pageNo = 1, pageSize = 15 } = req.query;
  try {
    const resp = await feedbackModel.findAll(pageNo / 1, pageSize / 1);
    res.render('admin/feedback/feedback-list', {
      title: '用户反馈列表',
      pageSize: pageSize,
      pageNo: pageNo,
      totalCount: resp.count,
      feedbacks: resp.rows,
      token: req.session.token || ''
    });
  } catch (error) {
    res.render('error', {
      message: '查询失败',
      error
    });
  }
});
// 问题与建议回复
router.post('/feedback/reply', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  const { email, content, id } = req.body;
  try {
    await sendMail(email, content);
    const feed = await feedbackModel.findById(id);
    let data = feed.dataValues;
    data.replyStatus = 1;
    const resp = await feedbackModel.save(data);
    if (resp) {
      responseFormat.jsonSuccess(resp);
    } else {
      responseFormat.jsonError('提交失败');
    }
  } catch (error) {
    responseFormat.jsonError(error);
  }
});
module.exports = router;
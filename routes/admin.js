import LoginModel from '../models/LoginModel';
import FeedbackModel from '../models/FeedbackModel';
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
      users: resp.rows
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
      feedbacks: resp.rows
    });
  } catch (error) {
    res.render('error', {
      message: '查询失败',
      error
    });
  }
});
module.exports = router;
var express = require('express');
var router = express.Router();
const pathToRegexp = require('path-to-regexp');
import { ApiModel, ProjectModel } from '../models';
import Mock from 'mockjs';
import { VM } from 'vm2';
const { ResponseFormat } = require('../utils');
const apiModel = new ApiModel();
const projectModel = new ProjectModel();
// const stringUtils = new StringUtils();
router.all('*', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  var path = req.originalUrl;
  const pathNode = pathToRegexp('/mock/:projectSign(.{32})/:mockURL*').exec(path);
  console.log(pathNode);
  if (!pathNode) {
    res.json({ code: '0002', desc: '该接口地址不存在' });
  } else {
    const pSign = pathNode[1];
    let mockUrl = '';
    let urlAndQuery = pathNode[2]; // 接口相对路径加query参数 如 /user/list?a=1
    let relateUrl = urlAndQuery.split('?')[0]; // 不带参数的相对路径 /user/list
    // 去掉项目的根路径
    relateUrl.split('/').map((item, index) => {
      if (index > 0) {
        mockUrl += '/' + item;
      }
    });
    try {
      const p = await projectModel.findProjectBySign(pSign);
      if (p && p.length > 0) {
        const rows = await apiModel.findApiMock(p[0].id, mockUrl);
        if (rows) {
          let mockRule = rows[0].mock_rule;
          mockRule = mockRule.replace(/[\r\n]/g, '');
          // let valueJson = JSON.parse(new Function(`return ${stringUtils.trim(value)}`));
          const vm = new VM({
            timeout: 1000,
            sandbox: {
              Mock: Mock,
              mode: mockRule,
              template: new Function(`return ${mockRule}`) // eslint-disable-line
            }
          });
          vm.run('Mock.mock(new Function("return " + mode)())') // 数据验证，检测 setTimeout 等方法
          let apiData = vm.run('Mock.mock(template())') // 解决正则表达式失效的问题
          responseFormat.jsonSuccess(apiData);
        } else {
          responseFormat.jsonError('查询失败');
        }
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  }
});
module.exports = router;
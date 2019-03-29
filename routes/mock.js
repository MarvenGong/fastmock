var express = require('express');
var router = express.Router();
const pathToRegexp = require('path-to-regexp'); // https://www.npmjs.com/package/path-to-regexp
import { ApiModel, ProjectModel } from '../models';
import Mock from 'mockjs';
import { VM } from 'vm2';
const { ResponseFormat, StringUtils } = require('../utils');
const stringUtils = new StringUtils();
const apiModel = new ApiModel();
const projectModel = new ProjectModel();
router.all('*', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  var path = req.originalUrl;
  const pathNode = pathToRegexp('/mock/:projectSign(.{32})/:mockURL*').exec(path);
  // console.log(pathNode);
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
      const p = await projectModel.findProjectBySign(pSign); // 根据项目的秘钥ID找到项目信息以获取项目的唯一ID
      if (p && p.length > 0) {
        const rows = await apiModel.findApiByProjectId(p[0].id); // 先根据项目id获取所有的接口
        if (rows) {
          // 筛选出符合条件的接口
          const rightRows = rows.filter(api => {
            return pathToRegexp(api.url).exec(mockUrl); // pathToRegexp 匹配url表达式
          });
          if (!rightRows) {
            responseFormat.jsonError('没有匹配到接口');
            return false;
          }
          // console.log('匹配到的api');
          // console.log(rightRows);
          const api = rightRows[0];
          let mockRule = rightRows[0].mockRule;
          mockRule = mockRule.replace(/[\r\n]/g, '');
          Mock.Handler.function = function (options) {
            const currMockUrl = api.url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
            options.Mock = Mock
            options._req = req;
            options._req.params = stringUtils.params(currMockUrl, mockUrl); // 从/api/:user/:id格式的/api/1/2中得到{user:1, id:2}
            options._req.cookies = req.cookies;
            options._req.headers = req.headers;
            return options.template.call(options.context.currentContext, options);
          }
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
          res.send(apiData);
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
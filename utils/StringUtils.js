const pathToRegexp = require('path-to-regexp');
const Mock = require('mockjs');
const { VM } = require('vm2');
class StringUtils {
  trim(str) {
    return str.replace(/^\s\s*/,'').replace(/\s\s*$/,'');
  }
  /**
   * decodeURIComponent加上异常捕获
   * @param String str
   */

  safeDecodeURIComponent (str) {
    try {
      return decodeURIComponent(str)
    } catch (e) {
      return str
    }
  }
  params(restURL, fullURL) {
    const params = {}
    const paramNames = []
    const api = pathToRegexp(restURL, paramNames)
    const captures = fullURL.match(api)
  
    if (!captures) return {}
  
    captures.slice(1).forEach((value, i) => {
      /* istanbul ignore else */
      if (paramNames[i]) {
        params[paramNames[i].name] = this.safeDecodeURIComponent(value)
      }
    })
  
    return params
  }
  getRandomCode(length = 6) {
    var Num = '';
    for(var i = 0; i < length; i++)
    {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  }
  isJsonString(str) {
    try {
      if (typeof JSON.parse(str) == "object") {
          return true;
      }
    } catch(e) {
      console.error('规则解析出错:' + e.message);
      return false;
    }
    // return false;
  }
  /**
   * 验证输入的规则是否符合规范
   * @param {*} ruleStr 输入的规则字符串
   * @param {*} url 输入的url
   * @param {*} req 当前请求
   */
  verifyMockUrl(ruleStr, url, req) {
    const ruleString = ruleStr.replace(/[\r\n]/g, '');
    const self = this;
    try {
      Mock.Handler.function = function (options) {
        const currMockUrl = url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
        options.Mock = Mock
        options._req = req;
        options._req.params = self.params(currMockUrl, url); // 从/api/:user/:id格式的/api/1/2中得到{user:1, id:2}
        options._req.cookies = req.cookies;
        options._req.headers = req.headers;
        return options.template.call(options.context.currentContext, options);
      }
      // let valueJson = JSON.parse(new Function(`return ${stringUtils.trim(value)}`));
      const vm = new VM({
        timeout: 1000,
        sandbox: {
          Mock: Mock,
          mode: ruleString,
          template: new Function(`return ${ruleString}`) // eslint-disable-line
        }
      });
      vm.run('Mock.mock(new Function("return " + mode)())') // 数据验证，检测 setTimeout 等方法
      let apiDataTemp = vm.run('Mock.mock(template())') // 解决正则表达式失效的问题
      // console.log('==================' + apiDataTemp);
      if (typeof apiDataTemp !== 'object') {
        return false;
      }
      return true;
    } catch (error) {
      // console.error('--------' + error);
      return false;
    }
  }
}
module.exports = StringUtils;
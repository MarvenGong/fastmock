const pathToRegexp = require('path-to-regexp');
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
}
export default StringUtils;
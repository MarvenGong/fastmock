class StringUtils {
  isJsonString(str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true;
      }
    } catch (e) {
      // console.error('规则解析出错:' + e.message);
      return false;
    }
  }
}
export default StringUtils;

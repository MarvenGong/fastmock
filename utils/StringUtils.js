class StringUtils {
  trim(str) {
    return str.replace(/^\s\s*/,'').replace(/\s\s*$/,'');
  }
}
export default StringUtils;
/**
 * Created by MarvenGong on 2017/11/10.
 */
import toastr from 'toastr';
class UserLogin {
  LOGININFOKEY='loginInfo';
  /**
   * 判断是否登录
   * @returns {boolean}
   */
  isLogin() {
    let localLoginInfo = window.localStorage.getItem(this.LOGININFOKEY);
    // 针对第三方访问页面的情况，如果url后面带有token，则也视为已经登录的状态，不跳转到登录页面
    if (localLoginInfo) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 获取登录信息
   * @returns {{}}
   */
  getLoginInfo() {
    if (this.isLogin()) {
      return JSON.parse(localStorage.getItem(this.LOGININFOKEY));
    } else {
      // alert('未登录');
      return {};
    }
  }
  /**
   * 获取token
   * @returns {token}
   */
  getLoginToken() {
    let loginInfo = this.getLoginInfo();
    // 针对第三方访问页面的情况，如果url后面带有token，则取url带的token
    return loginInfo.token;
  }
  /**
   * 存储登录信息
   * @param loginInfo
   * @returns {{}}
   */
  setLoginInfo(loginInfo) {
    localStorage.setItem(this.LOGININFOKEY, JSON.stringify(loginInfo));
    return this.getLoginInfo();
  }
  /**
   * 清空登录信息
   */
  removeLoginInfo() {
    localStorage.removeItem(this.LOGININFOKEY);
  }

  /**
   * 判断是否有权限执行当前操作
   * @param url
   * @returns {boolean}
   */
  hasPermission(url) {
    return localStorage.getItem('actionPermissions').indexOf(url) >= 0;
  }
  checkPermission(url, callback) {
    if (!this.hasPermission(url)) {
      toastr.error('您没有权限执行当前操作', '警告');
      return false;
    } else {
      callback();
    }
  }
}
export default new UserLogin();

const sequelizeIns = require('../db/sequelizeInstance');
const Sequelize = require('sequelize');
const User = require('../entity').User;
class LoginModel {
  constructor() {
  }
  findAll(pageNo, pageSize) {
    return User.findAndCountAll({
      offset: (pageNo - 1) * pageSize,
      limit: pageSize,
      attributes: ['id', 'username', 'nickname', 'email', 'createdAt'],
      order: [['create_time', 'DESC']]
    });
  }
  countAll() {
    return User.count();
  }
  verifyLogin(username, password) {
    return User.findAll({
      attributes: ['id', 'username', 'nickname', 'email', 'role'],
      where: {
        username: username,
        password: password
      }
    });
  }
  findUserByUsername(username) {
    return User.findAll({
      where: {
        username: username
      }
    });
  }
  findUserByUserId(userId) {
    return User.findAll({
      where: {
        id: userId
      }
    });
  }
  findUserByEmail(email) {
    return User.findAll({
      where: {
        email: email
      }
    });
  }
  register(json) {
    return User.create(json);
  }
  searchUser(key) {
    return User.findAll({
      $like: {
        username: key,
        email: key,
        nickname: key
      }
    })
  }
  /**
   * 根据项目找到未被邀请的用户
   * @param {*} key 
   * @param {*} project 
   */
  searchUserExtendProjectExsist(key, project) {
    const sql = 'select user.id, user.nickname, user.email from user where (user.username like "%'+ key +'%"'
      + ' or user.email like "%'+ key +'%"'
      + ' or user.nickname like "%'+ key +'%")'
      + ' and user.id not in'
      + ' (select p.create_user from project p where p.id=' + project
      + ' union'
      + ' select r.user from user_rel_project r where r.project='+ project +')';
    return sequelizeIns.query(sql, { raw: true, type: Sequelize.QueryTypes.SELECT });
  } 
}
export default LoginModel;
const Op = require('sequelize').Op;
const db = require('../db/db.js');
const User = require('../entity/User');
class LoginService {
  constructor() {
  }
  verifyLogin(username, password) {
    return db.query(`select * from user where username='${username}' and password='${password}'`);
  }
  findUserByUsername(username) {
    return db.query('select * from user where user.username="' + username + '"');
  }
  findUserByEmail(email) {
    return db.query('select * from user where user.email="' + email + '"');
  }
  register(json) {
    const sql = 'INSERT INTO user (username, password, email, nickname) values (?,?,?,?)';
    return db.save(sql, [json.username, json.password, json.email, json.nickname]);
  }
  searchUser(key) {
    const sql = 'select user.id, user.nickname, user.email from user'
      + ' where user.username like "%'+ key +'%"'
      + ' or user.email like "%'+ key +'%"'
      + ' or user.nickname like "%'+ key +'%"';
    return db.query(sql);
  }
  searchUserExtendProjectExsist(key, project) {
    const sql = 'select user.id, user.nickname, user.email from user where (user.username like "%'+ key +'%"'
      + ' or user.email like "%'+ key +'%"'
      + ' or user.nickname like "%'+ key +'%")'
      + ' and user.id not in'
      + ' (select p.create_user from project p where p.id=' + project
      + ' union'
      + ' select r.user from user_rel_project r where r.project='+ project +')';
    return db.query(sql);
  } 
}
export default LoginService;
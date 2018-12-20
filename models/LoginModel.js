const db = require('../db/db.js');
class LoginService {
  constructor() {
  }
  verifyLogin(username, password) {
    return db.query(`select * from user where username='${username}' and password='${password}'`);
  }
}
export default LoginService;
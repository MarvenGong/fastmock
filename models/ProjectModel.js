const db = require('../db/db.js');
class ProjectModel {
  constructor() {
  }
  /**
   * 获取项目列表
   * @param {Number} userId 当前登录的用户ID
   * @param {String} source 项目来源 create 由我创建， join 加入的， all 所有
   */
  getProjectList(userId, source) {
    let querySql = '';
    if (source === 'create') {
      querySql = `select * from project where create_user='${userId}'`;
    } else if (source === 'join') {
      querySql = `select * from project p left join user_rel_project up on p.id=up.project where up.user='${userId}'`;
    } else {
      querySql = `select p.* from project p left join user_rel_project up on p.id=up.project where up.user=${userId} or p.create_user=${userId};`;
    }
    return db.query(querySql);
  }
  find(id) {
    return db.query('select * from project left join user on project.create_user=user.id where project.id=' + id);
  }
  findProjectBySign(sign) {
    return db.query('select * from project where sign="' + sign + '"');
  }
  addProject(project) {
    const sql = `insert into project (name, description, create_time, update_time, create_user, baseurl, sign) values ('${project.name}','${project.description}','${project.create_time}','${project.update_time}','${project.create_user}','${project.baseurl}', '${project.sign}')`;
    return db.query(sql);
  }
}
export default ProjectModel;
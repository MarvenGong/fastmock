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
      querySql = '(select * from project pro where pro.create_user='+userId+')'
        + ' UNION'
        + ' (select p.* from project p left join user_rel_project up on p.id=up.project where up.user='+ userId +')'
      // querySql = `select p.* from project p left join user_rel_project up on p.id=up.project where up.user=${userId} or p.create_user=${userId};`;
    }
    return db.query(querySql);
  }
  /**
   * 根据id查询项目信息
   * @param {number} id 
   */
  find(id) {
    return db.query('select * from project left join user on project.create_user=user.id where project.id=' + id);
  }
  /**
   * 根据sign查询项目信息
   * @param {string} sign 
   */
  findProjectBySign(sign) {
    return db.query('select * from project where sign="' + sign + '"');
  }
  /**
   * 新增项目
   * @param {object} project 
   */
  addProject(project) {
    const sql = `insert into project (name, description, create_time, update_time, create_user, baseurl, sign) values ('${project.name}','${project.description}','${project.create_time}','${project.update_time}','${project.create_user}','${project.baseurl}', '${project.sign}')`;
    return db.query(sql);
  }
  /**
   * 获取项目成员
   * @param {number} project 
   */
  getMembers(project) {
    const sql = 'select user.id,user.username,user.nickname,user.email'
      + ' from project p left join user_rel_project r on p.id=r.project'
      + ' right join user on r.user=user.id where p.id='
      + project;
    return db.query(sql);
  }
  /**
   * 查询项目成员是否已经存在
   * @param {number} projectId 
   * @param {number} userId 
   */
  checkUserExsist(projectId, userId) {
    return db.query(`select * from user_rel_project where project=${projectId} and user=${userId}`);
  }
  /**
   * 添加项目成员
   * @param {number} projectId 
   * @param {number} userId 
   */
  addMember(projectId, userId) {
    return db.save('insert into user_rel_project (project, user) values(?,?)', [projectId, userId]);
  }
  /**
   * 移除指定的项目成员
   * @param {number} projectId 项目id
   * @param {number} userId 移除的用户id
   */
  removeMember(projectId, userId) {
    return db.query('delete from user_rel_project where project=' + projectId + ' and user=' + userId);
  }
  /**
   * 移除所有项目成员
   * @param {number} projectId 项目id
   */
  removeAllMembers(projectId) {
    return db.query('delete from user_rel_project where project=' + projectId);
  }
  /**
   * 删除项目
   * @param {number} projectId 
   */
  delete(projectId) {
    return db.query('delete from project where id=' + projectId);
  }
}
export default ProjectModel;
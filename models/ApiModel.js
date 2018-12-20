const db = require('../db/db.js');
class ApiModel {
  countApiByProject(projectId) {
    const querySql = `select count(1) count from api where project='${projectId}'`;
    return db.query(querySql);
  }
  getApiListByProject(projectId, pageNo, pageSize) {
    const from = pageSize * (pageNo - 1);
    const querySql = `select * from api where project='${projectId}' limit ${from},${pageSize}`;
    return db.query(querySql);
  }
  save(api) {
    let sql = '';
    if (!api.id) {
      sql = 'insert into api (name, method, url, description, project, `on`, mock_rule, create_user, create_time, update_time) values'
      + '(?,?,?,?,?,?,?,?,?,?)';
      return db.save(sql, [api.name, api.method, api.url, api.description, api.project, api.on, api.mockRule, api.createUser, api.createTime, api.updateTime]);
    } else {
      sql = 'UPDATE api SET name=?,method=?,url=?,description=?,`on`=?,mock_rule=?,update_time=? where api.id=' + api.id;
      return db.save(sql, [api.name, api.method, api.url, api.description, api.on, api.mockRule, api.updateTime]);
    }
  }
  deleteApi(id) {
    return db.query('delete from api where id=' + id);
  }
  findApi(id) {
    const querySql = 'select * from api where '
      + ' api.id=' + id;
    return db.query(querySql);
  }
  findApiMock(projectid, apiUrl) {
    const querySql = 'select mock_rule from api where api.project=' + projectid
      + ' and api.url="' + apiUrl + '"'; 
    return db.query(querySql);
  }
}
export default ApiModel;
const entities = require('../entity');
import Sequelize from 'sequelize';
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
      // querySql = `select * from project where create_user='${userId}'`;
      return entities.Project.findAll({
        where: { create_user: userId },
        include: {
          attributes: ['username', 'nickname'],
          model: entities.User,
          as: 'createUser'
        },
        order: [
          ['create_time', 'DESC']
        ]
      })
    } else if (source === 'join') {
      // querySql = `select * from project p left join user_rel_project up on p.id=up.project where up.user='${userId}'`;
      return entities.Project.findAll({
        order: [
          ['create_time', 'DESC']
        ],
        include: [
          { 
            model: entities.User,
            as: 'invitedUsers', // 别名必须和实体中的associate定义的别名一致
            required: true,
            attributes: ['username', 'nickname'],
            through: {
              attributes: [ 'username', 'nickname' ],
              where: {user: userId}
            }
          },
          { model: entities.User, as: 'createUser' }
        ]
      });
    } else {
      querySql = '(select * from project pro where pro.create_user='+userId+')'
        + ' UNION'
        + ' (select p.* from project p left join user_rel_project up on p.id=up.project where up.user='+ userId +')'
        + ' ORDER BY create_time desc';
      return entities.sequelizeInstance.query(querySql, { raw: true, type: Sequelize.QueryTypes.SELECT });
    }
  }
  /**
   * 管理员身份获取所有项目列表
   * pageNo 分页
   */
  getAllProjects(pageNo = 1, pageSize = 12) {
    return entities.Project.findAll({
      where: {},
      include: {
        attributes: ['username', 'nickname'],
        model: entities.User,
        as: 'createUser'
      },
      offset: pageSize * (pageNo - 1),
      limit: pageSize / 1,
      order: [
        ['create_time', 'DESC']
      ]
    });
  }
  countAllProject() {
    return entities.Project.count({});
  }
  /**
   * 根据id查询项目信息
   * @param {number} id 
   */
  find(id) {
    return entities.Project.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: entities.User,
          as: 'createUser', // 别名必须和实体中的associate定义的别名一致
          attributes: ['username', 'nickname', 'email', 'id']
        }
      ]
    })
  }
  /**
   * 根据sign查询项目信息
   * @param {string} sign 
   */
  findProjectBySign(sign) {
    return entities.Project.findAll({
      where: { sign: sign }
    });
  }
  /**
   * 新增项目
   * @param {object} project 
   */
  addProject(project) {
    return entities.Project.create(project);
  }
  /**
   * 获取项目成员
   * @param {number} project 
   */
  getMembers(project) {
    return entities.User.findAll({
      where: {},
      attributes: ['id', 'username', 'nickname', 'email'],
      include: [
        { model: entities.Project, as: 'joinedProjects',
          attributes: [],
          required: true,
          through: {
            where: { project: project }
          }
        }
      ]
    });
  }
  /**
   * 查询项目成员是否已经存在
   * @param {number} projectId 
   * @param {number} userId 
   */
  checkUserExsist(projectId, userId) {
    // return db.query(`select * from user_rel_project where project=${projectId} and user=${userId}`);
    return entities.User.findAll({
      attributes: ['id', 'username', 'nickname', 'email'],
      include: [{
        model: entities.Project, as: 'joinedProjects', attributes: [], required: true,
        through: {
          where: { project: projectId, user: userId }
        }
      }]
    });
  }
  /**
   * 添加项目成员
   * @param {number} projectId 
   * @param {number} userId 
   */
  addMember(projectId, userId) {
    return entities.UserProject.create({
      project: projectId,
      user: userId
    });
  }
  /**
   * 移除指定的项目成员
   * @param {number} projectId 项目id
   * @param {number} userId 移除的用户id
   */
  removeMember(projectId, userId) {
    return entities.UserProject.destroy({
      where: {
        project: projectId,
        user: userId
      }
    });
  }
  /**
   * 移除所有项目成员
   * @param {number} projectId 项目id
   */
  removeAllMembers(projectId) {
    return entities.UserProject.destroy({
      where: {
        project: projectId
      }
    });
  }
  /**
   * 删除项目
   * @param {number} projectId 
   */
  delete(projectId) {
    return entities.Project.destroy({
      where: { id: projectId }
    })
  }
}
export default ProjectModel;
const entities = require('../entity');
import Sequelize from 'sequelize';
const Op = Sequelize.Op
class ApiModel {
  countApiByProject(projectId) {
    return entities.Api.count({
      where: {
        project: projectId
      }
    });
  }
  getApiListByProject(projectId, pageNo, pageSize, name = '', url = '') {
    return entities.Api.findAll({
      where: {
        project: projectId,
        name: {
          [Op.like]: '%' + name + '%',
        },
        url: {
          [Op.like]: '%' + url + '%',
        }
      },
      offset: pageSize * (pageNo - 1),
      limit: pageSize / 1,
      order: [
        ['create_time', 'DESC']
      ]
    });
  }
  /**
   * 检查当前下面是否已经存在接口地址
   */
  checkProjectApiUrlExsist(projectId, url) {
    return entities.Api.findAll({
      where: {
        project: projectId,
        url: url
      }
    });
  }
  /**
   * 保存api， 如果有id则执行update否则执行insert
   * @param {number} api 
   */
  save(api) {
    if (!api.id) {
      return entities.Api.create(api);
    } else {
      return entities.Api.update(api, {
        where: { id: api.id }
      });
    }
  }
  /**
   * 根聚api id删除api
   * @param {number} id 
   */
  deleteApi(id) {
    return entities.Api.destroy({
      where: { id: id }
    });
  }
  /**
   * 根聚项目id删除项目下面所有api
   * @param {number} projectId
   */
  deleteByProjectId(projectId) {
    return entities.Api.destroy({
      where: { project: projectId }
    });
  }
  /**
   * 查询Api详情
   * @param {*} id 
   */
  findApi(id) {
    return entities.Api.findOne({
      where: { id: id }
    });
  }
  /**
   * 获取Api的mock规则
   * @param {*} projectid 
   * @param {*} apiUrl 
   */
  findApiMock(projectid, apiUrl) {
    return entities.Api.findAll({
      where: {
        project: projectid,
        url: apiUrl
      },
      attributes: ['mockRule']
    })
  }
  /**
   * 获取项目的所有api
   * @param {number} projectid 
   */
  findApiByProjectId(projectid) {
    return entities.Api.findAll({
      where: { project: projectid }
    })
  }
}
export default ApiModel;
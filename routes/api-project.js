const ETools = require('etools');
var config = require('config');
const { ResponseFormat } = require('../utils');
var wwwBaseUrl = config.get('wwwBaseUrl');
function apiProject(router, projectModel, loginModel, apiModel, crypto) {
  router.get('/project/list', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    let userId = req.session.userId;
    let source = req.query.source;
    const pageNo = req.query.pageNo || 1;
    const pageSize = req.query.pageSize || 12;
    try {
      let rows = [];
      let totalRecord = 0;
      if (req.session.userInfo.role === 1) {
        rows = await projectModel.getAllProjects(pageNo, pageSize);
        totalRecord = await projectModel.countAllProject();
      } else {
        rows = await projectModel.getProjectList(userId, source);
      }
      if (rows) {
        responseFormat.jsonSuccess({
          pageNo: pageNo / 1,
          totalRecord: totalRecord,
          projectList: rows
        });
      } else {
        responseFormat.jsonError('查询失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  router.post('/project/add', function(req, res) {
    const responseFormat = new ResponseFormat(res);
    let userId = req.session.userId;
    const sign = ETools.string.generateUUID();
    const signMD5 = crypto.createHash('md5').update('' + sign).digest('hex');
    const project = {
      create_user: userId,
      name: req.body.name,
      description: req.body.description,
      baseurl: req.body.baseurl,
      // create_time: nowStr, // 创建时间和更新时间交给sequelize维护
      // update_time: nowStr,
      sign: signMD5
    }
    projectModel.addProject(project).then(rows => {
      if (rows) {
        responseFormat.jsonSuccess({ projectList: rows });
      } else {
        responseFormat.jsonError('添加失败');
      }
    }).catch(error => {
      responseFormat.jsonError(error);
    });
  });
  // 获取单个项目信息
  router.get('/project/:id', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const id = req.params.id;
    try {
      const resp = await projectModel.find(id);
      if (resp) {
        let p = resp[0];
        const mockBasePath = wwwBaseUrl + '/mock/' + p.sign + p.baseurl;
        responseFormat.jsonSuccess({ project: p, mockBasePath: mockBasePath });
      }else {
        responseFormat.jsonError('查询失败');
      }
    } catch (err) {
      responseFormat.jsonError(err);
    }
  });
  // 获取项目成员（邀请的成员）
  router.get('/projectMembers/:pid', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    let projectId = req.params.pid;
    try {
      const resp = await projectModel.getMembers(projectId);
      if (resp) {
        responseFormat.jsonSuccess(resp);
      } else {
        responseFormat.jsonError('查询失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  // 验证成员是否已经存在
  router.get('/searchUserExtendProjectExsist', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const { key, projectId } = req.query;
    try {
      const resp = await loginModel.searchUserExtendProjectExsist(key, projectId);
      if (resp) {
        responseFormat.jsonSuccess(resp);
      } else {
        responseFormat.jsonError('搜索失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  // 邀请项目成员
  router.post('/project/addmember', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const { projectId, userId } = req.body;
    try {
      // 检测用户在项目中是否已经存在
      const checkResult = await projectModel.checkUserExsist(projectId, userId);
      if (checkResult && checkResult.length > 0) {
        responseFormat.jsonError('该用户已经存在于当前项目，不能重复添加');
        return false;
      }
      const addedUserProject = await projectModel.addMember(projectId, userId);
      if (addedUserProject) {
        responseFormat.jsonSuccess('success');
      } else {
        responseFormat.jsonError('添加失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  // 删除项目成员
  router.post('/project/removemember', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const { projectId, userId } = req.body;
    try {
      const resp = await projectModel.removeMember(projectId, userId);
      if (resp) {
        responseFormat.jsonSuccess('success');
      } else {
        responseFormat.jsonError('操作失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  // 删除项目，删除项目所有成员和接口
  router.post('/project/delete', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const { projectId } = req.body;
    try {
      // const [ resp, resp1, resp2 ] = await Promise.all([projectModel.removeAllMembers(projectId),
      //   apiModel.deleteByProjectId(projectId), projectModel.delete(projectId)]);
      const deleteMemebersPromise = projectModel.removeAllMembers(projectId);
      const deleteApiPromise = apiModel.deleteByProjectId(projectId);
      const deleteProjectPromise = projectModel.delete(projectId);
      const resp = await deleteMemebersPromise;
      const resp1 = await deleteApiPromise;
      const resp2 = await deleteProjectPromise;
      responseFormat.jsonSuccess('success');
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
}
module.exports = apiProject;
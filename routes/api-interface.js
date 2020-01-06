const ETools = require('etools');
const { ResponseFormat } = require('../utils');
function apiInterface(router, apiModel) {
  router.get('/api/list', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    let projectId = req.query.projectId;
    let pageNo = req.query.pageNo / 1;
    let pageSize = req.query.pageSize;
    let name = req.query.name;
    let url = req.query.url;
    let totalCount = 0;
    const conutRows = await apiModel.countApiByProject(projectId);
    if (conutRows) {
      totalCount = conutRows;
    }
    try {
      const apiList = await apiModel.getApiListByProject(projectId, pageNo, pageSize, name, url);
      if (apiList) {
        responseFormat.jsonSuccess({
          pageNo,
          totalCount,
          apiList
        });
      } else {
        responseFormat.jsonError('查询失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  router.post('/api/add', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const body = req.body;
    const userId = req.session.userId;
    let apiData = {
      id: body.id,
      name: body.name,
      method: body.method,
      delay: parseInt(body.delay || 0),
      url: body.url,
      description: body.description,
      mockRule: body.mockRule,
      project: body.project,
      on: body.on ? 1 : 0,
      createUser: userId
    }
    try {
      // 新增模式下验证url是否已经存在
      const curProjectUrl = await apiModel.checkProjectApiUrlExsist(apiData.project, apiData.url);
      if (!apiData.id && curProjectUrl && curProjectUrl.length > 0) {
        responseFormat.jsonError('您输入的url在当前项目中已经存在！');
        return false;
      }
      const result = await apiModel.save(apiData);
      if (result) {
        responseFormat.jsonSuccess(apiData);
      } else {
        responseFormat.jsonError('添加失败');
      }
    } catch (error) {
      responseFormat.jsonError(error);
    }
  });
  router.get('/api/delete', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const id = req.query.id;
    try {
      const result = await apiModel.deleteApi(id);
      if (result) {
        responseFormat.jsonSuccess('');
      } else {
        responseFormat.jsonError('删除失败');
      }
    } catch (err) {
      responseFormat.jsonError(err);
    }
  });
  router.get('/api/:id', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    const id = req.params.id;
    try {
      const result = await apiModel.findApi(id);
      if (result) {
        responseFormat.jsonSuccess({
          apiInfo: result
        });
      } else {
        responseFormat.jsonError('删除失败');
      }
    } catch (err) {
      responseFormat.jsonError(err);
    }
  });
}
module.exports = apiInterface;
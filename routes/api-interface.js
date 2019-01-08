import ETools from 'etools';
import { ResponseFormat } from '../utils';
function apiInterface(router, apiModel) {
  router.get('/api/list', async function(req, res) {
    const responseFormat = new ResponseFormat(res);
    let projectId = req.query.projectId;
    let pageNo = req.query.pageNo / 1;
    let pageSize = req.query.pageSize;
    let totalCount = 0;
    const conutRows = await apiModel.countApiByProject(projectId);
    if (conutRows) {
      totalCount = conutRows;
    }
    try {
      const apiList = await apiModel.getApiListByProject(projectId, pageNo, pageSize);
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
      url: body.url,
      description: body.description,
      mockRule: body.mockRule,
      project: body.project,
      on: body.on ? 1 : 0,
      createUser: userId
    }
    try {
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
export default apiInterface;
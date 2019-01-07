class ResponseFormat {
  constructor(response) {
    this.res = response;
  }
  json(code, desc, data) {
    this.res.json({
      code: code,
      desc: desc,
      data: data
    })
  }
  jsonSuccess(data) {
    this.res.json({
      code: '0000',
      desc: '成功',
      data: data
    })
  }
  jsonError(error) {
    this.res.json({
      code: '0002',
      desc: typeof error === 'object' ? error.name + ':' + error.message : error,
      data: null
    })
  }
}
export default ResponseFormat;
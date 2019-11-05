const { ResponseFormat } = require('../utils');
module.exports = function(req, res, next){
  res.responseFormat = new ResponseFormat(res);
  next();
};

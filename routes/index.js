var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('build', { title: 'HOME' });
});
module.exports = router;

var express = require('express');
var router = express.Router();
import { ResponseFormat } from '../utils';
const db = require('../db/db.js');
const entities = require('../entity');
/* GET users listing. */
router.get('/', async function(req, res) {
  const responseFormat = new ResponseFormat(res);
  db.query('select 1+1').then( resp => {
    responseFormat.jsonSuccess(resp);
  }).catch( err => {
    responseFormat.jsonError('查询失败');
  });
});
router.get('/projects/join/:pid', function(req, response) {
  console.log(req.params.pid);
  entities.User.findAll({
    where: {
      // id: req.params.pid
    },
    include: [
      { 
        model: entities.Project,
        as: 'joinedProjects',
        required: true,
        attributes: [ 'id', 'name' ],
        through: {
          attributes: [ 'user' ],
          where: {
            project: req.params.pid
          }
        }
      }
      // { model: Picture, as: 'ProfilePicture' }, // load the profile picture.
      // Notice that the spelling must be the exact same as the one in the association
    ]
  }).then(res => {
    response.send(res);
  });
});

module.exports = router;

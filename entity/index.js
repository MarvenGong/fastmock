const Sequelize = require('sequelize');
const config = require('config');
const dbConfig = config.get('db');
const sequelizeOptions = config.get('sequeliszeOptions');
let sequelizeInstance = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, sequelizeOptions);
var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(__filename);
let entities = {};
fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  }).forEach(file => {
    var model = sequelizeInstance['import'](path.join(__dirname, file));
    entities[model.name] = model;
  });

Object.keys(entities).forEach(modelName => {
  if (entities[modelName].associate) {
    entities[modelName].associate(entities);
  }
});
entities.sequelizeInstance = sequelizeInstance;
module.exports = entities;

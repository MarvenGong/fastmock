const Sequelize = require('sequelize');
const config = require('config');
const dbConfig = config.get('db');
const sequelizeOptions = config.get('sequeliszeOptions');
let sequelizeInstance = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, sequelizeOptions);
sequelizeInstance
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelizeInstance;
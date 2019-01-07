const sequelize = require('../db/sequelize');
const Sequelize = require('sequelize');
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  nickname: Sequelize.STRING
}, {
  // don't forget to enable timestamps!
  timestamps: false,
  // I don't want createdAt
  createdAt: false,
  // I want updatedAt to actually be called updateTimestamp
  updatedAt: 'updateTimestamp',
  // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
  deletedAt: 'destroyTime',
  tableName: 'user',
  paranoid: true
});
module.exports = User;
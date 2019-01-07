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
  nickname: Sequelize.STRING,
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at'
  },
}, {
  // 实例对应的表名
  tableName: 'user',
  // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
  timestamps: true,
  // 将createdAt对应到数据库的created_at字段
  createdAt: 'created_at',
  // 将updatedAt对应到数据库的updated_at字段
  updatedAt: 'updated_at',
  // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
  deletedAt: false, //'deleted_at',
  // 删除数据时不删除数据，而是更新deleteAt字段 如果需要设置为true，则上面的deleteAt字段不能为false，也就是说必须启用
  paranoid: false
});
module.exports = User;
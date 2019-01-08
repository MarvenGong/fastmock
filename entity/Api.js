const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = (sequelize) => {
  let Api = sequelize.define('Api', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    method: Sequelize.STRING,
    url: Sequelize.STRING,
    description: Sequelize.STRING,
    on: {
      type: Sequelize.INTEGER
    },
    mockRule: {
      type: Sequelize.STRING,
      field: 'mock_rule'
    },
    create_time: {
      field: 'create_time',
      type: Sequelize.DATE,
      get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    update_time: {
      field: 'update_time',
      type: Sequelize.DATE,
      get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    // 实例对应的表名
    tableName: 'api',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false,
    paranoid: false
  });
  Api.associate = models => {
    models.Api.belongsTo(models.Project, {
      as: 'belongProject',
      foreignKey: 'project',
      onDelete: null
    });
    models.Api.belongsTo(models.User, {
      as: 'createUser',
      foreignKey: 'create_user',
      onDelete: null
    });
  };
  return Api;
}
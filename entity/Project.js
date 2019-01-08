const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = (sequelize) => {
  let Project = sequelize.define('Project', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    sign: Sequelize.STRING,
    description: Sequelize.STRING,
    baseurl: Sequelize.STRING,
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
    tableName: 'project',
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    timestamps: true,
    // 将createdAt对应到数据库的created_at字段
    createdAt: 'create_time',
    // 将updatedAt对应到数据库的updated_at字段
    updatedAt: 'update_time',
    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    deletedAt: false, //'deleted_at',
    // 删除数据时不删除数据，而是更新deleteAt字段 如果需要设置为true，则上面的deleteAt字段不能为false，也就是说必须启用
    paranoid: false
  });
  Project.associate = models => {
    models.Project.belongsToMany(models.User, {
      as: 'invitedUsers',
      through: models.UserProject,
      foreignKey: 'project',
      otherKey: 'user'
    });
    models.Project.belongsTo(models.User, {
      as: 'createUser',
      foreignKey: 'create_user',
      onDelete: null
    });
  };
  return Project;
}

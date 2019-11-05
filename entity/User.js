const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = (sequelizeIns) => {
  let User = sequelizeIns.define('User', {
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
    role: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    activeCode: {
      type: Sequelize.STRING,
      field: 'active_code'
    },
    codeExpire: {
      type: Sequelize.BIGINT,
      field: 'code_expire'
    },
    createdAt: {
      field: 'create_time',
      type: Sequelize.DATE,
      get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      field: 'update_time',
      type: Sequelize.DATE,
      get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    // 实例对应的表名
    tableName: 'user',
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    timestamps: true,
    // 将createdAt对应到数据库的create_time字段
    createdAt: 'create_time',
    // 将updatedAt对应到数据库的update_time字段
    updatedAt: 'update_time',
    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    deletedAt: false, //'deleted_at',
    // 删除数据时不删除数据，而是更新deleteAt字段 如果需要设置为true，则上面的deleteAt字段不能为false，也就是说必须启用
    paranoid: false
  });
  User.associate = (models) => {
    models.User.belongsToMany(models.Project, {
      through: models.UserProject,
      foreignKey: 'user',
      otherKey: 'project',
      as: 'joinedProjects'
    });
  };
  return User;
}
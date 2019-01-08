const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  let UserProject = sequelize.define('UserProject', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  }, {
    tableName: 'user_rel_project',
    timestamps: false
  });
  return UserProject;
}
const Op = require('sequelize').Op;
module.exports = {
  'wwwBaseUrl': 'http://localhost:3000',
  'db': {
    'connectionLimit' : 10,
    'host'            : 'localhost',
    'user'            : 'root',
    'database'        : 'fastmock'
  },
  'sequeliszeOptions': {
    'dialect': 'mysql',
    'host': 'localhost',
    'port': 3306,
    'operatorsAliases': {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $regexp: Op.regexp,
      $notRegexp: Op.notRegexp,
      $iRegexp: Op.iRegexp,
      $notIRegexp: Op.notIRegexp,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $overlap: Op.overlap,
      $contains: Op.contains,
      $contained: Op.contained,
      $adjacent: Op.adjacent,
      $strictLeft: Op.strictLeft,
      $strictRight: Op.strictRight,
      $noExtendRight: Op.noExtendRight,
      $noExtendLeft: Op.noExtendLeft,
      $and: Op.and,
      $or: Op.or,
      $any: Op.any,
      $all: Op.all,
      $values: Op.values,
      $col: Op.col
    },
    'pool': {
      'max': 5,
      'min': 0,
      'acquire': 30000,
      'idle': 10000
    },
    'logging': console.log,
    'dialectOptions': {
      'supportBigNumbers': true,
      'bigNumberStrings': true,
      'charset': "utf8",
      'collate': "utf8_general_ci",
    }
  },
  'radis': null
};
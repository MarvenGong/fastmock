var db    = {};
var mysql = require('mysql');
var config = require('config');
var dbConfig = config.get('db');
var pool  = mysql.createPool(dbConfig);
var enviroment = config.get('enviroment');
var doQuery = function(sql, values) {
  return new Promise((resolve, reject) => {
    if (!sql) {
      reject();
    } else {
      pool.getConnection(function(err,conn){
        if(err){
          reject(err);
        }else{
          if (enviroment === 'dev') {
            console.log('========数据库连接成功执行SQL查询========');
            console.log(sql);
          }
          var queryValues = values || null;
          conn.query(sql, queryValues, function(err,results,fields){
            // 释放连接  
            conn.release();
            if(err){
              reject(err);
            } else {
              // 事件驱动回调
              if (enviroment === 'dev') {
                console.log('========db查询结果========');
                console.log(JSON.parse(JSON.stringify(results)));
              }
              resolve(JSON.parse(JSON.stringify(results)));
            }
          });
        }
      });
    }
  });
}
db.query = function(sql){
  return doQuery(sql);
}
/**
 * 插入数据
 */
db.save = function(sql, values) {
  return doQuery(sql, values);
}
module.exports = db;
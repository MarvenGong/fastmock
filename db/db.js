var db    = {};
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'fastmock'
});
 
db.query = function(sql){
  return new Promise((resolve, reject) => {
    if (!sql) {
      reject();
    } else {
      pool.getConnection(function(err,conn){
        if(err){
          reject(err);
        }else{
          console.log('========数据库连接成功执行SQL查询========');
          console.log(sql);
          conn.query(sql,function(err,results,fields){
            // 释放连接  
            conn.release();
            if(err){
              reject(err);
            } else {
              // 事件驱动回调
              console.log('========db查询结果========');
              console.log(JSON.parse(JSON.stringify(results)));
              resolve(JSON.parse(JSON.stringify(results)));
            }
          });
        }
      });
    }
  });
}
/**
 * 插入数据
 */
db.save = function(sql, values) {
  return new Promise((resolve, reject) => {
    if (!sql) {
      reject();
    } else {
      pool.getConnection(function(err,conn){
        if(err){
          reject(err);
        }else{
          console.log('========数据库连接成功执行SQL查询========');
          console.log(sql);
          conn.query(sql, values, function(err,results){
            // 释放连接  
            conn.release();
            if(err){
              reject(err);
            } else {
              // 事件驱动回调
              console.log('========db查询结果========');
              console.log(JSON.parse(JSON.stringify(results)));
              resolve(JSON.parse(JSON.stringify(results)));
            }
          });
        }
      });
    }
  });
}
module.exports = db;
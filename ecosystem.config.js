module.exports = {
  apps: [
    {
      // 生产环境
      name: "fastmockProd",
      // 项目启动入口文件
      script: "./bin/www",
      // 项目环境变量
      env: {
        "NODE_ENV": "production"
      },
      env_production : {
        NODE_ENV: 'production'  //使用production模式 pm2 start ecosystem.config.js --env production
      },
    },
// 　　{
//       // 测试环境
//       name: "test",
//       // 项目启动入口文件
//       script: "./index.js",
//       // 项目环境变量
//       env: {
//         "NODE_ENV": "test"
//       }
//     }
]}
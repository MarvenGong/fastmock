module.exports = {
  'wwwBaseUrl': 'http://localhost:3000',
  'enviroment': 'dev',
  'db': {
    'password'        : ''
  },
  'radis': {
    'host': 'localhost',
    'port': '6379',
    'ttl': 7200,
    'logErrors': true
  },
  'sequeliszeOptions': {
    'logging': console.log
  }
};
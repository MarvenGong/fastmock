module.exports = {
  'wwwBaseUrl': 'https://www.fastmock.site',
  'enviroment': 'prod',
  'db': {
    'password'        : 'ling.520*1314',
    'socketPath'      : '/opt/lampp/var/mysql/mysql.sock'
  },
  'radis': {
    'host': 'localhost',
    'port': '6379',
    'ttl': 7200,
    'logErrors': false
  },
  'sequeliszeOptions': {
    'logging': false,
    'dialectOptions': {
      'socketPath': '/opt/lampp/var/mysql/mysql.sock'
    }
  }
}
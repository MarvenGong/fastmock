module.exports = {
  'wwwBaseUrl': 'http://129.204.116.48:3000',
  'enviroment': 'prod',
  'db': {
    'password'        : 'ling.520*1314',
    'socketPath'      : '/opt/lampp/var/mysql/mysql.sock'
  },
  'radis': {
    'host': 'localhost',
    'port': '6379',
    'ttl': 1800,
    'logErrors': false
  },
  'sequeliszeOptions': {
    'logging': false,
    'dialectOptions': {
      'socketPath': '/opt/lampp/var/mysql/mysql.sock'
    }
  }
}
const { injectBabelPlugin, paths } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireAliases = require('react-app-rewire-aliases');
const path = require('path');
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config
  );
  config = rewireAliases.aliasesOptions({
    '@': path.resolve(__dirname, `${paths.appSrc}/`),
    '@components': path.resolve(__dirname, `${paths.appSrc}/components/`)
  })(config, env);
  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#339966', '@link-color': '#339966' },
    javascriptEnabled: true
  })(config, env);
  return config;
};

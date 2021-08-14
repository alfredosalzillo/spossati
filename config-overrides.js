const {
  override,
  addWebpackAlias,
} = require('customize-cra');
const { configPaths } = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json');

module.exports = override(
  addWebpackAlias(aliasMap),
);

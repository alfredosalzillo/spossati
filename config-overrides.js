const {
  override,
} = require('customize-cra');
const { configPaths, alias } = require('react-app-rewire-alias');

const aliasMap = configPaths('./tsconfig.paths.json');
module.exports = override(
  alias(aliasMap),
);

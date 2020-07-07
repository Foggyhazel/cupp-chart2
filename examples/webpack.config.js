const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|ts|jsx|tsx)$/,
    include: path.resolve(__dirname, "../src"),
    exclude: /node_modules/,
    use: "babel-loader",
  });

  config.resolve.plugins = config.resolve.plugins.filter(
    (p) => !(p instanceof ModuleScopePlugin)
  );

  return config;
};

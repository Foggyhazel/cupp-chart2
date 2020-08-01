module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "cupp-chart2": "./src",
          },
        },
      ],
    ],
  };
};

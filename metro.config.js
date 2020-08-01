const { getDefaultConfig } = require("metro-config");
const path = require("path");

module.exports = (async () => {
  const {
    resolver: { assetExts },
  } = await getDefaultConfig();
  return {
    watchFolders: [path.resolve(__dirname, "../relative/path/to/local/lib")],
    resolver: {
      assetExts: [...assetExts, "csv"],
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => {
            if (target.hasOwnProperty(name)) {
              return target[name];
            }
            return path.join(process.cwd(), `node_modules/${name}`);
          },
        }
      ),
    },
  };
})();

const path = require("path");
const src = path.resolve(__dirname, "../src");

module.exports = {
  projectRoot: __dirname,
  watchFolders: [src],

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

/* eslint-disable no-undef */
const path = require("path");

const src = path.resolve(__dirname, "../src");
const root = path.resolve(__dirname, "..");

module.exports = {
  projectRoot: __dirname,
  watchFolders: [src],
  resolver: {
    extraNodeModules: {
      "d3-shape": path.resolve(root, "node_modules", "d3-shape"),
    },
  },
  /*
  resolver: {
    blacklistRE: blacklist([
      new RegExp(`^${escape(path.join(root, "node_modules"))}\\/.*$`),
    ]),
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
  },*/

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

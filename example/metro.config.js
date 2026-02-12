const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const root = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  ...defaultConfig,

  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    ...defaultConfig.resolver,
    // Resolve modules from both example and root node_modules
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(root, 'node_modules'),
    ],
    // Force single versions of React to avoid version conflicts
    extraNodeModules: {
      react: path.resolve(root, 'node_modules/react'),
      'react-dom': path.resolve(root, 'node_modules/react-dom'),
    },
  },
};

config.resolver.assetExts.push('wasm');
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;

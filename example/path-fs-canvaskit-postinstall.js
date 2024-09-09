// To be added in package.json "postinstall": "(...) && node path-fs-canvaskit-postinstall.js"
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(
  __dirname,
  'node_modules',
  'canvaskit-wasm',
  'package.json'
);
const packageJson = require(packageJsonPath);

packageJson.browser = {
  fs: false,
  path: false,
  os: false,
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

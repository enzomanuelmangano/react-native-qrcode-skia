// To be added in package.json "postinstall": "(...) && node path-fs-canvaskit-postinstall.js"
const fs = require('fs');
const path = require('path');

// Try multiple possible locations for canvaskit-wasm
const possiblePaths = [
  path.join(__dirname, 'node_modules', 'canvaskit-wasm', 'package.json'),
  path.join(__dirname, '..', 'node_modules', 'canvaskit-wasm', 'package.json'),
  path.join(
    __dirname,
    'node_modules',
    '@shopify',
    'react-native-skia',
    'node_modules',
    'canvaskit-wasm',
    'package.json'
  ),
];

let packageJsonPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    packageJsonPath = p;
    break;
  }
}

if (!packageJsonPath) {
  console.log('canvaskit-wasm package.json not found, skipping patch');
  process.exit(0);
}

const packageJson = require(packageJsonPath);

packageJson.browser = {
  fs: false,
  path: false,
  os: false,
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Successfully patched canvaskit-wasm at:', packageJsonPath);

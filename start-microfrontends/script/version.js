const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// Accept app name as a command-line argument
const appName = process.argv[2];
if (!appName) {
  console.error('Usage: node script/version.js <app-name>');
  process.exit(1);
}

// Path to environments directory of the selected app
const envDir = path.join(__dirname, '..', 'apps', appName, 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}
const content = `export const APP_VERSION = '${appName.toUpperCase()}:${version}';\n`;
fs.writeFileSync(path.join(envDir, 'version.ts'), content);

console.log(`Generated version.ts for ${appName} at ${path.join(envDir, 'version.ts')}`);

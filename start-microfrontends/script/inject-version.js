// script/inject-version.js
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];
if (!projectName) {
  console.error('❌ Usage: node inject-version.js <project-name>');
  process.exit(1);
}

const indexPath = path.join('dist', 'apps', projectName, 'index.html');
const version = process.env.VERSION || require('../package.json').version;

if (!fs.existsSync(indexPath)) {
  console.error(`❌ File not found: ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/__BUILD_VERSION__/g, `v${version}`);
fs.writeFileSync(indexPath, html, 'utf8');

console.log(`✅ Injected version ${version} into ${indexPath}`);

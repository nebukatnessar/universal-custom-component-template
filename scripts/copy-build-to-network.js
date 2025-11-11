const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const sourceDir = path.resolve(__dirname, '../dist');
const networkPath = '\\\\web10\\wildcard\\9grid'; // Pas dit aan naar jouw netwerkpad

async function copyBuild() {
  try {
    console.log(`Copying from ${sourceDir} to ${networkPath}...`);
    await fse.copy(sourceDir, networkPath, { overwrite: true });
    console.log('✅ Build copied successfully.');
  } catch (err) {
    console.error('❌ Error copying build:', err);
    process.exit(1);
  }
}

copyBuild();

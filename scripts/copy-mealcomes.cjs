/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs-extra');
const path = require('path');

const source = path.resolve(__dirname, '../dist/mealcomes');
const target = path.resolve(__dirname, '../packages/mealcomes');

fs.copySync(source, target, {
    overwrite: true,
    errorOnExist: false
});

console.log(`✅ Copied ${source} → ${target}`);

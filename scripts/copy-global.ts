import fs from 'fs';
import path from 'path';

const src = path.resolve(__dirname, '../typings/global.d.ts');
const dest = path.resolve(__dirname, '../packages/mealcomes/dist/global.d.ts');

fs.copyFileSync(src, dest);
console.log('✅ global.d.ts copied!');
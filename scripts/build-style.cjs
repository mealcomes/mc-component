/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const fs = require('fs');
const sass = require('sass');

const themeDir = path.resolve(__dirname, '../packages/theme-chalk/src');
const distDir = path.resolve(__dirname, '../dist/mealcomes/theme-chalk');
const distSrcDir = path.join(distDir, 'src');

fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(distSrcDir, { recursive: true });

function compileScss(inputPath, outputPath, outputScssPath) {
    const result = sass.compile(inputPath, { style: 'expanded' });
    fs.writeFileSync(outputPath, result.css);
    fs.copyFileSync(inputPath, outputScssPath);
    console.log(`✅ ${path.basename(outputPath)} built!`);
    console.log(`📦 ${path.basename(outputScssPath)} copied!`);
}

fs.readdirSync(themeDir).forEach(file => {
    if (file.endsWith('.scss')) {
        compileScss(
            path.join(themeDir, file),
            path.join(distDir, file.replace('.scss', '.css')),
            path.join(distSrcDir, file)
        );
    }
});

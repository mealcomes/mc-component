import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

const pathPrefix = '../dist/mealcomes';

export default defineConfig({
    plugins: [vue(), vueJsx()],
    build: {
        outDir: path.resolve(__dirname, `${pathPrefix}/dist/umd`),
        lib: {
            entry: path.resolve(__dirname, `../packages/mealcomes/index.ts`),
            name: 'MealComes',
            fileName: format => `index.${format}.js`,
            formats: ['umd']
        },
        sourcemap: true,
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                exports: 'named',
                assetFileNames(chunkInfo) {
                    if (chunkInfo.names[0] === 'mealcomes.css')
                        return 'index.css';
                    return chunkInfo.names[0];
                }
            }
        }
    }
});

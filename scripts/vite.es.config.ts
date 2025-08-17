import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

const pathPrefix = '../dist/mealcomes';

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        dts({
            outDir: path.resolve(__dirname, `${pathPrefix}/dist/types`),
            tsconfigPath: path.resolve(__dirname, '../tsconfig.json')
        })
    ],
    build: {
        outDir: path.resolve(__dirname, `${pathPrefix}/dist/es`),
        lib: {
            entry: path.resolve(__dirname, `../packages/mealcomes/index.ts`),
            name: 'MealComes',
            fileName: format => `index.${format}.js`,
            formats: ['es']
        },
        sourcemap: true,
        rollupOptions: {
            external: ['vue', 'async-validator'],
            output: {
                assetFileNames(chunkInfo) {
                    if (chunkInfo.names[0] === 'mealcomes.css')
                        return 'index.css';
                    return chunkInfo.names[0];
                }
            }
        }
    }
});

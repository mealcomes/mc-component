import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { readdirSync } from 'fs';
import { map, filter } from 'lodash';

const pathPrefix = '../dist/mealcomes';

function getDirectoriesSync(basePath: string) {
    const entries = readdirSync(basePath, { withFileTypes: true });
    return map(
        filter(entries, entry => entry.isDirectory()),
        entry => entry.name
    );
}

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
                },
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    if (id.includes('/packages/utils')) {
                        return 'utils';
                    }
                    for (const dirName of getDirectoriesSync(
                        './packages/components'
                    )) {
                        if (id.includes(`/packages/components/${dirName}`)) {
                            return dirName;
                        }
                    }
                }
            }
        }
    }
});

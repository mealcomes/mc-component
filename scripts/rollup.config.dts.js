import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

export default defineConfig({
    input: 'dist/mealcomes/dist/types/mealcomes/index.d.ts',
    output: {
        file: 'dist/mealcomes/dist/es/index.d.ts',
        format: 'es'
    },
    plugins: [dts()]
});

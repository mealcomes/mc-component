// 整合组件，最终实现导出组件

import { withInstall } from '@mealcomes/utils';
import _Icon from './src/icon.vue';

// 给组件添加 install 函数，用于在 vue 中安装组件
const Icon = withInstall(_Icon);

export default Icon;  // 此时可以通过 app.use 来使用，也可以通过 import 方式单独使用

export * from './src/icon'

// 这里添加的类型，可以在模板(<template><el-icon></el-icon></template>)中被解析到
declare module 'vue' {
    export interface GlobalComponents {  // 接口可以自动合并
        MIcon: typeof Icon
    }
}
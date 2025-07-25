// 整合组件，最终实现导出组件

import { withInstall } from '@mealcomes/utils';
import _Icon from './src/icon.vue';

// 给组件添加 install 函数，用于在 vue 中安装组件
const Icon = withInstall(_Icon);

export default Icon; // 此时可以通过 app.use 来使用，也可以通过 import 方式单独使用

export * from './src/icon';

// 这里添加的类型，可以在模板(<template><el-icon></el-icon></template>)中被解析到
// 打开 Vue 类型定义模块，向其中扩展内容
declare module 'vue' {
    // GlobalComponents：Vue 类型系统中定义的一个接口，用于描述所有注册的全局组件
    export interface GlobalComponents {
        // MIcon: typeof Icon：将名为 MIcon 的组件注册进去，并绑定它的类型定义
        MCIcon: typeof Icon;
    }
}

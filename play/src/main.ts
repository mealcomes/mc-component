import { createApp } from 'vue';
import App from './App.vue';

import '@mealcomes/theme-chalk/src/index.scss';
import Icon from '@mealcomes/components/icon';
import Tree from '@mealcomes/components/tree';

const plugins = [Icon, Tree];

const app = createApp(App);

plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件

app.mount('#app');

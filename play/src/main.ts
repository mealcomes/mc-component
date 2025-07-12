import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@mealcomes/components/icon'
import '@mealcomes/theme-chalk/src/index.scss'

const plugins = [
    Icon
]

const app = createApp(App);

plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件

app.mount('#app')

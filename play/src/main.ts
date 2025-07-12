import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Icon from '@mealcomes/components/icon'

const plugins = [
    Icon
]

const app = createApp(App);

plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件

app.mount('#app')

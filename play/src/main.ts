import { createApp } from 'vue';
import App from './App.vue';

import '@mealcomes/theme-chalk/src/index.scss';
import Icon from '@mealcomes/components/icon';
import Tree from '@mealcomes/components/tree';
import CheckBox from '@mealcomes/components/checkbox';
import Button from '@mealcomes/components/button';
import Input from '@mealcomes/components/input';
import { FormItem, Form, FormItemInput } from '@mealcomes/components/form';
import Upload from '@mealcomes/components/upload';
import Calendar from '@mealcomes/components/calendar';
import VirtualList from '@mealcomes/components/virtual-scroll-list';

const plugins = [
    Icon,
    Tree,
    CheckBox,
    Button,
    Input,
    FormItem,
    Form,
    Upload,
    FormItemInput,
    Calendar,
    VirtualList
];

const app = createApp(App);

plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件

app.mount('#app');

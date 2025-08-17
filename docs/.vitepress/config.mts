import { defineConfig } from 'vitepress';
import {
    containerPreview,
    componentPreview
} from '@vitepress-demo-preview/plugin';
import { resolve } from 'path';

const alias = {
    '@': resolve(__dirname, '../examples')
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'mc-component',
    description: 'MealComes 组件库',
    base: '/mc-component/',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '指南', link: '/quickstart' },
            { text: '组件', link: '/overview' }
        ],

        sidebar: [
            {
                text: 'Examples',
                items: [
                    { text: 'Markdown Examples', link: '/markdown-examples' },
                    { text: 'Runtime API Examples', link: '/api-examples' }
                ]
            },
            {
                text: '基础组件',
                items: [{ text: '按钮', link: '/component/button' }]
            }
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/mealcomes/mc-component'
            }
        ]
    },
    cleanUrls: true,
    markdown: {
        config(md) {
            md.use(containerPreview, { alias });
            md.use(componentPreview, { alias });
        }
    },
    vite: {
        resolve: {
            alias
        }
    }
});

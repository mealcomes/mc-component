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
            { text: '指南', link: '/guide/quickstart' },
            { text: '组件', link: '/component/button' }
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
                text: '指南',
                items: [{ text: '快速开始', link: '/guide/quickstart' }]
            },
            {
                text: '基础组件',
                items: [{ text: 'Button 按钮', link: '/component/button' }]
            },
            {
                text: '数据展示',
                items: [
                    { text: 'Calendar 日历', link: '/component/calendar' },
                    { text: 'Tree 树形控件', link: '/component/tree' }
                ]
            }
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/mealcomes/mc-component'
            }
        ],

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: '搜索文档',
                        buttonAriaLabel: '搜索文档'
                    },
                    modal: {
                        footer: {
                            navigateText: '切换',
                            selectText: '选择',
                            closeText: '关闭'
                        },
                        resetButtonTitle: '清除查询条件',
                        noResultsText: '无法找到相关结果',
                        displayDetails: '展示详细列表'
                    }
                }
            }
        },

        logo: '/mealcomes-logo.svg',

        siteTitle: false,

        sidebarMenuLabel: '菜单',

        outline: {
            label: '本页目录',
            level: 'deep'
        },

        returnToTopLabel: '返回顶部',

        darkModeSwitchTitle: '切换到深色模式',

        lightModeSwitchTitle: '切换到浅色模式',

        darkModeSwitchLabel: '主题'
    },
    cleanUrls: true,
    head: [
        [
            'link',
            { rel: 'icon', href: '/mc-component/mealcomes-small-logo.svg' }
        ]
    ],
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

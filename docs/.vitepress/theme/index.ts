// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { ElementPlusContainer } from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css';
import './style.css';
import MealComes from 'mealcomes';
import 'mealcomes/theme-chalk/index.css';

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp: async ({ app, router }) => {
        app.use(MealComes);
        app.component('demo-preview', ElementPlusContainer);
        const nprogress = await import('nprogress');

        router.onBeforeRouteChange = nprogress.start;
        router.onAfterRouteChange = nprogress.done;
    }
} satisfies Theme;

import type { App, Plugin } from 'vue';
import { INSTALLED_KEY } from '@mealcomes/constants/key';


export const makeInstaller = (components: Plugin[] = []) => {
    const install = (app: App) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (app[INSTALLED_KEY]) return;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        app[INSTALLED_KEY] = true;
        components.forEach(c => app.use(c));
    };

    return {
        install
    };
};
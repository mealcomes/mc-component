import type { App, Component, DefineComponent, Plugin } from 'vue';

export type SFCWithInstall<T> = T & Plugin;
export function withInstall<T extends Component | DefineComponent>(comp: T) {
    (comp as SFCWithInstall<T>).install = function (app: App<T>) {
        const { name } = comp as unknown as { name: string };
        app.component(name, comp);
    };
    return comp as SFCWithInstall<T>;
}

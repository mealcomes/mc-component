import { defineComponent, h, onBeforeMount, ref } from 'vue';
import { virtualProps } from './props';
import type { RangeOptions } from './props';
import { initVirtual } from './virtual';
import virtualItem from './virtual-item';

export default defineComponent({
    name: 'mc-virtual-scroll-list',
    props: virtualProps,
    setup(props) {
        const range = ref<RangeOptions | null>(null);
        let virtual: ReturnType<typeof initVirtual>;

        const getUniqueIdFromDataSource = (): string[] => {
            const { dataSource, dataKey } = props;
            return dataSource.map(
                item => (item as object)[dataKey as keyof typeof item]
            ) as string[];
        };

        const update = (newRange: RangeOptions) => {
            range.value = newRange;
        };

        const installVirtual = () => {
            virtual = initVirtual(
                {
                    keeps: props.keeps,
                    cache: props.cache || Math.round(props.keeps / 3),
                    uniqueIds: getUniqueIdFromDataSource(),
                    estimatedRowHeight: props.estimatedRowHeight
                },
                update
            );
        };

        onBeforeMount(() => {
            installVirtual();
        });

        function onItemResize(id: string | number, size: number) {
            virtual.saveSize(id, size);
        }

        function genRenderComponent() {
            const slots = [];
            const { start, end } = range.value!;
            const { dataSource, dataComponent, dataKey } = props;
            for (let index = start; index <= end; index++) {
                const data = dataSource[index];
                const key = (data as object)[dataKey as keyof typeof data];
                if (data) {
                    slots.push(
                        h(virtualItem, {
                            uniqueKey: key,
                            source: data,
                            component: dataComponent,
                            onItemResize: onItemResize
                        })
                    );
                }
            }
            return slots;
        }

        const rootRef = ref<HTMLElement>();
        function onScroll() {
            if (rootRef.value) {
                const offset = rootRef.value.scrollTop;
                virtual.handleScroll(offset);
            }
        }

        return () => {
            const { padFront, padBehind } = range.value!;
            const paddingStyle = {
                padding: `${padFront}px 0 ${padBehind}px`
            };

            return (
                <div
                    onScroll={onScroll}
                    ref={rootRef}
                    style={{ overflowY: 'scroll' }}
                >
                    <div style={paddingStyle}>{genRenderComponent()}</div>
                </div>
            );
        };
    }
});

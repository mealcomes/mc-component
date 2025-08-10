import { defineComponent, onMounted, onUpdated, ref } from 'vue';
import { virtualItemEmits, virtualItemProps } from './props';

export default defineComponent({
    name: 'virtual-item',
    props: virtualItemProps,
    emits: virtualItemEmits,
    setup(props, { emit }) {
        const rootRef = ref<HTMLElement>();

        function dispatchEvent() {
            emit('itemResize', props.uniqueKey!, rootRef.value!.offsetHeight);
        }

        onMounted(() => {
            dispatchEvent();
        });

        onUpdated(() => {
            dispatchEvent();
        });

        return () => {
            const { component: Comp, source, uniqueKey } = props;
            return (
                Comp && (
                    <div key={uniqueKey} ref={rootRef}>
                        <Comp source={source}></Comp>
                    </div>
                )
            );
        };
    }
});

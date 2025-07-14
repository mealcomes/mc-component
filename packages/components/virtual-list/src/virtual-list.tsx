import {
    computed,
    defineComponent,
    onMounted,
    PropType,
    reactive,
    ref,
    watch
} from 'vue';
import { createNamespace } from '@mealcomes/utils';
import { ExtractPropTypes } from 'vue';
import { TreeNode } from '../../tree';

/**
 * virtual 组件 props
 */
export const virtualProps = {
    /**
     * 每一行的高度
     */
    size: {
        type: Number,
        default: 27
    },
    /**
     * 可视窗口展示的数据条数
     */
    remain: {
        type: Number,
        default: 8
    },
    /**
     * 数据
     */
    items: {
        type: Array as PropType<TreeNode[]>,
        default: () => []
    }
} as const;

/**
 * virtual 组件 props 类型
 */
export type VirtualProps = ExtractPropTypes<typeof virtualProps>;

export default defineComponent({
    name: 'm-virtual-list',
    props: virtualProps,
    setup(props: VirtualProps, { slots }) {
        const bem = createNamespace('virtual-list');
        const wrapperRef = ref<HTMLElement>();
        const barRef = ref<HTMLElement>();
        const state = reactive({
            start: 0,
            end: props.remain
        });
        const prev = computed(() => {
            return Math.min(state.start, props.remain);
        });
        const next = computed(() => {
            return Math.min(props.items.length - state.end, props.remain);
        });
        const visibleData = computed(() =>
            props.items.slice(state.start - prev.value, state.end! + next.value)
        );
        const offset = ref(0);

        let ticking = false;
        // 根据当前滚动的距离计算往下了多少数据
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = wrapperRef.value!.scrollTop;
                    state.start = Math.floor(scrollTop / props.size);
                    state.end = state.start + props.remain;
                    offset.value =
                        state.start * props.size - props.size * prev.value;
                    ticking = false;
                });
                ticking = true;
            }
        };

        const setHeight = () => {
            wrapperRef.value!.style.height = props.remain * props.size + 'px';
            barRef.value!.style.height = props.items.length * props.size + 'px';
        };

        // 监听总的items, 因为如果展开的话, items 的长度会改变
        watch(() => props.items, setHeight);

        onMounted(() => {
            setHeight();
        });
        return () => {
            return (
                <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
                    {/* 模拟总长度, 撑开滚动条 */}
                    <div class={bem.e('scroll-bar')} ref={barRef}></div>
                    {/* 更新列表的显示区域, 由于向下滚动时整个会往下, 
                    所以 list 也需要往下偏移, 保证 list 始终处于可见视图 */}
                    <div
                        class={bem.e('scroll-list')}
                        style={{
                            transform: `translate3d(0, ${offset.value}px, 0)`
                        }}
                    >
                        {visibleData.value?.map(node =>
                            slots.default!({ node })
                        )}
                    </div>
                </div>
            );
        };
    }
});

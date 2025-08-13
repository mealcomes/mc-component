import type { DefineComponent, ExtractPropTypes, PropType } from 'vue';

/**
 * 滚动方向 (向上 / 向下)
 */
export const virtualScrollDirection = ['front', 'behind'] as const;

export type VirtualScrollDirection = (typeof virtualScrollDirection)[number];

export type RangeOptions = {
    start: number;
    end: number;
    padFront: number;
    padBehind: number;
};

export type VirtualOptions = {
    keeps: number;
    cache: number;
    estimatedRowHeight: number;
    uniqueIds: string[];
};

export type UpdateType = (range: RangeOptions) => void;

export const virtualProps = {
    /**
     * 数据源
     */
    dataSource: {
        type: Array,
        required: true,
        default: () => []
    },
    /**
     * 每一项数据的 key
     */
    dataKey: {
        type: String,
        required: true
    },
    /**
     * 渲染多少条数据 (存在真实 dom)
     */
    keeps: {
        type: Number,
        default: 30
    },
    /**
     * 每一条数据预估高度
     */
    estimatedRowHeight: {
        type: Number,
        default: 80
    },
    /**
     * 每一行的数据组件
     */
    dataComponent: {
        type: [Object, Function] as PropType<
            DefineComponent<object, object, unknown>
        >,
        required: true
    },
    /**
     * 数据渲染缓冲区 (基于视口顶部 top 的数据所在位置, top ~ top + cache 为缓冲区)
     *
     * start = 10 cache = 5 end = 20
     * - 向下滚动时, 当 top 处于 10 ~ 15, 不做处理,
     * 当 top > 15, 将 start 赋为 15, 从而 end = 25(即往后渲染 cache 条数据)
     * - 向上滚动时, 当 top 处于 10 ~ 15, 不做处理,
     * 当 top < 10, 将 start 赋为 5, 从而 end = 15(即往前渲染 cache 条数据)
     */
    cache: {
        type: Number,
        default: 2
    }
} as const;

export type VirtualProps = ExtractPropTypes<typeof virtualProps>;

export const virtualItemProps = {
    uniqueKey: {
        type: [String, Number] as PropType<string | number>,
        required: true
    },
    source: {
        type: Object,
        required: true
    },
    component: {
        type: [Object, Function] as PropType<
            DefineComponent<{ source: object }, object, unknown>
        >
    }
} as const;

export type VirtualItemProps = ExtractPropTypes<typeof virtualItemProps>;

export const virtualItemEmits = {
    itemResize: (id: number | string, size: number) =>
        typeof size === 'number' &&
        (typeof id === 'number' || typeof id === 'string')
};

export type VirtualItemEmits = ExtractPropTypes<typeof virtualItemEmits>;

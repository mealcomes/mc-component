import { ExtractPropTypes, PropType } from 'vue';

type Key = string | number;

export interface TreeNode extends Required<TreeOption> {
    level: number;
    rowNode: TreeOption;
    children: TreeNode[];
    isLeaf: boolean; // 是否为叶子节点
}

// 用户传入的 data 类型
export interface TreeOption {
    label?: Key;
    key?: Key;
    children?: TreeOption[];
    isLeaf: boolean;
    [key: string]: unknown; // 除了上面的属性，也可以传其他的
}

/**
 * tree 组件 props
 */
export const treeProps = {
    data: {
        type: Array as PropType<TreeOption[]>,
        default: () => []
    },
    defaultExpandedKeys: {
        // 默认展开的 key
        type: Array as PropType<Key[]>,
        default: () => []
    },
    labelField: {
        // data 属性中 label 字段名
        type: String,
        default: 'label'
    },
    keyField: {
        // data 属性中 key 字段名
        type: String,
        default: 'key'
    },
    childrenField: {
        // // data 属性中 children 字段名
        type: String,
        default: 'children'
    }
} as const;

/**
 * tree 组件 props 的类型
 */
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

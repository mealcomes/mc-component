import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue';

export type Key = string | number;

export interface TreeNode extends Required<TreeOption> {
    level: number;
    rawNode: TreeOption;
    children: TreeNode[];
    isLeaf: boolean; // 是否为叶子节点
}

/**
 * 用户传入的 data 类型
 */
export interface TreeOption {
    label?: Key;
    key?: Key;
    children?: TreeOption[];
    isLeaf?: boolean;
    disabled?: boolean;
    [key: string]: unknown; // 除了上面的属性，也可以传其他的
}

/**
 * tree 组件 props
 */
export const treeProps = {
    /**
     * 传入的数据
     */
    data: {
        type: Array as PropType<TreeOption[]>,
        default: () => []
    },
    /**
     * 默认展开的 keys
     */
    defaultExpandedKeys: {
        // 默认展开的 key
        type: Array as PropType<Key[]>,
        default: () => []
    },
    /**
     * label 字段名
     */
    labelField: {
        // data 属性中 label 字段名
        type: String,
        default: 'label'
    },
    /**
     * key 字段名
     */
    keyField: {
        // data 属性中 key 字段名
        type: String,
        default: 'key'
    },
    /**
     * 子树
     */
    childrenField: {
        // // data 属性中 children 字段名
        type: String,
        default: 'children'
    },
    /**
     * 懒加载处理函数
     */
    onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
    /**
     * 被选中的 key
     */
    selectedKeys: {
        type: Array as PropType<Key[]>
    },
    /**
     * 是否可选
     */
    selectable: {
        type: Boolean,
        default: false
    },
    /**
     * 是否可多选
     */
    multiple: {
        type: Boolean,
        default: false
    }
} as const;

/**
 * tree 组件 emit
 */
export const treeEmits = {
    /**
     * 选择了的 key 更新
     */
    'update:selectedKeys': (keys: Key[]) => keys
};

/**
 * tree 组件 props 的类型
 */
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

/**
 * treeNode 组件 props
 */
export const treeNodeProps = {
    /**
     * 节点
     */
    node: {
        type: Object as PropType<TreeNode>,
        required: true
    },
    /**
     * 是否展开
     */
    expanded: {
        type: Boolean,
        required: true
    },
    /**
     * 处于加载中的 keys
     */
    loadingKeys: {
        type: Object as PropType<Set<Key>>,
        required: true
    },
    /**
     * 被选中的 keys
     */
    selectedKeys: {
        type: Array as PropType<Key[]>,
        default: () => []
    }
} as const;

/**
 * treeNode 组件 emit
 */
export const treeNodeEmits = {
    /**
     * 展开/折叠
     */
    toggle: (node: TreeNode) => node,
    /**
     * 节点选择
     */
    select: (node: TreeNode, canMulti: boolean = false) => node || canMulti
};

/**
 * treeNode 组件 props 的类型
 */
export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;

/**
 * tree 组件上下文
 */
export interface TreeContext {
    slots: SetupContext['slots'];
    // emit: SetupContext<typeof treeEmits>['emit'];
}

/**
 * provide/inject key
 */
export const treeInjectKey: InjectionKey<TreeContext> = Symbol();

/**
 * treeNodeContent 组件 props
 */
export const treeNodeContentProps = {
    node: {
        type: Object as PropType<TreeNode>,
        required: true
    }
} as const;

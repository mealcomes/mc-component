import type {
    ExtractPropTypes,
    InjectionKey,
    PropType,
    SetupContext
} from 'vue';

export type TreeKey = string | number;

export interface TreeNode extends Required<TreeOption> {
    level: number;
    rawNode: TreeOption;
    children: TreeNode[];
    isLeaf: boolean; // 是否为叶子节点
    parentKey: TreeKey | undefined;
}

/**
 * 用户传入的 data 类型
 */
export interface TreeOption {
    label?: TreeKey;
    key?: TreeKey;
    children?: TreeOption[];
    isLeaf?: boolean;
    disabled?: boolean;
    [key: string]: unknown; // 除了上面的属性，也可以传其他的
}

/**
 * 复选框按钮点击事件参数
 */
export interface CheckedInfo {
    checkedKeys: TreeKey[];
    checkedNodes: TreeOption[];
    halfCheckedKeys: TreeKey[];
    halfCheckedNodes: TreeOption[];
    checked: boolean;
}

/**
 * 树节点 展开/折叠 事件参数
 */
export interface ExpandInfo {
    expandKeys: TreeKey[];
    expandNodes: TreeOption[];
    expanded: boolean;
}

export interface SelectInfo {
    selectedKeys: TreeKey[];
    selectedNodes: TreeOption[];
    selected: boolean;
}

/**
 * 树结构
 */
export interface Tree {
    /** key 到 node 的映射 */
    treeNodeMap: Map<TreeKey, TreeNode>;
    /** 树节点 */
    treeNodes: TreeNode[];
}

/**
 * tree 组件 props
 */
export const treeProps = {
    /**
     * @description 传入的数据
     */
    data: {
        type: Array as PropType<TreeOption[]>,
        default: () => []
    },
    /**
     * @description 默认展开的 keys
     */
    expandedKeys: {
        // 默认展开的 key
        type: Array as PropType<TreeKey[]>,
        default: () => []
    },
    /**
     * @description label 字段名
     */
    labelField: {
        // data 属性中 label 字段名
        type: String,
        default: 'label'
    },
    /**
     * @description key 字段名
     */
    keyField: {
        // data 属性中 key 字段名
        type: String,
        default: 'key'
    },
    /**
     * @description 子树
     */
    childrenField: {
        // // data 属性中 children 字段名
        type: String,
        default: 'children'
    },
    /**
     * @description 懒加载处理函数
     */
    load: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
    /**
     * @description 被选中的 key
     */
    selectedKeys: {
        type: Array as PropType<TreeKey[]>
    },
    /**
     * @description 是否可选
     */
    selectable: {
        type: Boolean,
        default: false
    },
    /**
     * @description 是否可多选
     */
    multiple: {
        type: Boolean,
        default: false
    },
    /**
     * @description 默认选中的选项
     */
    defaultCheckedKeys: {
        type: Array as PropType<TreeKey[]>,
        default: () => []
    },
    /**
     * @description 是否展示 checkbox
     */
    showCheckbox: {
        type: Boolean,
        default: false
    },
    /**
     * @description 虚拟滚动容器高度
     */
    height: {
        type: Number
    },
    /**
     * @description 树节点高度
     */
    itemSize: {
        type: Number,
        default: 27
    }
} as const;

/**
 * tree 组件 emit
 */
export const treeEmits = {
    /**
     * @description 选择了的 `key` 更新
     */
    'update:selectedKeys': (keys: TreeKey[]) => keys,
    /**
     * @description 展开了的 `key` 更新
     */
    'update:expandedKeys': (keys: TreeKey[]) => keys,
    /**
     * @description 点击节点复选框之后触发
     */
    check: (target: TreeOption, checkInfo: CheckedInfo) => target && checkInfo,
    /**
     * @description 节点被展开或关闭时触发
     */
    expand: (target: TreeOption, expandInfo: ExpandInfo) =>
        target && expandInfo,
    /**
     * @description 节点被选择时触发
     */
    select: (target: TreeOption, selectInfo: SelectInfo) =>
        target && selectInfo,
    /**
     * @description 异步加载成功时触发
     */
    loaded: (loadedData: TreeOption[]) => loadedData
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
     * @description 节点
     */
    node: {
        type: Object as PropType<TreeNode>,
        required: true
    },
    /**
     * @description 是否展开
     */
    expanded: {
        type: Boolean,
        required: true
    },
    /**
     * @description 处于加载中的 keys
     */
    loadingKeys: {
        type: Object as PropType<Set<TreeKey>>,
        required: true
    },
    /**
     * @description 被选中的 keys
     */
    selectedKeys: {
        type: Array as PropType<TreeKey[]>,
        default: () => []
    },
    /**
     * @description 是否展示 checkbox
     */
    showCheckbox: {
        type: Boolean,
        default: false
    },
    /**
     * @description 是否选中复选框
     */
    checked: Boolean,
    /**
     * @description 是否禁用
     */
    disabled: Boolean,
    /**
     * @description 是否半选
     */
    indeterminate: Boolean,
    /**
     * @description 树节点高度
     */
    size: {
        type: Number
    }
} as const;

/**
 * treeNode 组件 emit
 */
export const treeNodeEmits = {
    /**
     * @description 展开/折叠
     */
    toggle: (node: TreeNode) => node,
    /**
     * @description 节点选择
     */
    select: (node: TreeNode, canMulti: boolean = false) => node || canMulti,
    /**
     * @description 复选框状态改变
     */
    check: (node: TreeNode, val: boolean) => typeof val === 'boolean' && node
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

---
title: Tree
---

# Tree

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

基础的树形结构展示。

::: preview
demo-preview=@/tree/basic.vue
:::

:::warning
传入的每个节点必须包含唯一的 `key`。
:::

## 节点选择

节点可选择，通过设置 `multiple` 可进行多选（`ctrl` + 左键），也可通过 `show-checkbox` 显示复选框，`default-checked-keys` 可控制默认选中的复选框。

::: preview
demo-preview=@/tree/selectable.vue
:::

## 节点展开控制

通过 `v-model` 双向绑定 `expanded-keys` 来控制节点的展开。

::: preview
demo-preview=@/tree/expand.vue
:::

## 懒加载

点击展开节点，动态加载数据。

::: preview
demo-preview=@/tree/lazy.vue
:::

## 节点禁用

通过 `disabled` 设置节点的禁用状态。

::: preview
demo-preview=@/tree/disabled.vue
:::

## 虚拟滚动

使用 `height` 属性则切换为虚拟滚动，从而实现大量数据的高性能树形展示。

::: preview
demo-preview=@/tree/virtual.vue
:::

## 自定义节点内容

::: preview
demo-preview=@/tree/customize.vue
:::

## API

### Attributes

| 属性名                 | 说明                                        | 类型                               | 默认值   |
| ---------------------- | ------------------------------------------- | ---------------------------------- | -------- |
| data                   | 展示数据                                    | `object`                           | -        |
| labelField             | 指定节点标签为节点对象的某个属性值          | `string`                           | label    |
| keyField               | 指定节点 `key` 为节点对象的某个属性值       | `string`                           | key      |
| childrenField          | 指定子树为节点对象的某个属性值              | `string`                           | children |
| expandedKeys (v-model) | 展开的节点的`key`数组                       | `Array<string \| number>`          | -        |
| selectable             | 指定节点是否可选                            | `boolean`                          | false    |
| multiple               | 指定节点是否可以多选                        | `boolean`                          | false    |
| selectedKeys (v-model) | 被选中的节点的 `key` 数组                   | `Array<string \| number>`          | -        |
| showCheckbox           | 节点展示 `checkbox` 复选框                  | `boolean`                          | false    |
| defaultCheckedKeys     | 默认 `checkbox` 被勾选的节点的 `key` 的数组 | `Array<string \| number>`          | -        |
| load                   | 数据懒加载（设置即代表启用懒加载树）        | `(node) => Promise<TreeOption[]>>` | -        |
| height                 | 设置虚拟滚动容器高度                        | `number`                           | -        |
| item-size              | 自定义树节点的高度(单位为像素)              | `number`                           | 27       |

### Events

| 事件名 | 说明                   | 类型                                                   |
| ------ | ---------------------- | ------------------------------------------------------ |
| check  | 点击复选框触发         | `(target: TreeOption, checkInfo: CheckedInfo) => void` |
| expand | 节点被展开或关闭时触发 | `(target: TreeOption, expandInfo: ExpandInfo) => void` |
| select | 节点被选择时触发       | `(target: TreeOption, selectInfo: SelectInfo) => void` |
| loaded | 异步加载成功时触发     | `(loadedData: TreeOption[]) => void`                   |

### Slots

| 插槽名  | 说明           | 类型       |
| ------- | -------------- | ---------- |
| default | 自定义节点内容 | `{ node }` |

### Exposes

| 名称                | 说明                                    | 类型                                              |
| ------------------- | --------------------------------------- | ------------------------------------------------- |
| getCheckedKeys      | 获取当前 checkbox 选中节点的 `key` 数组 | `(leafOnly?: boolean) => Array<string \| number>` |
| getCheckedNodes     | 获取当前 checkbox 选中节点的数组        | `(leafOnly?: boolean) => TreeOption[]`            |
| getHalfCheckedKeys  | 获取当前 checkbox 半选节点的 `key` 数组 | `() => Array<string \| number>`                   |
| getHalfCheckedNodes | 获取当前 checkbox 半选节点的数组        | `() => TreeOption[]`                              |
| getSelectedKeys     | 获取当前选中节点的 `key` 数组           | `() => Array<string \| number>`                   |
| getSelectedNodes    | 获取当前选中节点的数组                  | `() => TreeOption[]`                              |
| getExpandedKeys     | 获取当前展开节点的 `key` 数组           | `() => Array<string \| number>`                   |
| getExpandedNodes    | 获取当前展开节点的数组                  | `() => TreeOption[]`                              |

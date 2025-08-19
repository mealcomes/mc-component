---
title: Button
---

# Button 按钮

常用的操作按钮

## 基础用法

使用 `type`, `plain`, `round` 和 `circle` 来定义按钮的样式。

:::preview

demo-preview=@/button/basic.vue

:::

## 禁用状态

使用 `disabled` 属性来定义按钮是否被禁用。 该属性接受一个 Boolean 类型的值。

:::preview

demo-preview=@/button/disabled.vue

:::

## 图标按钮

使用 `icon` 插槽来为按钮添加图标。

:::preview

demo-preview=@/button/icon.vue

:::

## 加载状态按钮

使用 `loading` 属性来显示加载中状态。

:::preview

demo-preview=@/button/loading.vue

:::

## 调整尺寸

使用 `size` 属性配置按钮尺寸。

:::preview

demo-preview=@/button/size.vue

:::

## Button API

### Button Attributes

| 属性名        | 说明                     | 类型                                                                           | 默认值   |
| ------------- | ------------------------ | ------------------------------------------------------------------------------ | -------- |
| size          | 按钮大小                 | `large` \| `default` \| `small`                                                | —        |
| type          | 按钮类型                 | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `info` \| `''` | —        |
| plain         | 是否为朴素按钮           | boolean                                                                        | `false`  |
| round         | 是否为圆角按钮 button    | boolean                                                                        | `false`  |
| circle        | 是否为圆形按钮 button    | boolean                                                                        | `false`  |
| loading       | 是否为加载中状态 loading | boolean                                                                        | `false`  |
| disabled      | 是否为禁用状态           | boolean                                                                        | `false`  |
| native-type   | 原生 `type` 属性         | `button` \| `submit` \| `reset`                                                | `button` |
| iconPlacement | 图标位置                 | `left` \| `right`                                                              | `left`   |

### Events

支持原生 `button` 的所有事件

### Button Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| default | 自定义默认内容   |
| loading | 自定义加载中组件 |
| icon    | 自定义图标组件   |

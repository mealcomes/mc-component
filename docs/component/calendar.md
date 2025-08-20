---
title: Calendar
---

# Calendar 日历

显示日历

## 基础用法

设置 `value` 来指定当前显示的月份。 如果 `value` 未指定，则显示当月。 `value` 支持 `v-model` 双向绑定。

::: preview
demo-preview=@/calendar/basic.vue
:::

## 迷你模式

用于嵌套在空间有限的容器中。

::: preview
demo-preview=@/calendar/mini.vue
:::

## 自定义内容

自定义日历单元格中显示的内容。

::: preview
demo-preview=@/calendar/customize.vue
:::

## 自定义头部

::: preview
demo-preview=@/calendar/header.vue
:::

## API

### Attributes

| 属性名                | 说明         | 类型      | 默认值 |
| --------------------- | ------------ | --------- | ------ |
| model-value / v-model | 选中项绑定值 | `Date`    | -      |
| mini                  | 迷你模式     | `boolean` | false  |

### Slots

| 插槽名    | 说明                                                                                                                                                                               | 类型                                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| date-cell | `type` 表示该日期的所属月份，可选值有 prev-month、current-month 和 next-month；`isSelected` 标明该日期是否被选中；`day` 是格式化的日期，格式为 `yyyy-MM-dd`；`date` 是单元格的日期 | `{ data: { type: 'prev-month' \| 'current-month' \| 'next-month', isSelected: boolean, day: string, date: Date } }` |
| header    | 日历头部，`date` 表示当前选中的月份                                                                                                                                                | `{ date: string }`                                                                                                  |

### Exposes

| 名称        | 说明             | 类型                               |
| ----------- | ---------------- | ---------------------------------- |
| selectedDay | 当前选中的日期   | `ComputedRef<Dayjs \| undefined>`  |
| pickDay     | 选中指定的某一天 | `(day: dayjs.Dayjs) => void`       |
| selectDate  | 选择日期         | `(type: CalendarDateType) => void` |

## 类型声明

::: details 显示类型声明

```ts
type CalendarDateType =
    | 'prev-month'
    | 'next-month'
    | 'prev-year'
    | 'next-year'
    | 'today';
```

:::

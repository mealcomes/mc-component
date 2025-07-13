/**
 * icon 组件相关属性和ts类型
 */
/**
 * icon 组件相关属性和ts类型
 */
import type { ExtractPropTypes, PropType } from 'vue';

// 组件 props
export const iconProps = {
    color: String,
    size: [Number, String] as PropType<number | string>
} as const;   // 转为 const ，只读

// 组件 props 的类型
export type IconProps = ExtractPropTypes<typeof iconProps>;

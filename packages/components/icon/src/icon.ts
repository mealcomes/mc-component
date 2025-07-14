/**
 * icon 组件相关属性和ts类型
 */
/**
 * icon 组件相关属性和ts类型
 */
import type { ExtractPropTypes, PropType } from 'vue';

/**
 * icon 组件 props
 */
export const iconProps = {
    color: String,
    size: [Number, String] as PropType<number | string>
} as const; // 转为 const ，只读

/**
 * icon 组件 props 的类型
 * ExtractPropTypes<> 所有的都是必须的
 * Partial<ExtractPropTypes<>> 所有的都是可选的 (可以为 undefined)
 */
export type IconProps = ExtractPropTypes<typeof iconProps>;

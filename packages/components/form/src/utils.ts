import type { Arrayable } from './form-item';

export function convertArray<T>(rules: Arrayable<T>) {
    return rules ? (Array.isArray(rules) ? rules : [rules]) : [];
}

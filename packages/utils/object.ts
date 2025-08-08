export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[] | K
): Omit<T, K> {
    const result = {} as Partial<T>;
    if (!Array.isArray(keys)) {
        keys = [keys];
    }

    (Object.keys(obj) as (keyof T)[]).forEach(key => {
        if (!keys.includes(key as K)) {
            result[key] = obj[key];
        }
    });

    return result as Omit<T, K>;
}

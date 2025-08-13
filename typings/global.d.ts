declare module 'vue' {
    export interface GlobalComponents {
        McButton: typeof import('mealcomes')['McButton'];
        McCalendar: typeof import('mealcomes')['McCalendar'];
        McCheckbox: typeof import('mealcomes')['McCheckbox'];
        McForm: typeof import('mealcomes')['McForm'];
        McFormItem: typeof import('mealcomes')['McFormItem'];
        McFormItemInput: typeof import('mealcomes')['McFormItemInput'];
        McIcon: typeof import('mealcomes')['McIcon'];
        McInput: typeof import('mealcomes')['McInput'];
        McTree: typeof import('mealcomes')['McTree'];
        McUpload: typeof import('mealcomes')['McUpload'];
        McVirtualScrollList: typeof import('mealcomes')['McVirtualScrollList'];
    }
}

export {};

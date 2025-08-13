import { McButton } from '@mealcomes/components/button';
import { McCalendar } from '@mealcomes/components/calendar';
import { McCheckbox } from '@mealcomes/components/checkbox';
import {
    McForm,
    McFormItem,
    McFormItemInput
} from '@mealcomes/components/form';
import { McIcon } from '@mealcomes/components/icon';
import { McInput } from '@mealcomes/components/input';
import { McTree } from '@mealcomes/components/tree';
import { McUpload } from '@mealcomes/components/upload';
import { McVirtualScrollList } from '@mealcomes/components/virtual-scroll-list';

import type { Plugin } from 'vue';

export default [
    McButton,
    McCalendar,
    McCheckbox,
    McForm,
    McFormItem,
    McFormItemInput,
    McIcon,
    McInput,
    McTree,
    McUpload,
    McVirtualScrollList
] as Plugin[];

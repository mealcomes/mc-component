import type {
    RangeOptions,
    UpdateType,
    VirtualOptions,
    VirtualScrollDirection
} from './props';

// 固定高度
// 1. 上 padding 利用 开始范围前面的数据个数 * 每项高度
// 2. 下 padding 利用 (总个数 - 当前显示到的个数) * 每项高度
// 动态高度 (根据已经渲染出的数据先预估滚动条高度)
// 1. 上 padding 根据当前 start 来累加 start 之前每一项的高度
// 2. 下 padding 利用 (总个数 - 当前显示到的个数) * 预估高度
// 当开始滚动时, 固定高度直接采用 偏移量 / 每项高度 计算数据在视口的起始位置
// 动态高度则采用二分查找, 取已经加载的数据项的偏移量和当前偏移量最接近的那一项

enum CALC_TYPE {
    /**
     * 初始高度
     */
    INIT = 'init',
    /**
     * 固定高度
     */
    FIXED = 'fixed',
    /**
     * 动态高度
     */
    DYNAMIC = 'dynamic'
}

export function initVirtual(options: VirtualOptions, update: UpdateType) {
    const range: RangeOptions = {
        start: 0,
        end: 0,
        padBehind: 0,
        padFront: 0
    };
    /* 未滚动前的偏移量 */
    let offsetValue = 0;
    /* 每一项渲染过后的实际高度 */
    const sizes = new Map<string | number, number>();
    let calcType = CALC_TYPE.INIT;
    let fixedSizeVal = 0;
    /* 一开始时每一项的预估高度 */
    let firstRangeAvg: number;

    function isFixed() {
        return calcType === CALC_TYPE.FIXED;
    }

    function getEstimatedRowHeight() {
        return isFixed()
            ? fixedSizeVal
            : firstRangeAvg || options.estimatedRowHeight;
    }

    /**
     * 获取 index 处数据的偏移量
     */
    function getIndexOffset(idx: number) {
        if (!idx) return 0;
        let offset = 0;
        for (let i = 0; i < idx; i++) {
            const indexSize = sizes.get(options.uniqueIds[i]);
            offset +=
                typeof indexSize === 'number'
                    ? indexSize
                    : getEstimatedRowHeight();
        }
        return offset;
    }

    /**
     * 获取上 padding
     */
    function getPadFront() {
        if (isFixed()) {
            return getEstimatedRowHeight() * range.start;
        } else {
            return getIndexOffset(range.start);
        }
    }

    /**
     * 获取下 padding
     */
    function getPadBehind() {
        const lastIndex = options.uniqueIds.length - 1;
        return (lastIndex - range.end) * getEstimatedRowHeight();
    }

    /**
     * 更新范围
     */
    function updateRange(start: number, end: number) {
        range.start = start;
        range.end = end;
        range.padFront = getPadFront();
        range.padBehind = getPadBehind();
        update({ ...range });
    }

    /**
     * 范围检查
     */
    function checkRange(start: number, end: number) {
        const total = options.uniqueIds.length;
        const keeps = options.keeps;
        if (total < keeps) {
            start = 0;
            end = total - 1;
        } else if (end - start < keeps - 1) {
            start = end - keeps + 1;
        }
        updateRange(start, end);
    }

    /**
     * 获取滚动了多少条数据
     */
    function getScrollOvers() {
        if (isFixed()) {
            return Math.floor(offsetValue / getEstimatedRowHeight());
        } else {
            let l = 0;
            let r = options.uniqueIds.length;
            let mid = 0;
            let midOffset = 0;
            while (l < r) {
                mid = l + Math.floor((r - l) / 2);
                midOffset = getIndexOffset(mid);
                if (midOffset === offsetValue) {
                    return mid;
                } else if (midOffset < offsetValue) {
                    l = mid + 1;
                } else {
                    r = mid - 1;
                }
            }
            return l > 0 ? --l : 0;
        }
    }

    function getEndByStart(start: number) {
        const computedEnd = start + options.keeps - 1;
        const end = Math.min(computedEnd, options.uniqueIds.length - 1);
        return end;
    }

    /**
     * 向上滚动 ( start 的更新 )
     */
    function handleFront() {
        const overs = getScrollOvers();
        if (overs > range.start) {
            // start = 10,  end = 40, cache = 10
            // 但滚动到了15个, 此时无需更新 start (属于 start--cache 范围(缓冲区)内滚动)
            return;
        }
        const start = Math.max(0, overs - options.cache);
        checkRange(start, getEndByStart(start));
    }

    /**
     * 向下滚动
     */
    function handleBehind() {
        const overs = getScrollOvers();
        if (overs < range.start + options.cache) {
            return;
        }
        checkRange(overs, getEndByStart(overs));
    }

    function handleScroll(offset: number) {
        const direction: VirtualScrollDirection =
            offset < offsetValue ? 'front' : 'behind';
        offsetValue = offset;
        if (direction === 'front') {
            handleFront();
        } else if (direction === 'behind') {
            handleBehind();
        }
    }

    function saveSize(id: number | string, size: number) {
        sizes.set(id, size);

        // 第一条数据加载完后拿到其高度, 如果第二条数据高度与之不同, 则说明是动态高度
        // 否则说明是固定高度(即数据组件设置了 height), 此时便使用 estimatedRowHeight
        if (calcType === CALC_TYPE.INIT) {
            // 第一条数据渲染完后进入这里, 先设置为 fixed 高度
            fixedSizeVal = size;
            calcType = CALC_TYPE.FIXED;
        } else if (calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
            // 第二条数据渲染完后如果高度和第一条数据不一样, 便会进入这里, 设置为 dynamic 高度
            calcType = CALC_TYPE.DYNAMIC;
            fixedSizeVal = 0;
        }

        // 如果是动态高度, 则根据已加载的数据高度算出平均值, 撑开滚动条
        if (calcType === CALC_TYPE.DYNAMIC) {
            // 判断条件保证只在初始的时候计算每一项的预估高度
            if (
                sizes.size < Math.min(options.keeps, options.uniqueIds.length)
            ) {
                firstRangeAvg = Math.round(
                    [...sizes.values()].reduce((acc, val) => acc + val, 0) /
                        sizes.size
                );
            }
        }
    }

    checkRange(0, options.keeps - 1);

    return {
        handleScroll,
        saveSize
    };
}

import { isArray, isObject, mergeWith } from 'lodash-es';
import { isReactive, isRef, reactive, Ref, unref, watch } from 'vue';

export function concatCaseCamel(...args: string[]) {
    return args.map((str, index) => (index === 0 ? str : str.replace(/^[a-z]/, (s) => s.toLocaleUpperCase()))).join('');
}

export const useState = (initState: Record<string, unknown> | Ref<Record<string, unknown>>) => {
    const state = reactive(unref(initState || {}));

    if (isReactive(initState) || isRef(initState)) {
        watch(initState, () => {
            Object.assign(state, unref(initState));
        });
    }

    const getState = () => state;

    const setState = (value: unknown, name?: string) => {
        if (name) {
            state[name] = value;
        } else if (isObject(value)) {
            Object.assign(state, value);
        }
    };

    return {
        state,
        getState,
        setState,
    };
};

export function turnArray<T>(param?: T[] | T): T[] {
    return isArray(param) ? param : param ? [param] : [];
}

export function travelTree<T, K>(tree: T[], cb: (node: T) => K | void): K[] | void {
    if (!isArray(tree)) return tree;
    const newTree: K[] = [];
    tree.forEach((node) => {
        const newNode = cb(node);
        const children = travelTree((node as unknown as Record<string, T[]>).children, cb);
        if (newNode) {
            if (children?.length) {
                (newNode as unknown as Record<string, K[]>).children = children;
            }
            newTree.push(newNode);
        }
    });
    if (newTree.length) return newTree;
}

type MergeStrategy = 'minx' | 'override' | 'concat';
/**
 * 策略合并
 * @param object
 * @param source
 * @param strategy ref响应式对象默认时覆盖，array默认是混合
 */
export function mergeWithStrategy(object: unknown, source: unknown, strategy?: { array?: MergeStrategy; ref?: MergeStrategy }) {
    const _strategy: typeof strategy = { array: 'minx', ref: 'override', ...strategy };
    mergeWith(object, source, (value, srcValue) => {
        if ((isReactive(srcValue) || isRef(srcValue)) && _strategy.ref === 'override') {
            return srcValue;
        }
        if (isArray(value)) {
            if (_strategy.array === 'concat') return value.concat(srcValue);
            if (_strategy.array === 'override') return srcValue;
        }
        return;
    });
}

export function mergeRefProps(ref: unknown, name: string, value: unknown) {
    if (!ref) {
        throw new Error('merge ref is not empty');
    }
    const _ref = ref as Record<string, unknown>;
    const props = _ref[name] || {};
    mergeWithStrategy(props, value);
    _ref[name] = props;
}

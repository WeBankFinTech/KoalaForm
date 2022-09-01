import { isArray, isObject, isString } from 'lodash-es';
import { isReactive, isRef, reactive, Ref, unref, watch } from 'vue';
import { getGlobalConfig } from './base';
import { Field } from './field';
import { KoalaPlugin } from './base';

export function reactiveFields(fields: Field[]) {
    const model = {};
    fields.forEach((field) => {
        model[field.name] = field.defaultValue || null;
    });

    return { model: reactive({ ...model }), initModel: model };
}

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

export const mergePlugins = (...args: KoalaPlugin[][]) => {
    const plugins: KoalaPlugin[] = [];
    args.forEach((items) => {
        plugins.push(...items);
    });
    const config = getGlobalConfig();
    const list: KoalaPlugin[] = [];
    plugins.forEach((plugin) => {
        if (isString(plugin)) plugin = config[plugin];
        if (!list.includes(plugin)) {
            list.push(plugin);
        }
    });
    return list;
};

export function turnArray<T>(param?: T[] | T): T[] {
    return isArray(param) ? param : param ? [param] : [];
}

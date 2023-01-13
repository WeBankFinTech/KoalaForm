import { get, isFunction, split } from 'lodash-es';
import { computed, Ref, ref, unref } from 'vue';
import { EnumOption, SceneContext, SceneConfig } from '../base';
import { doRequest } from '../handles';
import { mergeRefProps, travelTree, turnArray } from '../helper';
import { Field, findScheme } from '../scheme';
import { FormSceneConfig, FormSceneContext } from '../useForm';
import { PluginFunction } from './define';

export const optionsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('options-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const _options = (scheme?.__node as Field)?.options;
            if (!_options) return;
            let options: any;
            if (isFunction(_options)) {
                options = ref<Array<EnumOption>>([]);
                _options(ctx.modelRef.value)?.then((res: EnumOption[]) => {
                    if (res?.length) {
                        options.value = res;
                    }
                });
            } else {
                options = _options;
            }
            mergeRefProps(scheme, 'props', { options: options });
            scheme.children?.[0] && mergeRefProps(scheme.children[0], 'props', { options: options });
        });
        api.emit('started');
    });
};

/**
 * 转换枚举对象
 * @param list 转换前的枚举项数组
 * @param valueName 枚举值字段，默认是value
 * @param labelName 枚举描述字段，默认是label
 * @returns 转换后的枚举列表
 */
export const doTransferOptions = (list: Record<string, any>[], valueName?: string, labelName?: string): EnumOption[] => {
    return list.map((item) => ({
        value: item[valueName || 'value'],
        label: item[labelName || 'label'],
        ...item,
    }));
};

/**
 * 获取远程的options
 * @param api 请求地址
 * @param data 请求参数
 * @param config 配置
 */
export const doRemoteOptions = async (
    api: string,
    data?: Record<string, any>,
    config?: {
        opt?: Record<string, any>;
        valueName?: string;
        labelName?: string;
        path?: string;
    },
): Promise<EnumOption[]> => {
    let value: any = null;
    value = await doRequest(api, data, config?.opt);
    value = get(value, config?.path || '');
    return doTransferOptions(value, config?.valueName, config?.labelName);
};

/**
 * 获取字段的响应式options
 * @param cxt 上下文
 * @param fieldName 字段名
 * @returns
 */
export const doComputedOptions = (cxt: FormSceneContext, fieldName: string): Ref<EnumOption[]> => {
    const fields = (cxt?.__config as FormSceneConfig).fields || [];
    const scheme = findScheme(
        cxt.schemes,
        fields.find((field) => field.name === fieldName),
    );
    return computed(() => unref(scheme?.props || {})?.options || []);
};

/**
 * 获取字段的响应式枚举
 * @param cxt 上下文
 * @param value 枚举值
 * @param config 配置
 * @returns 枚举描述
 */
export const doComputedLabels = (cxt: FormSceneContext, value: any, config: { fieldName: string; split?: string }): Ref<string> => {
    const optionsRef = doComputedOptions(cxt, config.fieldName);
    const values = turnArray(value);
    return computed(() => {
        const options = optionsRef.value;
        if (options) {
            const labels = values.map((val) => (options as Array<Record<string, unknown>>).find((item) => item.value === val)?.label);
            return labels.join(config.split || '、');
        } else {
            return values.join(config.split || '、');
        }
    });
};

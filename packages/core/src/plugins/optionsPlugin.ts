import { get, isFunction, split } from 'lodash-es';
import { ref, unref } from 'vue';
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
                _options(ctx.model)?.then((res: EnumOption[]) => {
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

export const doTransferOptions = (list: Record<string, any>[], valueName?: string, labelName?: string): EnumOption[] => {
    return list.map((item) => ({
        value: item[valueName || 'value'],
        label: item[labelName || 'label'],
        ...item,
    }));
};

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

export const doFieldOptions = (cxt: FormSceneContext, fieldName: string): EnumOption[] => {
    const fields = (cxt?.__config as FormSceneConfig).fields || [];
    const scheme = findScheme(
        cxt.schemes,
        fields.find((field) => field.name === fieldName),
    );
    if (!scheme) return [];
    else {
        return unref(scheme.props)?.options;
    }
};

export const doOptionLabels = (cxt: FormSceneContext, value: any, config: { fieldName: string; split?: string }): string => {
    const options = doFieldOptions(cxt, config.fieldName);
    const values = turnArray(value);
    if (options) {
        const labels = values.map((val) => (options as Array<Record<string, unknown>>).find((item) => item.value === val)?.label);
        return labels.join(config.split || '、');
    } else {
        return values.join(config.split || '、');
    }
};

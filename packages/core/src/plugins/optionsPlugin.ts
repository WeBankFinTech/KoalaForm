import { isFunction } from 'lodash-es';
import { ref, unref } from 'vue';
import { EnumOption, SceneContext, SceneConfig } from '../base';
import { Handler, hGetValue, hRequest, invokeHandler, LinkHandler } from '../handles';
import { mergeRefProps, travelTree, turnArray } from '../helper';
import { Field, findScheme } from '../scheme';
import { FormSceneConfig, FormSceneContext } from '../useForm';
import { PluginFunction } from './define';
import { invokeHandles } from './eventsPlugin';

export const optionsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('options-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const _options = (scheme.__node as Field).options;
            if (!_options) return;
            let options: any;
            if (isFunction(_options)) {
                options = ref<Array<EnumOption>>([]);
                invokeHandles(ctx, _options, [ctx.model]).then((res) => {
                    if (res?.length) {
                        options.value = res[0] as Array<EnumOption>;
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

export const hTransferOptions: Handler<
    {
        valueName?: string;
        labelName?: string;
        preVal?: Record<string, any>[];
    },
    EnumOption[]
> = ({ valueName, labelName, preVal }) => {
    const list: EnumOption[] =
        preVal?.map((item) => ({
            value: item[valueName || 'value'],
            label: item[labelName || 'label'],
            ...item,
        })) || [];
    return list;
};

export const hRemoteOptions: Handler<
    {
        api: string;
        data?: Record<string, any>;
        preVal: Record<string, any>;
        config?: Record<string, any>;
        valueName?: string;
        labelName?: string;
        path?: string;
    },
    EnumOption[]
> = ({ api, data, preVal, config, valueName, labelName, path }) => {
    const { handlers, configs } = new LinkHandler(hRequest, { api, data, preVal, config }).next(hGetValue, { path }).next(hTransferOptions, { valueName, labelName });
    return invokeHandler(handlers, configs);
};

export const hFieldOptions: Handler<
    {
        cxt: FormSceneContext;
        fieldName: string;
    },
    EnumOption[]
> = ({ cxt, fieldName }) => {
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

export const hOptionLabels: Handler<
    {
        cxt: FormSceneContext;
        preVal?: any;
        split?: string;
        fieldName: string;
    },
    EnumOption[]
> = ({ cxt, fieldName, preVal, split }) => {
    const options = hFieldOptions({ cxt, fieldName });
    if (options) {
        const values = turnArray(preVal);
        const labels = values.map((val) => (options as Array<Record<string, unknown>>).find((item) => item.value === val)?.label);
        return [labels.join(split || '、')];
    } else {
        return preVal;
    }
};

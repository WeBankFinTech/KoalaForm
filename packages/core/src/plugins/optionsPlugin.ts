import { isFunction } from 'lodash-es';
import { ref, unref } from 'vue';
import { KoalaPlugin, Field, EnumOption, Handle, SceneContext, findScheme } from '../base';
import { resDataField, wrapRequest } from '../handles';
import { mergeRefProps, turnArray } from '../helper';
import { FormSceneConfig, FormSceneContext } from '../useForm';
import { invokeHandles } from './eventsPlugin';

export const optionsPlugin: KoalaPlugin = ({ ctx }, every) => {
    if (!every?.scheme || !every?.node) return;
    const { scheme, node } = every;
    const _options = (node as Field).option;
    if (isFunction(_options)) {
        const options = ref<Array<EnumOption>>([]);
        invokeHandles(ctx, _options, [ctx.model]).then((res) => {
            if (res?.length) {
                options.value = res[0] as Array<EnumOption>;
            }
        });
        mergeRefProps(scheme, 'props', { options: options });
    } else {
        mergeRefProps(scheme, 'props', { options: _options });
    }
};

export const transferOptions = (valueName = 'value', labelName = 'label'): Handle<SceneContext, EnumOption[]> => {
    return (ctx, options: Record<string, unknown>[]) => {
        const list: EnumOption[] = options.map((item) => ({
            value: item[valueName],
            label: item[labelName],
            ...item,
        }));
        return [list];
    };
};

export const remoteOptions = (
    api: string,
    data?: unknown,
    config?: {
        requestConfig?: Record<string, any>;
        valueName?: string;
        labelName?: string;
        path?: string;
    },
): Handle<SceneContext, EnumOption[]> => {
    return async (cxt) => {
        const handles = [wrapRequest(api, config?.requestConfig), resDataField(config?.path), transferOptions(config?.valueName, config?.valueName)];
        return (await invokeHandles(cxt, handles, [data])) as EnumOption[][];
    };
};

export const getFieldOptions = (fieldName: string, cxt?: SceneContext): Handle => {
    return (thisCxt) => {
        const _cxt = (cxt || thisCxt) as FormSceneContext;
        const fields = (_cxt?.__config as FormSceneConfig).fields || [];
        const scheme = findScheme(
            _cxt?.schemes,
            fields.find((field) => field.name === fieldName),
        );
        if (!scheme) return [[]];
        else {
            return [unref(scheme.props)?.options];
        }
    };
};

export const getFieldValueLabel = (fieldName: string, split = '、', cxt?: SceneContext): Handle => {
    return (thisCxt, value) => {
        const [options] = (getFieldOptions(fieldName, cxt)(thisCxt) as Array<unknown>) || [];
        if (options) {
            const values = turnArray(value);
            const labels = values.map((val) => (options as Array<Record<string, unknown>>).find((item) => item.value === val)?.label);
            return [labels.join(split)];
        }
    };
};

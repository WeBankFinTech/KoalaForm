import { getGlobalConfig, Handle, SceneConfig, SceneContext, useBaseScene } from '../base';
import { ref, Ref, unref } from 'vue';
import { PluginFunction } from '../plugins/define';
import { mergeRefProps, useState } from '../helper';
import { compileComponents, ComponentDesc, ComponentType, createScheme, Field, Scheme, SchemeChildren } from '../scheme';
import { cloneDeep, isArray, isNumber, isUndefined, merge } from 'lodash-es';
import dayjs from 'dayjs';
import { Handler } from '../handles';

export interface FormSceneContext extends SceneContext {
    formRef: Ref;
    initFields: (values: Record<string, unknown>, name?: string) => void;
    resetFields: () => void;
    setFields: (values: Record<string, unknown>, name?: string) => Record<string, unknown>;
    clearValidate: () => void;
    validate: (names?: string[]) => Promise<unknown>;
}

export interface FormSceneConfig extends SceneConfig {
    ctx: FormSceneContext;
    form?: ComponentDesc;
    fields: Field[];
}

const formPlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-plugin');

    api.onSelfStart(({ ctx, config: { fields, form } }) => {
        if (!fields) return;
        const { state, setState } = useState({});
        const initModel: Record<string, unknown> = {};
        const schemeChildren: SchemeChildren = [];
        const config = getGlobalConfig();
        const formScheme = createScheme(form || { name: ComponentType.Form });
        formScheme.__ref = ref(null);
        fields.forEach((field) => {
            if (field.name) {
                // 初始值
                initModel[field.name] = field.defaultValue;
            }

            const scheme: Scheme = createScheme(field);
            scheme.component = ComponentType.FormItem;
            scheme.children = compileComponents(ctx.schemes, field.components);
            mergeRefProps(scheme, 'props', { label: field.label });
            if (scheme.children?.length && field.name) {
                mergeRefProps(scheme.children[0], 'vModels', {
                    [config.modelValueName]: {
                        ref: state,
                        name: field.name,
                    },
                });
            }
            schemeChildren.push(scheme);
        });
        formScheme.children = schemeChildren;
        formScheme.component = ComponentType.Form;
        mergeRefProps(formScheme, 'props', { model: state });

        // 重置
        ctx.resetFields = () => {
            setState(initModel);
            formScheme.__ref?.value?.resetFields?.();
        };

        // 初始化
        ctx.initFields = (values, name) => {
            if (name) {
                initModel[name] = values;
            } else {
                Object.assign(initModel, values);
            }
            ctx.resetFields();
        };

        ctx.setFields = (values, name) => {
            ctx.resetFields();
            formScheme.__ref?.value?.resetFields?.();
            if (name) {
                state[name] = values;
            } else {
                Object.assign(state, values);
            }
            return state;
        };

        ctx.initFields(initModel);
        ctx.model = state;
        ctx.formRef = formScheme.__ref;
        if (ctx.schemes) {
            ctx.schemes.push(formScheme);
        } else {
            ctx.schemes = [formScheme];
        }
        api.emit('formSchemeLoaded');
        api.emit('schemeLoaded');
        api.emit('started');
    });
};

export const hResetFields: Handler<FormSceneContext> = (ctx) => {
    ctx?.resetFields?.();
};

export const hInitFields: Handler<{
    ctx: FormSceneContext;
    values: Record<string, any>;
    name?: string;
    preVal?: Record<string, any>;
}> = (config) => {
    const values = config.values || {};
    merge(values, config.preVal);
    config?.ctx?.initFields?.(values, config.name);
};

export const hSetFields: Handler<{
    ctx: FormSceneContext;
    values: Record<string, any>;
    name?: string;
    preVal?: Record<string, any>;
}> = (config) => {
    const values = config.values || {};
    merge(values, config.preVal);
    config?.ctx?.setFields?.(values, config.name);
};

/**
 * 取from的model数据进行格式化，规则如下:
 * - 日期处理，当组件时时间组件，会转成时间戳；如果值是数组，那么会解析成${fieldName}Start和${fieldName}End字段
 * - 多选，当组件是Select或者CheckBox并值是数组时，转成用','分割，如[1,2,3] => '1,2,3'
 * @param extend form外的其他参数
 * @param cxt 指定上下文
 * @returns
 */
export const hFormData: Handler<
    {
        ctx: FormSceneContext;
        values: Record<string, any>;
    },
    Record<string, any>
> = (config) => {
    const { ctx, values } = config;
    const model = cloneDeep(unref(ctx.model) || {});
    const fields = (ctx?.__config as FormSceneConfig)?.fields || [];
    fields.forEach((field) => {
        let value = model[field.name || ''];
        if (isUndefined(value) || value === null) return;
        const compName = (field.components as ComponentDesc)?.name || (field.components as ComponentDesc[])?.[0]?.name;
        if (compName === ComponentType.DatePicker) {
            if (isArray(value) && value.length) {
                model[`${field.name}Start`] = dayjs(value[0]).valueOf();
                model[`${field.name}End`] = dayjs(value[1]).valueOf();
                value = undefined;
            } else if (!isNumber(value)) {
                value = dayjs(value).valueOf();
            }
        } else if ([ComponentType.Select, ComponentType.Checkbox].includes(compName) && isArray(value)) {
            value = value.join(',');
        }
        model[field.name || ''] = value;
    });
    Object.assign(model, values || {});
    return model;
};

export function useForm(config: FormSceneConfig): FormSceneContext {
    config.ctx.use(formPlugin as PluginFunction);
    return useBaseScene(config);
}

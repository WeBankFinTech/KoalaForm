import { getGlobalConfig, SceneConfig, SceneContext, useScene, useSceneContext } from '../base';
import { ref, Ref, unref } from 'vue';
import { PluginFunction } from '../plugins/define';
import { mergeRefProps } from '../helper';
import { compileComponents, ComponentDesc, ComponentType, createScheme, Field, Scheme, SchemeChildren } from '../scheme';
import { cloneDeep, isArray, isNumber, isUndefined } from 'lodash-es';
import dayjs from 'dayjs';

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
        const { modelRef } = ctx;
        const initModel: Record<string, unknown> = {};
        const schemeChildren: SchemeChildren = [];
        const config = getGlobalConfig();
        const formScheme = createScheme(form || { name: ComponentType.Form });
        formScheme.__ref = ref(null);
        fields.forEach((field) => {
            if (field.name) {
                // 初始值
                initModel[field.name] = field.defaultValue || null;
            }

            const scheme: Scheme = createScheme(field);
            scheme.component = ComponentType.FormItem;
            scheme.children = compileComponents(ctx.schemes, field.components);
            mergeRefProps(scheme, 'props', { label: field.label });
            if (scheme.children?.length && field.name) {
                mergeRefProps(scheme.children[0], 'vModels', {
                    [config.modelValueName]: {
                        ref: modelRef,
                        name: field.name,
                    },
                });
            }
            schemeChildren.push(scheme);
        });
        formScheme.children = schemeChildren;
        formScheme.component = ComponentType.Form;
        mergeRefProps(formScheme, 'props', { model: modelRef });

        // 重置
        ctx.resetFields = () => {
            modelRef.value = { ...initModel };
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
                modelRef.value[name] = values;
            } else {
                Object.assign(modelRef.value, values);
            }
            return modelRef.value;
        };

        ctx.initFields(initModel);
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

export const doResetFields = (ctx: FormSceneContext) => {
    ctx?.resetFields?.();
};

export const doInitFields = (ctx: FormSceneContext, values: Record<string, any>, name?: string) => {
    ctx?.initFields?.(values, name);
};

export const doSetFields = (ctx: FormSceneContext, values: Record<string, any>, name?: string) => {
    ctx?.setFields?.(values, name);
};

/**
 * 取from的model数据进行格式化，规则如下:
 * - 日期处理，当组件时时间组件，会转成时间戳；如果值是数组，那么会解析成${fieldName}Start和${fieldName}End字段
 * - 多选，当组件是Select或者CheckboxGroup并值是数组时，转成用','分割，如[1,2,3] => '1,2,3'
 * @param values form外的其他参数
 * @param ctx 指定上下文
 * @returns
 */
export const doGetFormData = (ctx: FormSceneContext, values?: Record<string, any>) => {
    const model = cloneDeep(unref(ctx.modelRef) || {});
    const fields = (ctx?.__config as FormSceneConfig)?.fields || [];
    fields.forEach((field) => {
        let value = model[field.name || ''];
        if (isUndefined(value) || value === null) return;
        const compName = (field.components as ComponentDesc)?.name || (field.components as ComponentDesc[])?.[0]?.name;
        if (compName === ComponentType.DatePicker) {
            if (isArray(value) && value.length) {
                model[`${field.name}Start`] = dayjs(value[0]).valueOf();
                model[`${field.name}End`] = dayjs(value[1]).valueOf();
            } else if (!isNumber(value)) {
                value = dayjs(value).valueOf();
            }
        } else if ([ComponentType.Select, ComponentType.CheckboxGroup].includes(compName) && isArray(value)) {
            value = value.join(',');
        }
        model[field.name || ''] = value;
    });
    Object.assign(model, values || {});
    return model;
};

export function useForm(config: FormSceneConfig): FormSceneContext {
    if (!config.ctx) {
        const { ctx } = useSceneContext('form');
        config.ctx = ctx as FormSceneContext;
    }
    config.ctx.use(formPlugin as PluginFunction);
    return useScene(config);
}

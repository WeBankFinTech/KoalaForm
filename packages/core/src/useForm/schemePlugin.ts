import { FormSceneConfig, FormSceneContext } from './base';
import { compileComponents, ComponentType, createScheme, getGlobalConfig, Handle, KoalaPlugin, SchemeChildren, SchemeStatus, ComponentDesc } from '../base';
import { mergeRefProps, useState } from '../helper';
import { ref, unref } from 'vue';
import { cloneDeep, isArray, isNumber, isUndefined } from 'lodash-es';
import dayjs from 'dayjs';

export const formSchemePlugin: KoalaPlugin<FormSceneContext, FormSceneConfig> = ({ ctx, config: { form, fields } }) => {
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

        const scheme: SchemeStatus = createScheme(field);
        scheme.component = ComponentType.FormItem;
        scheme.children = compileComponents(ctx, field.components);
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
    };

    // 初始化
    ctx.initFields = (values, name) => {
        if (name) {
            initModel[name] = values;
        } else {
            Object.assign(initModel, values);
        }
        ctx.resetFields();
        formScheme.__ref?.value?.resetFields?.();
    };

    ctx.initFields(initModel);
    ctx.model = state;
    ctx.formRef = formScheme.__ref;
    if (ctx.schemes) {
        ctx.schemes.push(formScheme);
    } else {
        ctx.schemes = [formScheme];
    }
};

export const resetFields = (ctx?: FormSceneContext): Handle => {
    return (thisCtx) => {
        const _cxt = (ctx || thisCtx) as FormSceneContext;
        _cxt?.resetFields();
    };
};

export const initFields = (values: Record<string, unknown>, ctx?: FormSceneContext): Handle => {
    return (thisCtx) => {
        const _cxt = (ctx || thisCtx) as FormSceneContext;
        _cxt?.initFields(values);
    };
};

/**
 * 取from的model数据进行格式化，规则如下:
 * - 日期处理，当组件时时间组件，会转成时间戳；如果值是数组，那么会解析成${fieldName}Start和${fieldName}End字段
 * - 多选，当组件是Select或者CheckBox并值是数组时，转成用','分割，如[1,2,3] => '1,2,3'
 * @param extend form外的其他参数
 * @param cxt 指定上下文
 * @returns
 */
export const getFormatFormData = (extend?: Record<string, unknown>, cxt?: FormSceneContext): Handle => {
    return (thisCxt) => {
        const _cxt = cxt || thisCxt;
        if (!_cxt) return [];
        const model = cloneDeep(unref(_cxt.model) || {});
        const fields = (_cxt?.__config as FormSceneConfig)?.fields || [];
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
        Object.assign(model, extend || {});
        return [model, _cxt.model];
    };
};

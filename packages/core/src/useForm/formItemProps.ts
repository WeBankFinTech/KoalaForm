import { computed, unref } from 'vue';
import { useState } from '../helper';
import { getSceneContext, KoalaPlugin } from '../base';
import { FormSceneContext } from './base';

export const formItemPropsPlugin: KoalaPlugin<FormSceneContext> = (ctx, { fields }) => {
    if (!fields) return;
    const propsMap = {};
    const { getProps, setProps } = ctx;
    fields.forEach((field) => {
        if (!field.name) return;
        propsMap[field.name] = useState(
            computed(() => ({
                label: unref(field.label),
                prop: unref(field.name),
            })),
        );
    });

    ctx.getProps = (name, type) => {
        if (type === 'formItem') {
            return propsMap[name]?.state;
        }
        return getProps(name, type);
    };

    ctx.setProps = (values, type) => {
        if (type === 'formItem') {
            Object.keys(values).forEach((key) => {
                propsMap[key]?.setState?.(values[key]);
            });
        } else {
            setProps(values, type);
        }
    };
};

export const getFormItemProps = (name: string, prop?: string, ctx?: FormSceneContext) => {
    const _cxt = getSceneContext<FormSceneContext>(ctx);
    const props = _cxt?.getProps?.(name, 'formItem');
    if (props && prop) {
        return props[prop];
    }
    return props;
};

export const setFormItemProps = (value: unknown, name?: string, prop?: string, ctx?: FormSceneContext) => {
    const _cxt = getSceneContext<FormSceneContext>(ctx);
    const setProps = _cxt?.setProps;
    if (!setProps) return;
    let newValue = value as Record<string, unknown>;
    if (name && prop) {
        newValue = { [name]: { [prop]: value } };
    } else if (name) {
        newValue = { [name]: value };
    }
    setProps(newValue, 'formItem');
};

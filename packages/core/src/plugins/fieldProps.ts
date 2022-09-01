import { computed, unref } from 'vue';
import { useState } from '../helper';
import { getSceneContext, KoalaPlugin, SceneContext } from '../base';

export const fieldPropsPlugin: KoalaPlugin = (ctx, { fields }) => {
    if (!fields) return;
    const propsMap = {};
    fields.forEach((field) => {
        if (!field.name) return;
        propsMap[field.name] = useState(computed(() => unref(field.props || {})));
    });
    const { getProps, setProps } = ctx;
    ctx.getProps = (name, type) => {
        if (type === 'field') {
            return propsMap[name]?.state || {};
        }
        return getProps(name, type);
    };

    ctx.setProps = (values, type) => {
        if (type === 'field') {
            Object.keys(values).forEach((key) => {
                propsMap[key]?.setState?.(values[key]);
            });
        } else {
            setProps(values, type);
        }
    };
};

export const getFieldProps = (name: string, prop?: string, ctx?: SceneContext) => {
    const _cxt = getSceneContext<SceneContext>(ctx);
    const props = _cxt?.getProps?.(name, 'field');
    if (props && prop) {
        return props[prop];
    }
    return props;
};

export const setFieldProps = (value: unknown, name?: string, prop?: string, ctx?: SceneContext) => {
    const _cxt = getSceneContext<SceneContext>(ctx);
    const setProps = _cxt?.setProps;
    if (!setProps) return;
    let newValue = value as Record<string, unknown>;
    if (name && prop) {
        newValue = { [name]: { [prop]: value } };
    } else if (name) {
        newValue = { [name]: value };
    }
    setProps(newValue, 'field');
};

import { FormSceneConfig, FormSceneContext } from './base';
import { useState } from '../helper';
import { getSceneContext, KoalaPlugin } from '../base';

export const formPropsPlugin: KoalaPlugin<FormSceneContext, FormSceneConfig> = (ctx, { formProps }) => {
    if (!formProps) return;
    const { getState, setState } = useState(formProps);
    const { getProps, setProps } = ctx;
    ctx.getProps = (name, type) => {
        if (type === 'form') return getState();
        else return getProps(name, type);
    };

    ctx.setProps = (value, type) => {
        if (type === 'form') return setState(value);
        else return setProps(value, type);
    };
};

export const getFormProps = (ctx?: FormSceneContext, prop?: string) => {
    const _cxt = getSceneContext<FormSceneContext>(ctx);
    const props = _cxt?.getProps?.('', 'form');
    if (props && prop) {
        return props[prop];
    }
    return props;
};

export const setFormProps = (value: unknown, ctx?: FormSceneContext, prop?: string) => {
    const _cxt = getSceneContext<FormSceneContext>(ctx);
    const setProps = _cxt?.setProps;
    if (!setProps) return;
    let newValue = value as Record<string, unknown>;
    if (prop) {
        newValue = { [prop]: value };
    }
    setProps(newValue, 'formItem');
};

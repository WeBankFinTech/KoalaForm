import { unref } from 'vue';
import { useAction, useFieldsAction } from '../action';
import { turnArray, useState } from '../helper';
import { KoalaPlugin } from '../base';

export const renderActionPlugin: KoalaPlugin = (ctx, { actions, fields }) => {
    const propsMap = new Map();
    const actionList = [...turnArray(actions)];
    fields?.forEach((field) => {
        actionList.push(...turnArray(field.actions));
    });
    // 带有组件名动作，需要解析props
    actionList.forEach((action) => {
        if (!action.component) return;
        const props = useState(action.props || {});
        propsMap.set(action.name || action, props);
    });

    ctx.renderAction = (action) => {
        if (!action || !action.component) return;
        const Button = ctx.getComponent(action.component);
        if (!Button) return;
        const props = propsMap.get(action.name || action)?.getState();
        return <Button {...props}>{unref(action.label)}</Button>;
    };
    const { getProps } = ctx;
    ctx.getProps = (name, type) => {
        if (type === 'action') return propsMap.get(name)?.getState();
        else return getProps(name, type);
    };

    useAction(actions || [], ctx);
    useFieldsAction(fields || [], ctx);
};

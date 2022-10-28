import { isArray, isFunction, isString, isUndefined } from 'lodash-es';
import { h, unref, withDirectives, vShow, DirectiveArguments, VNode, createTextVNode, Slots, Slot, DefineComponent, VNodeChild } from 'vue';
import { SceneContext } from '../base';
import { ModelRef, Scheme, SchemeChildren } from '../scheme';
import { PluginFunction } from './define';

const wrapProps = (props: Record<string, any>, slotParams?: any[]) => {
    const _props = { ...props };
    Object.keys(props).forEach((key) => {
        if (isFunction(props[key]) && !key.startsWith('onUpdate')) {
            _props[key] = (...args: any[]) => props[key](...(slotParams || []), ...args);
        }
    });
    return _props;
};

const renderNode = (ctx: SceneContext, scheme: Scheme | string | ModelRef | Slot, slotParams?: any[]) => {
    if (!scheme) return;
    if (isString(scheme)) return createTextVNode(scheme);
    if ((scheme as ModelRef).ref) {
        const { ref, name } = scheme as ModelRef;
        return createTextVNode(ref[name]);
    }
    if (isFunction(scheme)) {
        return scheme(...(slotParams || []));
    }
    const { __ref, vIf, vModels, vShow: _vShow, component, events, props: _props, children: _children, slots: _slots } = scheme as Scheme;
    if (vIf?.value === false) return;
    const Component = ctx.getComponent(component);
    const props = { ...events, ref: __ref }; // 组件事件
    if (_props) {
        // 组件属性
        Object.keys(unref(_props)).forEach((key) => {
            props[key] = unref(_props?.[key]);
        });
    }
    // 绑定model
    if (!isUndefined(vModels)) {
        Object.keys(vModels).forEach((key) => {
            const { ref, name } = (vModels as Record<string, ModelRef>)[key];
            props[key] = ref[name];
            props[`onUpdate:${key}`] = (value: unknown) => {
                ref[name] = value;
            };
        });
    }
    // 渲染组件
    if (!Component) {
        return renderSchemes(ctx, _children);
    }
    let children: Slots | undefined = _slots;
    if (_slots?.default) {
        children = _slots as Slots;
    } else if (_children) {
        children = {
            ...(_slots || {}),
            default: (...args) => renderSchemes(ctx, _children, args) as VNode[],
        };
    }
    const vNode = h(Component as DefineComponent, wrapProps(props, slotParams), children);
    // 指令
    const directives: DirectiveArguments = [];
    if (!isUndefined(_vShow)) {
        directives.push([vShow, _vShow.value]);
    }
    if (directives.length) {
        return withDirectives(vNode, directives);
    } else {
        return vNode;
    }
};

const renderSchemes = (ctx: SceneContext, schemes?: SchemeChildren, slotParams?: any[]): VNodeChild | undefined => {
    if (!schemes) return;
    if (isArray(schemes)) {
        return schemes.map((scheme) => renderNode(ctx, scheme, slotParams));
    } else {
        return renderNode(ctx, schemes as string | ModelRef, slotParams);
    }
};

export const renderPlugin: PluginFunction = (api) => {
    api.describe('render-plugin');

    api.onSelfStart(({ ctx }) => {
        ctx.render = () => renderSchemes(ctx, ctx.schemes);
        api.emit('started');
    });
};

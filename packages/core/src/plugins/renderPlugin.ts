import { isArray, isFunction, isString, isUndefined } from 'lodash-es';
import { h, unref, withDirectives, vShow, DirectiveArguments, VNode, createTextVNode, Slots, Slot, DefineComponent, VNodeChild, isRef } from 'vue';
import { SceneContext } from '../base';
import { ComponentType, ModelRef, Scheme, SchemeChildren } from '../scheme';
import { PluginFunction } from './define';

const wrapProps = (props: Record<string, any>, slotParams?: any) => {
    const _props = { ...props };
    if (slotParams?.__koalaColFlag) {
        Object.keys(props).forEach((key) => {
            if (isFunction(props[key]) && key.startsWith('on') && !key.startsWith('onUpdate:')) {
                _props[key] = (...args: any[]) => props[key](slotParams, ...args);
            }
        });
    }
    return _props;
};

const renderNode = (ctx: SceneContext, scheme: Scheme | string | ModelRef | Slot, slotParam?: any) => {
    if (!scheme) return;
    if (isString(scheme)) return createTextVNode(scheme);
    if ((scheme as ModelRef).ref) {
        const { ref, name } = scheme as ModelRef;
        return createTextVNode((ref as any)[name]);
    }
    if (isFunction(scheme)) {
        return scheme(slotParam);
    }
    const { __ref, vIf, vModels, vShow: _vShow, component, events, props: _props, children: _children, slots: _slots } = scheme as Scheme;
    if (vIf?.value === false) return;
    const Component = ctx.getComponent(component as string);

    const props: any = { ...events, ref: __ref }; // 组件事件
    if (_props) {
        // 组件属性
        Object.keys(unref(_props)).forEach((key) => {
            props[key] = unref((_props as any)?.[key]);
        });
    }
    // 绑定model
    if (!isUndefined(vModels)) {
        Object.keys(vModels).forEach((key) => {
            const vModel = vModels[key] as any;
            if (isRef(vModel)) {
                props[key] = unref(vModel);
            } else {
                props[key] = vModel.name !== '__value' ? unref(vModel.ref)[vModel.name] : unref(vModel.ref);
            }
            props[`onUpdate:${key}`] = (value: any) => {
                if (isRef(vModel)) {
                    vModel.value = value;
                } else if (isRef(vModel.ref)) {
                    if (vModel.name) {
                        (vModel.ref.value as any)[vModel.name] = value;
                    } else {
                        vModel.ref.value = value;
                    }
                } else {
                    if (vModel.name) {
                        vModel.ref[vModel.name] = value;
                    } else {
                        Object.assign(vModel.ref, value);
                    }
                }
            };
        });
    }
    // 渲染组件
    if (!Component) {
        return renderSchemes(ctx, _children);
    }
    let children: Slots | undefined = _slots;
    if (_slots?.default) {
        children = { ..._slots } as Slots;
    } else if (_children) {
        children = {
            ...(_slots || {}),
            default: (_slotParam: any) => {
                if (component === ComponentType.TableColumn && _slotParam) {
                    slotParam = { ..._slotParam, __koalaColFlag: true };
                }
                return renderSchemes(ctx, _children, slotParam?.__koalaColFlag ? slotParam : _slotParam) as VNode[];
            },
        };
    }
    const newChildren: any = { ...(children || {}) };
    if (slotParam?.__koalaColFlag && children) {
        // 列表的children slot加上列表的slot参数
        Object.keys(children).forEach((key) => {
            const slot = children?.[key];
            if (isFunction(slot)) {
                newChildren[key] = (params: any) => slot({ ...slotParam, ...(params || {}) });
            }
        });
    }
    const vNode = h(Component as DefineComponent, wrapProps(props, slotParam), newChildren);
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

export const renderSchemes = (ctx: SceneContext, schemes?: SchemeChildren, slotParam?: any): VNodeChild | undefined => {
    if (!schemes) return;
    if (isArray(schemes)) {
        return schemes.map((scheme) => renderNode(ctx, scheme, slotParam));
    } else {
        return renderNode(ctx, schemes as string | ModelRef, slotParam);
    }
};

export const renderPlugin: PluginFunction = (api) => {
    api.describe('render-plugin');

    api.onSelfStart(({ ctx }) => {
        ctx.render = () => renderSchemes(ctx, ctx.schemes);
        api.emit('started');
    });
};

export const composeRender = (renders: Array<SceneContext['render']>): SceneContext['render'] => {
    return (slots?: Slots) => renders.map((render) => render(slots));
};

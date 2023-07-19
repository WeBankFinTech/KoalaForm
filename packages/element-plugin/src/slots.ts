import { ComponentType, Reactive, SceneContext, Scheme } from '@koala-form/core';
import { ElButton, ElCheckbox, ElRadio, ElSpace } from 'element-plus';
import { unref, h } from 'vue';

const optComps = { [ComponentType.CheckboxGroup]: ElCheckbox, [ComponentType.RadioGroup]: ElRadio };
export const genOptions = (name: string, props?: Reactive) => {
    const Comp = optComps[name];
    return () => {
        return unref(unref(props || {}).options)?.map((item: any) => h(Comp, { ...item, label: item.value }, () => item.label));
    };
};

export const genModalFooter = (scheme: Scheme, ctx: SceneContext) => {
    const onOk = () => {
        if (scheme.events?.onOk) {
            scheme.events.onOk();
        } else {
            ctx.modelRef.value.show = false;
        }
    };

    const onCancel = () => {
        if (scheme.events?.onCancel) {
            scheme.events.onCancel();
        } else {
            ctx.modelRef.value.show = false;
        }
    };

    return () =>
        h(ElSpace, {}, () => [
            h(ElButton, { onClick: onCancel }, () => unref(scheme.props || {}).cancelText || '取消'),
            h(ElButton, { onClick: onOk, type: 'primary' }, () => unref(scheme.props || {}).okText || '确定'),
        ]);
};

import { FormSceneContext } from './base';
import { getSceneContext, KoalaPlugin } from '../base';

export const formStatePlugin: KoalaPlugin<FormSceneContext> = (ctx, { fields }) => {
    if (!fields) return;
    const initModel: Record<string, unknown> = {};
    fields.forEach((field) => {
        if (!field.name) return;
        initModel[field.name] = field.defaultValue;
    });
    const state = ctx.getState();

    // 重置
    ctx.resetFields = () => {
        Object.keys(initModel).forEach((key) => (state[key] = initModel[key]));
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

    ctx.initFields(initModel);
};

export const resetFields = (ctx: FormSceneContext | string) => {
    const _cxt = getSceneContext(ctx);
    return _cxt?.resetFields();
};

export const initFields = (values: Record<string, unknown>, name: string, ctx: FormSceneContext | string) => {
    const _cxt = getSceneContext<FormSceneContext>(ctx);
    return _cxt?.initFields(values, name);
};

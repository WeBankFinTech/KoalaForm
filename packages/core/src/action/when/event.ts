import { Action, WhenPlugin } from '../base';
import { concatCaseCamel } from '../../helper';

export type DOC_EVENT_TYPE = keyof DocumentEventMap | String;

export const whenEvent: WhenPlugin<DOC_EVENT_TYPE> = (type: DOC_EVENT_TYPE) => {
    return function (this: Action, ctx, invoke, field) {
        const eventName = concatCaseCamel('on', type as string);
        if (field && !this?.component) {
            // 字段事件
            const props = ctx.getProps(field.name, 'field');
            if (!props) return;
            props[eventName] = (...args: unknown[]) => invoke(...args);
        } else if (this) {
            const props = ctx.getProps(this.name || (this as any as string), 'action');
            if (!props) return;
            props[eventName] = (...args: unknown[]) => invoke(...args);
        }
    };
};

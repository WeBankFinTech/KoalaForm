import { Slots, VNode } from 'vue';
import { Action } from '../action';
import { ComponentType, KoalaPlugin } from '../base';
import { Field } from '../field';
import { turnArray } from '../helper';
import { FormSceneContext } from './base';

export const renderFormPlugin: KoalaPlugin<FormSceneContext> = (ctx, { fields, actions, actionsLayout }) => {
    if (!fields) return;
    const { getComponent, getProps, getState, renderComponent } = ctx;
    const state = getState();

    const renderActions = (actionList?: Action | Action[], layout?: { component: string; props?: Record<string, unknown> }) => {
        if (!actions) return;
        return renderComponent(layout?.component, layout?.props, {
            default: () => turnArray(actionList).map((action) => ctx.renderAction(action)) as VNode[],
        });
    };

    const renderField = (field: Field, slots?: Slots) => {
        const FormItem = getComponent(ComponentType.FormItem);
        const FieldComponent = getComponent(field.component);
        if (!FormItem) return;
        const props = getProps(field.name, 'field');
        const formItemProps = getProps(field.name, 'formItem');
        console.log(formItemProps);
        return (
            <FormItem {...formItemProps}>
                {FieldComponent ? <FieldComponent v-model={[state[field.name]]} {...props} /> : state[field.name] || ''}
                {renderActions(field.actions, field.actionsLayout)}
            </FormItem>
        );
    };

    ctx.render = (slots) => {
        const Form = getComponent(ComponentType.Form);
        if (!Form) return;
        const props = getProps('', 'form') || {};
        return (
            <>
                <Form model={state} {...props}>
                    {fields.map((field) => renderField(field, slots))}
                </Form>
                {renderActions(actions, actionsLayout)}
            </>
        );
    };
};

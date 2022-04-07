import { reactive, Slots, VNodeChild, VNode, ref, Ref, Slot } from 'vue';
import { BaseField, Field, travelFields, getFieldProp } from './field';
import { _preset } from './preset';
import { ACTION_TYPES } from './const';
import { isUndefined, merge } from 'lodash-es';
import { getOptions, isFunction } from './utils';

function mergeRule(field: BaseField) {
    const _rules = getFieldProp(field.rules);
    if (field.required || _rules) {
        const rules = !_rules ? [] : Array.isArray(_rules) ? [..._rules] : [_rules];
        if (rules.includes((rule: { required: boolean }) => rule.required)) {
            return rules;
        }
        if (field.required) {
            rules.unshift({
                required: true,
                type: field.type === 'number' ? 'number' : 'string',
                message: `${field.label}为必填项`,
            });
            return rules;
        }
        return rules;
    } else {
        return _rules;
    }
}

// form-item slot规则，优先级有底到高
// 1. name=字段名，slot指向的是formItem内容，会用在所有匹配的表单上
// 3. name=formItem_字段名，name=type_formItem_字段名，slot指向的是formItem
// 2. name=type_字段名，slot指向的是formItem内容，会用在对应的表单上，如type=‘query’，会用在查询的表单上
export default function useForm(fields: Array<Field> = [], type: ACTION_TYPES) {
    const model: Record<string, any> = reactive({});
    const formProps: Record<string, any> = reactive({});
    const rulesRef: Record<string, any> = reactive({});
    const formRef: Ref<any> = ref(null);
    let initForm: Record<string, any> = {};

    // 规则和字段解析
    travelFields(fields, type, (field) => {
        if (!field.status) return;
        model[field.name || ''] = null;
        rulesRef[field.name || ''] = mergeRule(field);
    });

    const formItemRender = (slots: Slots): VNodeChild => {
        const formItems: VNodeChild = [];
        travelFields(fields, type, (field) => {
            // 不在model的字段或者hidden字段跳过
            if (!Object.prototype.hasOwnProperty.call(model, field.name || '') || field.status === 'hidden' || !field.status) {
                return;
            }
            const slotParams = {
                type,
                model,
                rulesRef,
                props: getFieldProp(field.props),
                disabled: type === 'view' ? true : field.status === 'disabled',
                options: getOptions(_preset, field),
            };
            const slotKey = `${field.name}`;
            const typeSlotKey = `${type}_${field.name}`;
            const formSlotKey = `formItem_${field.name}`;
            const typeFormItemSlotKey = `${type}_formItem_${field.name}`;

            // 内部解析
            let slot: any = () => {
                const vNode = _preset.formItemFieldRender?.(field, slotParams) as VNode;
                return [vNode];
            };

            if (isFunction(slots?.[typeSlotKey])) {
                // 按类型的slot
                slot = slots[typeSlotKey];
            } else if (isFunction(slots?.[typeFormItemSlotKey])) {
                // 按类型的formItem slot
                formItems.push(slots[typeFormItemSlotKey]?.(slotParams));
                return;
            } else if (isFunction(slots?.[slotKey])) {
                // 通用的slot
                slot = slots[slotKey];
            } else if (isFunction(slots?.[formSlotKey])) {
                // 通用的formItem slot
                formItems.push(slots[formSlotKey]?.(slotParams));
                return;
            }
            formItems.push(_preset.formItemRender?.(() => slot?.(slotParams), field, type));
        });
        return formItems;
    };

    const render = (slots: Slots): VNodeChild => {
        const slot = () => {
            let vNodes = formItemRender(slots) as VNode[];
            if (slots[`${type}_extend_items`]) {
                vNodes = vNodes.concat((slots[`${type}_extend_items`] as Slot)({ model, type }));
            } else if (slots.extend_items) {
                vNodes = vNodes.concat(slots.extend_items({ model, type }));
            }
            return vNodes;
        };
        return _preset.formRender?.(slot, {
            formRef,
            rulesRef,
            model,
            type,
            props: formProps,
        });
    };

    const setFields = (fields: Record<string, any> = {}) => {
        Object.keys(model).forEach((key) => {
            if (!isUndefined(fields[key])) {
                model[key] = fields[key];
            }
        });
    };

    const initFields = (fields: Record<string, any> = {}) => {
        initForm = merge(initForm, fields);
        setFields(initForm || {});
    };

    const resetFields = () => {
        _preset.formReset?.(formRef);
        setFields(initForm || {});
    };

    const validate = async (nameList?: string[]) => {
        return _preset.formValidate?.(formRef, nameList);
    };

    const setFormProps = (value: Record<string, any>) => {
        if (!value) return;
        Object.assign(formProps, value);
    };

    initFields(model);

    return {
        model,
        formRef,
        rulesRef,
        formProps,
        render,
        formItemRender,
        initFields,
        resetFields,
        validate,
        setFields,
        setFormProps,
    };
}

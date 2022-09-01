import { FormSceneContext } from './base';
import { Field, ValidateRule } from '../field';
import { KoalaPlugin } from '../base';

const parseFieldRule = (field: Field): Array<ValidateRule> => {
    if (field.rules && field.rules.some((rule) => rule.required)) {
        return field.rules;
    } else if (field.required) {
        return [{ required: true, message: '必填项', type: field.type }];
    } else {
        return [];
    }
};

export const rulePlugin: KoalaPlugin<FormSceneContext> = (cxt, { fields }) => {
    if (!fields) return;
    const ruleMap = {};
    fields.forEach((field) => {
        if (!field.name) return;
        const rules = parseFieldRule(field);
        if (rules.length) {
            cxt.setProps(
                {
                    [field.name]: { rules },
                },
                'formItem',
            );
            ruleMap[field.name];
        }
    });
};

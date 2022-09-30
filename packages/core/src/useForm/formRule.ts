import { FormSceneConfig, FormSceneContext } from './base';
import { KoalaPlugin, Field, ValidateRule, findScheme, getSceneContext, Handle } from '../base';
import { mergeRefProps } from '../helper';

const parseFieldRule = (field: Field): Array<ValidateRule> => {
    if (field.rules && field.rules.some((rule) => rule.required)) {
        return field.rules;
    } else if (field.required) {
        return [{ required: true, message: '必填项', type: field.type }];
    } else {
        return [];
    }
};

export const formRulePlugin: KoalaPlugin<FormSceneContext, FormSceneConfig> = (cxt, { fields }) => {
    if (!fields) return;
    const ruleMap = {};
    fields.forEach((field) => {
        if (!field.name) return;
        const scheme = findScheme(cxt.schemes, field);
        if (!scheme) return;
        const rules = parseFieldRule(field);
        if (rules.length) {
            mergeRefProps(scheme, 'props', { rules, prop: field.name });
            ruleMap[field.name];
        }
    });

    cxt.validate = async (names) => {
        await cxt.formRef.value?.validate(names);
    };

    cxt.clearValidate = () => {
        cxt.formRef.value?.clearValidate();
    };
};

export const validate = (names?: string[], ctx?: FormSceneContext | string): Handle => {
    return async (thisCtx) => {
        const _cxt = getSceneContext(ctx || thisCtx) as FormSceneContext;
        await _cxt?.validate(names);
    };
};

export const clearValidate = (ctx?: FormSceneContext | string): Handle => {
    return (thisCtx) => {
        const _cxt = getSceneContext(ctx || thisCtx) as FormSceneContext;
        _cxt?.clearValidate();
    };
};

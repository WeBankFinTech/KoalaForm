import { FormSceneConfig, FormSceneContext } from './base';
import { KoalaPlugin, Field, ValidateRule, findScheme, Handle } from '../base';
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

export const formRulePlugin: KoalaPlugin<FormSceneContext, FormSceneConfig> = ({ ctx, config: { fields } }) => {
    if (!fields) return;
    const ruleMap = {};
    fields.forEach((field) => {
        if (!field.name) return;
        const scheme = findScheme(ctx.schemes, field);
        if (!scheme) return;
        const rules = parseFieldRule(field);
        if (rules.length) {
            mergeRefProps(scheme, 'props', { rules, prop: field.name });
            ruleMap[field.name];
        }
    });

    ctx.validate = async (names) => {
        await ctx.formRef.value?.validate(names);
    };

    ctx.clearValidate = () => {
        ctx.formRef.value?.clearValidate();
    };
};

export const validate = (names?: string[], ctx?: FormSceneContext): Handle => {
    return async (thisCtx) => {
        const _cxt = (ctx || thisCtx) as FormSceneContext;
        await _cxt?.validate(names);
    };
};

export const clearValidate = (ctx?: FormSceneContext): Handle => {
    return (thisCtx) => {
        const _cxt = (ctx || thisCtx) as FormSceneContext;
        _cxt?.clearValidate();
    };
};

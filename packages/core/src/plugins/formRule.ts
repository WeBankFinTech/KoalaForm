import { FormSceneConfig, FormSceneContext } from '../useForm';
import { mergeRefProps } from '../helper';
import { Field, findScheme, ValidateRule } from '../scheme';
import { PluginFunction } from './define';

const parseFieldRule = (field: Field): Array<ValidateRule> => {
    if (field.rules && field.rules.some((rule) => rule.required)) {
        return field.rules;
    } else if (field.required) {
        return [{ required: true, message: '必填项', type: field.type }];
    } else {
        return [];
    }
};

export const formRulePlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-rule-plugin');

    api.on('formSchemeLoaded', ({ ctx, config: { fields } }) => {
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

        api.emit('started');
    });
};

export const doValidate = async (ctx: FormSceneContext, names?: string[]) => {
    await ctx?.validate(names);
};

export const doClearValidate = (ctx: FormSceneContext) => {
    ctx?.clearValidate();
};

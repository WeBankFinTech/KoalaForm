import { FormSceneConfig, FormSceneContext } from '../useForm';
import { mergeRefProps } from '../helper';
import { Field, findScheme, ValidateRule } from '../scheme';
import { PluginFunction } from './define';
import { computed, unref } from 'vue';

const parseFieldRule = (field: Field): Array<ValidateRule> => {
    const rules = unref(field.rules) || [];
    const required = unref(field.required);
    if (rules.some((rule) => rule.required)) {
        return rules;
    } else if (required) {
        return [{ required: true, message: '必填项', type: field.type }, ...rules];
    } else {
        return rules || [];
    }
};

export const formRulePlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-rule-plugin');

    api.on('formSchemeLoaded', ({ ctx, config: { fields } }) => {
        if (!fields) return;
        fields.forEach((field) => {
            if (!field.name) return;
            const scheme = findScheme(ctx.schemes, field);
            if (!scheme || !(field.required || field.rules)) return;
            const rules = computed(() => parseFieldRule(field));
            mergeRefProps(scheme, 'props', { rules, prop: field.name });
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

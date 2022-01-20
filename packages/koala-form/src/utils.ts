import { BaseField } from './field';
import { Preset } from './preset';
import { unref, Ref } from 'vue';

export function getOptions(preset: Preset, field: BaseField): Ref<Record<string, any>> | Record<string, any>[] | undefined | boolean {
    if (field.options) {
        return field.options;
    }
    if (field.enumsName) {
        return preset.getEnums?.(field.enumsName || '');
    }
}

export function isFunction(fn: any): boolean {
    return typeof fn === 'function';
}

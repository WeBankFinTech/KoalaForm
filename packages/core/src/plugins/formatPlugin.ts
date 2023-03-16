import dayjs from 'dayjs';
import { isFunction } from 'lodash-es';
import { Slot, unref, VNode } from 'vue';
import { EnumOption, getGlobalConfig } from '../base';
import { mergeRefProps } from '../helper';
import { Field, findScheme } from '../scheme';
import { FormSceneConfig, FormSceneContext } from '../useForm';
import { PluginFunction } from './define';

const format = (ctx: FormSceneContext, config: FormSceneConfig, type: string) => {
    const fields = (config as FormSceneConfig).fields;
    if (!fields) return;
    fields.forEach((field) => {
        if (!isFunction(field.format) || field.slotName) return;
        const scheme = findScheme(ctx.schemes, field);
        if (!scheme) return;
        let defaultSlot: Slot | null = null;
        if (type === 'form') {
            defaultSlot = () => field.format?.(ctx.modelRef.value, ctx.modelRef.value?.[field.name || ''], scheme) as VNode[];
        } else if (type === 'table') {
            defaultSlot = ({ row, cellValue }) => field.format?.(row, cellValue, scheme) as VNode[];
        }
        if (defaultSlot) {
            getGlobalConfig().debug && console.log(`【${ctx.name}】字段(${field.name})指定的format函数将会会覆盖default slot`);
            mergeRefProps(scheme, 'slots', { default: defaultSlot });
        }
    });
};

export const formatPlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('format-plugin');

    api.on('formSchemeLoaded', ({ ctx, config }) => format(ctx, config, 'form'));

    api.on('tableSchemeLoaded', ({ ctx, config }) => format(ctx, config, 'table'));
};

export const formatByOptions: Field['format'] = (model, value, scheme) => {
    const options = unref(unref(scheme.props)?.options) as EnumOption[];
    let values = [value];
    if (typeof value === 'string') {
        values = value.split(',');
    }
    if (options) {
        return values.map((v) => options.find((item) => v === item.value)?.label || v).join('、');
    }
    return value;
};

export const genFormatByDate = (format = 'YYYY-MM-DD', range?: { startName: string; endName: string; split: string }, defaultValue?: string): Field['format'] => {
    const toFormat = (format: string, value: any) => {
        if (!value) return defaultValue || '';
        return dayjs(/^\d+$/.test(value) ? +value : value).format(format);
    };

    return (model, value) => {
        if (range) {
            const start = toFormat(format, model[range.startName]);
            const end = toFormat(format, model[range.endName]);
            return `${start} ${range.split || '-'} ${end}`;
        } else {
            return toFormat(format, value);
        }
    };
};

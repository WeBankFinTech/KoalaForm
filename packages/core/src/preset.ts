import { merge } from 'lodash-es';
import { hAfterDoQuery, hBeforeDoQuery, hRequest } from './handles';
import {
    disabledPlugin,
    eventsPlugin,
    formatPlugin,
    formRulePlugin,
    hValidate,
    installInGlobal,
    optionsPlugin,
    PluginFunction,
    renderPlugin,
    slotPlugin,
    vIfPlugin,
    vShowPlugin,
} from './plugins';
import { ComponentDesc, ComponentType } from './scheme';
import { FormSceneContext, hResetFields } from './useForm';
import { hSetPager, PagerSceneContext } from './usePager';
import { TableSceneContext } from './useTable';

export const installPluginPreset = () => {
    installInGlobal(renderPlugin)
        .append(formRulePlugin as PluginFunction)
        .append(eventsPlugin)
        .append(vIfPlugin)
        .append(vShowPlugin)
        .append(slotPlugin)
        .append(disabledPlugin)
        .append(optionsPlugin)
        .append(formatPlugin as PluginFunction);
};

export const presetPagerChange = async ({
    api,
    pager,
    table,
    form,
    values,
    opt,
}: {
    api: string;
    form: FormSceneContext;
    table: TableSceneContext;
    pager?: PagerSceneContext;
    values?: Record<string, any>;
    opt?: Record<string, any>;
}) => {
    await hValidate(form);
    const data = hBeforeDoQuery(form, pager);
    const res = await hRequest(api, merge(data, values), opt);
    hAfterDoQuery(table, pager, res);
};

export const presetDoQuery = async (config: Parameters<typeof presetPagerChange>[0]) => {
    config.pager && hSetPager(config.pager, { currentPage: 1 });
    await presetPagerChange(config);
};

export const presetDoResetQuery = async (config: Parameters<typeof presetDoQuery>[0]) => {
    hResetFields(config.form);
    await presetDoQuery(config);
};

export const presetQueryBtn = (handler: () => void): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: { type: 'primary' },
        children: ['查询'],
        events: {
            onClick: handler,
        },
    };
};

export const presetResetQueryBtn = (handler: () => void): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: {},
        children: ['重置'],
        events: {
            onClick: handler,
        },
    };
};

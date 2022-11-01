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
import { FormSceneContext, hFormData, hResetFields, hSetFields } from './useForm';
import { hClose, hOpen, ModalSceneContext } from './useModal';
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

export const presetOpenModalForm = ({ modal, form, row }: { modal: ModalSceneContext; form: FormSceneContext; row?: Record<string, any> }) => {
    form && hResetFields(form);
    form && row && hSetFields(form, row);
    hOpen(modal);
};

export const presetSubmitModalForm = async ({
    api,
    form,
    modal,
    values,
    opt,
}: {
    api: string;
    modal: ModalSceneContext;
    form: FormSceneContext;
    values?: Record<string, any>;
    opt?: Record<string, any>;
}) => {
    await hValidate(form);
    const data = hFormData(form, values);
    await hRequest(api, data);
    hClose(modal);
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

export const presetCreateBtn = (handler: () => void): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: { type: 'primary' },
        children: ['新增'],
        events: {
            onClick: handler,
        },
    };
};

export const presetUpdateBtn = (handler: (pre: any[]) => void): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: { type: 'link' },
        children: ['更新'],
        events: {
            onClick: handler,
        },
    };
};

export const presetViewBtn = (handler: (pre: any[]) => void): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: { type: 'link' },
        children: ['详情'],
        events: {
            onClick: handler,
        },
    };
};

export const presetDeleteBtn = (handler: (pre: any[]) => void, title = '是否删除当前记录'): ComponentDesc => {
    return {
        name: ComponentType.Tooltip,
        props: {
            title: title,
            mode: 'confirm',
        },
        events: {
            onOk: handler,
        },
        children: [
            {
                name: ComponentType.Button,
                children: ['删除'],
                props: { type: 'link' },
            },
        ],
    };
};

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

/**
 * 校验表单，并提交表单数据到接口
 */
export const doSubmit = async (config: { api: string; form: FormSceneContext; values?: Record<string, any>; opt?: Record<string, any> }) => {
    const { api, form, values, opt } = config;
    await hValidate(form);
    const data = hFormData(form, values);
    return await hRequest(api, data, opt);
};

/**
 * 取form、pager当前状态作为参数进行刷新列表数据，适用于刷新和pager改变之后
 */
export const doRefresh = async (config: {
    api: string;
    form: FormSceneContext;
    table: TableSceneContext;
    pager?: PagerSceneContext;
    values?: Record<string, any>;
    opt?: Record<string, any>;
}) => {
    const { api, pager, table, form, values, opt } = config;
    await hValidate(form);
    const data = hBeforeDoQuery(form, pager);
    const res = await hRequest(api, merge(data, values), opt);
    hAfterDoQuery(table, pager, res);
};

/**
 * 查询条件改变时，再次查询重置pager后，执行doRefresh，适用于点击查询按钮和首次查询
 */
export const doQuery = async (config: Parameters<typeof doRefresh>[0]) => {
    config.pager && hSetPager(config.pager, { currentPage: 1 });
    await doRefresh(config);
};

/**
 * 重置表单后，执行doRefresh；适用于重置按钮
 */
export const doResetQuery = async (config: Parameters<typeof doRefresh>[0]) => {
    hResetFields(config.form);
    await doQuery(config);
};

/** 重置表单并打开弹窗，如果row存在时,将row设置到表单上，适用于新增/更新/详情按钮打开弹窗表单 */
export const doOpenModal = (config: { modal: ModalSceneContext; form?: FormSceneContext; row?: Record<string, any> }) => {
    const { modal, form, row } = config;
    form && hResetFields(form);
    form && row && hSetFields(form, row);
    hOpen(modal);
};

/** 执行doSubmit成功后，关闭弹窗，适用于弹窗表单的提交按钮 */
export const doCloseModal = async (config: { api: string; modal: ModalSceneContext; form: FormSceneContext; values?: Record<string, any>; opt?: Record<string, any> }) => {
    await doSubmit(config);
    hClose(config.modal);
};

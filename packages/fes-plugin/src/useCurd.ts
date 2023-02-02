import { FMessage } from '@fesjs/fes-design';
import {
    ComponentDesc,
    ComponentType,
    composeRender,
    doBeforeQuery,
    doClose,
    doGetFormData,
    doOpen,
    doRequest,
    doResetFields,
    doSetFields,
    doValidate,
    Field,
    formatByOptions,
    FormSceneConfig,
    FormSceneContext,
    genFormatByDate,
    ModalSceneConfig,
    ModalSceneContext,
    PagerSceneConfig,
    PagerSceneContext,
    SceneContext,
    TableSceneConfig,
    TableSceneContext,
    useForm,
    useModal,
    usePager,
    useSceneContext,
    useTable,
} from '@koala-form/core';
import { cloneDeep, merge } from 'lodash-es';
import { computed, onMounted, Ref, ref, unref } from 'vue';
import { genButton, genForm } from './preset';

interface Action extends ComponentDesc {
    api?: string;
    reqConfig?: any;
    /** 隐藏默认按钮 */
    hidden?: boolean;
    /** 请求前执行，可修改参数 */
    before?: (params: Record<string, any>, ...args: any[]) => Record<string, any>;
    /** 请求后执行，可修改结果 */
    after?: (params: Record<string, any>) => Record<string, any>;
    /** 打开modal前执行，可修改modal里表单的值 */
    open?: (params: Record<string, any>) => Record<string, any>;
}

interface CurdConfig {
    name?: string;
    query: FormSceneConfig & {
        /** 是否关闭首次自动查询 */
        firstClosed: boolean;
        actionField?: Field | boolean;
    };
    table: TableSceneConfig & {
        rowKey?: string;
        selection?: Field | boolean;
        actionField?: Field | boolean;
    };
    pager?: PagerSceneConfig;
    edit?: FormSceneConfig;
    modal?: ModalSceneConfig;
    actions: {
        query?: Action;
        reset?: Action;
        create?: Action;
        update?: Action;
        delete?: Action;
        view?: Action;
    };
}

const actionTypeMap = {
    create: '新增',
    update: '更新',
    delete: '删除',
    view: '详情',
};

/**
 * 移除列表不需要的字段属性，有options的字段，添加格式化
 * @param fields 字段
 * @returns
 */
export const mapTableFields = (fields: Field[], comm?: Field) => {
    return fields.map((item) => {
        const { components, rules, required, ..._field } = item;
        const field = cloneDeep(comm || {});
        merge(field, _field);
        if (field.options && !field.format) {
            field.format = formatByOptions;
        }
        if (components?.['name'] === ComponentType.DatePicker && !field.format) {
            field.format = genFormatByDate();
        }
        return field;
    });
};

export const useCurd = (config: CurdConfig) => {
    const { actions, query: queryCfg, table: tableCfg, pager: pagerCfg, edit: editCfg, modal: modalCfg } = config;

    const { ctxs } = useSceneContext(['query', 'table', 'pager', 'edit', 'modal']);
    const query = queryCfg.ctx || (ctxs[0] as FormSceneContext);
    const table = tableCfg.ctx || (ctxs[1] as TableSceneContext);
    const pager = pagerCfg?.ctx || (ctxs[2] as PagerSceneContext);
    const edit = editCfg?.ctx || (ctxs[3] as FormSceneContext);
    const modal = modalCfg?.ctx || (ctxs[4] as ModalSceneContext);

    const editTypeRef: Ref<'create' | 'update' | 'view'> = ref('create');
    /** 列表勾选，table.selection可开启 */
    const selectedRows = ref([]);
    /** 分页改变时调用查询 */
    const doPagerChange = async () => {
        if (!actions.query?.api) {
            throw new Error(`action.query.api required!`);
        }
        const { api, after, before, reqConfig } = actions.query;
        let params = doBeforeQuery(query, pager);
        if (before) {
            params = before(params);
        }
        let data = await doRequest(api, params, reqConfig);
        if (after) {
            data = after(data);
        }
        table.modelRef.value = data.list;
        if (pagerCfg) {
            pager.modelRef.value.totalCount = data.page?.totalCount || 0;
        }
    };
    /** 查询按钮调用，分页会重置 */
    const doQuery = async () => {
        selectedRows.value = [];
        if (pagerCfg) {
            pager.modelRef.value.currentPage = 1;
        }
        doPagerChange();
    };
    /** 查询重置调用，分页和表单会重置 */
    const doReset = async () => {
        doResetFields(query);
        doQuery();
    };
    /** 打开modal，设置edit表单数据 */
    const openModal = (type: 'create' | 'update' | 'view', record?: any) => {
        if (!modalCfg) {
            throw new Error(`config.modal required!`);
        }
        editTypeRef.value = type;
        if (config.name) {
            modal.modelRef.value.title = `${config.name}${actionTypeMap[type]}`;
        }
        doResetFields(edit);
        let data = record && { ...record.row };
        const open = actions[type]?.open;
        if (open) data = open(data);
        if (data) {
            editCfg?.fields.forEach((field) => {
                const comp = field.components?.[0] || field.components;
                if (!comp) return;
                if (comp.name === ComponentType.CheckboxGroup || (comp.name === ComponentType.Select && unref(comp.props)?.multiple)) {
                    const text = data[field.name as string] as string;
                    if (text) {
                        data[field.name as string] = text.split(',');
                    }
                }
            });
        }
        if (type !== 'create') {
            doSetFields(edit, data);
        }
        doOpen(modal);
    };

    /** 保存edit表单数据 */
    const doModalOk = async () => {
        if (editTypeRef.value == 'view') {
            doClose(modal);
            return;
        }
        const { api, after, before, reqConfig } = ((editTypeRef.value === 'create' ? actions.create : actions.update) || {}) as Action;
        if (!api) {
            throw new Error(`action.create.api or action.update.api required!`);
        }
        await doValidate(edit);
        let params = doGetFormData(edit);
        if (before) {
            params = before(params);
        }
        const data = await doRequest(api, params, reqConfig);
        if (after) {
            after(data);
        } else {
            FMessage.success(`${actionTypeMap[editTypeRef.value]}成功！`);
            doClose(modal);
            doQuery();
        }
    };

    /** 删除记录 */
    const doDelete = async (record: any) => {
        const { api, after, before, reqConfig } = (actions.delete || {}) as Action;
        if (!api) {
            throw new Error(`action.delete.api required!`);
        }
        let params: any = { id: record?.row[rowKey] };
        if (before) {
            params = before(params, record?.row);
        }
        const data = await doRequest(api, params, reqConfig);
        if (after) {
            after(data);
        } else {
            FMessage.success('删除成功！');
            doQuery();
        }
    };

    useForm({
        ctx: query,
        form: merge(genForm('inline'), queryCfg.form),
        fields: [
            ...queryCfg.fields,
            queryCfg.actionField !== false &&
                merge(
                    {
                        components: {
                            name: ComponentType.Space,
                            children: [
                                actions.query && !actions.query.hidden && merge(genButton('查询', doQuery, { type: 'primary' }), actions.query),
                                actions.create &&
                                    !actions.create.hidden &&
                                    merge(
                                        genButton('新增', () => openModal('create'), { type: 'primary' }),
                                        actions.create,
                                    ),
                                { name: ComponentType.Space, slotName: 'queryActionsExtend' },
                                actions.reset && !actions.reset.hidden && merge(genButton('重置', doReset, { type: 'default' }), actions.reset),
                            ].filter(Boolean) as ComponentDesc[],
                        },
                    },
                    queryCfg.actionField,
                ),
        ].filter(Boolean) as Field[],
    });

    const rowKey = tableCfg.rowKey || 'id';

    useTable({
        ctx: table,
        table: merge<ComponentDesc, ComponentDesc>(
            { name: ComponentType.Table, vModels: { checkedKeys: { name: 'value', ref: selectedRows } }, props: { rowKey } },
            tableCfg.table,
        ),
        fields: [
            tableCfg.selection && merge<Field, Field>({ props: { type: 'selection' } }, tableCfg.selection as Field),
            ...tableCfg.fields,
            tableCfg.actionField !== false &&
                ((actions.update && !actions.update.hidden) || (actions.delete && !actions.delete.hidden) || (actions.view && !actions.view.hidden) || tableCfg.actionField) &&
                merge(
                    {
                        label: '操作',
                        props: { width: 250 },
                        components: {
                            name: ComponentType.Space,
                            children: [
                                actions.update &&
                                    !actions.update.hidden &&
                                    merge(
                                        genButton('更新', (record) => openModal('update', record), { type: 'link' }),
                                        actions.update,
                                    ),
                                actions.view &&
                                    !actions.view.hidden &&
                                    merge(
                                        genButton('详情', (record) => openModal('view', record), { type: 'link' }),
                                        actions.view,
                                    ),
                                actions.delete &&
                                    !actions.delete.hidden &&
                                    merge(
                                        {
                                            name: ComponentType.Tooltip,
                                            props: { mode: 'confirm', title: '是否删除该记录？' },
                                            events: {
                                                onOk: doDelete,
                                            },
                                            children: genButton('删除', undefined, { type: 'link' }),
                                        },
                                        actions.delete,
                                    ),
                                { name: ComponentType.Space, slotName: 'tableActionsExtend', children: [''] },
                            ].filter(Boolean) as ComponentDesc[],
                        },
                    },
                    tableCfg.actionField,
                ),
        ].filter(Boolean) as Field[],
    });

    pagerCfg &&
        usePager({
            ctx: pager,
            pager: merge<ComponentDesc, ComponentDesc>(
                {
                    name: ComponentType.Pagination,
                    events: {
                        onChange: doPagerChange,
                    },
                },
                pagerCfg.pager,
            ),
        });

    editCfg &&
        useForm({
            ctx: edit,
            form: merge(genForm('horizontal', { labelWidth: '80px', labelPosition: 'right' }), editCfg.form),
            fields: editCfg.fields,
        });

    modalCfg &&
        useModal({
            ctx: modal,
            modal: merge(
                {
                    name: ComponentType.Modal,
                    children: edit,
                    events: {
                        onOk: () => doModalOk(),
                    },
                },
                modalCfg.modal,
            ),
        });

    const render = composeRender([query.render, table.render, pager.render, modalCfg && modal.render].filter(Boolean) as SceneContext['render'][]);

    if (!queryCfg.firstClosed) {
        onMounted(() => {
            doQuery();
        });
    }

    return {
        query,
        table,
        pager,
        edit,
        modal,
        editTypeRef,
        /** 列表勾选，table.selection可开启 */
        selectedRows,
        isCreate: computed(() => editTypeRef.value === 'create'),
        isUpdate: computed(() => editTypeRef.value === 'update'),
        isView: computed(() => editTypeRef.value === 'view'),
        render,
        /** 查询按钮调用，分页会重置 */
        doQuery,
        /** 分页改变时调用查询 */
        doPagerChange,
        /** 查询重置调用，分页和表单会重置 */
        doReset,
        /** 打开modal，设置edit表单数据 */
        openModal,
        /** 保存edit表单数据 */
        doModalOk,
        /** 删除记录 */
        doDelete,
    };
};

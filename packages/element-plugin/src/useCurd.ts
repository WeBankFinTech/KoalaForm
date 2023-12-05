import { ElButton, ElMessage, ElPopconfirm } from 'element-plus';
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
    getGlobalConfig,
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
import { computed, h, onMounted, Ref, ref, Slots, unref, watch } from 'vue';
import { genButton, genForm } from './preset';

interface Action extends ComponentDesc {
    api?: string;
    reqConfig?: any;
    /** 隐藏默认按钮 */
    hidden?: boolean;
    /** 请求前执行，可修改请求参数，返回false可阻止请求发送 */
    before?: (params: Record<string, any>, ...args: any[]) => Record<string, any> | boolean;
    /** 请求后执行，可修改结果，返回false可阻止默认流程的执行 */
    after?: (params: Record<string, any>) => Record<string, any> | boolean;
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
            getGlobalConfig().debug && console.log(`字段${field.name}将默认加上formatByOptions`);
        }
        if (components?.['name'] === ComponentType.DatePicker && !field.format) {
            field.format = genFormatByDate();
            getGlobalConfig().debug && console.log(`字段${field.name}将默认加上genFormatByDate()`);
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

    const showQueryActionsExtend = ref(true);
    const showTableActionsExtend = ref(true);

    const editTypeRef: Ref<'create' | 'update' | 'view'> = ref('create');
    /** 列表勾选，table.selection可开启 */
    const selectedRows = ref<any>([]);
    /** 分页改变时调用查询 */
    const doPagerChange = async () => {
        if (!actions.query?.api) {
            throw new Error(`action.query.api required!`);
        }
        const { api, after, before, reqConfig } = actions.query;
        let params: any = doBeforeQuery(query, pager);
        before && (params = before(params));
        if (!params) {
            getGlobalConfig().debug && console.warn('actions.query.before返回false阻止了请求执行，如果是自定义请求流程，可忽略');
            return;
        }
        let data = await doRequest(api, params, reqConfig);
        after && (data = after(data));
        if (!data) {
            getGlobalConfig().debug && console.warn('actions.query.after返回false阻止了默认逻辑数据绑定，请自行绑定数据！');
            return;
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
                    const text = data[field.name as string];
                    if (typeof text === 'string') {
                        const value = text ? text.split(',') : [];
                        data[field.name as string] = value;
                        getGlobalConfig().debug && console.log(`字段${field.name}多选，其值${text}解析将自动成数组`);
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
        before && (params = before(params));
        if (!params) {
            getGlobalConfig().debug && console.warn('actions.[create/update].before返回false阻止了请求执行，如果是自定义请求流程，可忽略');
            return;
        }
        const data = (await doRequest(api, params, reqConfig)) || {};
        const res = after?.(data);
        if (!after || res) {
            ElMessage.success(`${actionTypeMap[editTypeRef.value]}成功！`);
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
        before && (params = before(params, record?.row));
        if (!params) {
            getGlobalConfig().debug && console.warn('actions.delete.before返回false阻止了请求执行，如果是自定义请求流程，可忽略');
            return;
        }
        const data = (await doRequest(api, params, reqConfig)) || {};
        const res = after?.(data);
        if (!after || res) {
            ElMessage.success('删除成功！');
            doQuery();
        }
    };

    useForm({
        ctx: query,
        form: merge(genForm(true), queryCfg.form),
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
                                { name: ComponentType.Space, vIf: showQueryActionsExtend, slotName: 'queryActionsExtend' },
                                actions.reset && !actions.reset.hidden && merge(genButton('重置', doReset, { type: 'default' }), actions.reset),
                            ].filter(Boolean) as ComponentDesc[],
                        },
                    },
                    queryCfg.actionField,
                ),
        ].filter(Boolean) as Field[],
    });

    const rowKey = tableCfg.rowKey || 'id';

    const doSelectionChange = (selection = []) => {
        selectedRows.value = selection.map((item) => item[rowKey]);
    };

    watch(selectedRows, (newVal, oldVal) => {
        if (newVal.toString() !== oldVal.toString()) {
            table.modelRef.value?.forEach((row: any) => {
                table.ref.value.toggleRowSelection(row, selectedRows.value.includes(row[rowKey]));
            });
        }
    });

    useTable({
        ctx: table,
        table: merge<ComponentDesc, any>(
            {
                name: ComponentType.Table,
                props: { rowKey },
                events: {
                    onSelectionChange: doSelectionChange,
                },
            },
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
                                        genButton('更新', (record) => openModal('update', record), { link: true }),
                                        actions.update,
                                    ),
                                actions.view &&
                                    !actions.view.hidden &&
                                    merge(
                                        genButton('详情', (record) => openModal('view', record), { link: true }),
                                        actions.view,
                                    ),
                                actions.delete &&
                                    !actions.delete.hidden &&
                                    merge(
                                        {
                                            name: ElPopconfirm,
                                            props: { title: '是否删除该记录？', width: 200 },
                                            events: {
                                                onConfirm: doDelete,
                                            },
                                            slots: {
                                                reference: () => h(ElButton, { link: true, type: 'primary' }, () => '删除'),
                                            },
                                        },
                                        actions.delete,
                                    ),
                                { name: ComponentType.Space, vIf: showTableActionsExtend, slotName: 'tableActionsExtend' },
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
                        onCurrentChange: doPagerChange,
                    },
                },
                pagerCfg.pager,
            ),
        });

    editCfg &&
        useForm({
            ctx: edit,
            form: merge(genForm(false, { labelWidth: '80px', labelPosition: 'right' }), editCfg.form),
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

    const render = (slots: Slots) => {
        const cr = composeRender([query.render, table.render, pager.render, modalCfg && modal.render].filter(Boolean) as SceneContext['render'][]);
        return cr(slots);
    };

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
        showQueryActionsExtend,
        showTableActionsExtend,
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

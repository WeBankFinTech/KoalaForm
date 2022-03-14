import {
    FButton,
    FInputNumber,
    FTable,
    FInput,
    FSelect,
    FOption,
    FDatePicker,
    FRadio,
    FCheckbox,
    FForm,
    FFormItem,
    FConfigProvider,
    FModal,
    FMessage,
    FTableColumn,
    FPagination,
    FSwitch,
    FCheckboxGroup,
    FRadioGroup,
    FTimePicker,
    FGrid,
    FGridItem,
} from '@fesjs/fes-design';
import { definePreset } from '@koala-form/core';
import { unref } from 'vue';
import './style/index.css';
import moment from 'moment';

const dateTypeMap = {
    date: 'date',
    dates: 'daterange',
    dateTime: 'datetime',
    dateTimes: 'datetimerange',
};
export default definePreset({
    formatToEdit(data, field) {
        const value = data[field.name];
        switch (field.type) {
            case 'date':
            case 'dateTime':
                data[field.name] = moment(value).valueOf();
                break;
            case 'dates':
            case 'dateTimes':
                const start = data[`${field.name}Start`];
                const end = data[`${field.name}End`];
                if (start || end) {
                    data[field.name] = [];
                    if (start) {
                        data[field.name][0] = moment(start).valueOf();
                    }
                    if (end) {
                        data[field.name][1] = moment(end).valueOf();
                    }
                }
                break;
            case 'checkbox':
                if (typeof value === 'string') {
                    data[field.name] = data[field.name]?.split(',');
                }
                break;
        }
    },
    formatToReqParams(data, field) {
        const value = data[field.name];
        if (!value) return;
        switch (field.type) {
            case 'date':
                data[field.name] = moment(value).startOf('date').valueOf();
                break;
            case 'dateTime':
                data[field.name] = moment(value).valueOf();
                break;
            case 'dates':
            case 'dateTimes':
                const start = moment(value[0]);
                const end = moment(value[1]);
                if (field.type === 'dates') {
                    start.startOf('date');
                    end.endOf('date');
                }
                if (value[0]) {
                    data[`${field.name}Start`] = start.valueOf();
                }
                if (value[1]) {
                    data[`${field.name}End`] = end.valueOf();
                }
                delete data[field.name];
                break;
            case 'checkbox':
                if (Array.isArray(value)) {
                    data[field.name] = value.join(',');
                }
                break;
        }
    },
    formItemFieldRender(field, { model, disabled, props, options } = {}) {
        if (!model || !field) return;
        let body;
        const opts = unref(options);
        const prop = {
            disabled,
            ...props,
        };
        if (opts) prop.options = opts;
        switch (field.type) {
            case 'number':
                body = <FInputNumber {...prop} v-model={model[field.name]} />;
                break;
            case 'select':
                body = <FSelect {...prop} v-model={model[field.name]} />;
                break;
            case 'switch':
                body = <FSwitch {...prop} v-model={model[field.name]} />;
                break;
            case 'date':
            case 'dates':
            case 'dateTime':
            case 'dateTimes':
                body = <FDatePicker type={dateTypeMap[field.type]} {...prop} v-model={model[field.name]} />;
                break;
            case 'time':
                body = <FTimePicker {...prop} v-model={model[field.name]} />;
                break;
            case 'checkbox':
                body = (
                    <FCheckboxGroup {...prop} v-model={model[field.name]} options={[]}>
                        {opts?.map((item) => (
                            <FCheckbox key={item.value} value={item.value} label={item.label} />
                        ))}
                    </FCheckboxGroup>
                );
                break;
            case 'radio':
                body = (
                    <FRadioGroup {...prop} v-model={model[field.name]} options={[]}>
                        {opts?.map((item) => (
                            <FRadio key={item.value} value={item.value} label={item.label} />
                        ))}
                    </FRadioGroup>
                );
                break;
            default:
                body = <FInput {...prop} v-model={model[field.name]} />;
        }
        return body;
    },
    formItemRender(defaultSlot, field, type) {
        if (!field || typeof defaultSlot !== 'function') return;
        return (
            <FGridItem span={field.span || 24}>
                <FFormItem label={field.label + ':'} prop={field.name}>
                    {defaultSlot()}
                </FFormItem>
            </FGridItem>
        );
    },
    formRender(defaultSlot, { model, formRef, rulesRef, type } = { type: 'query' }) {
        return (
            <FForm
                labelPosition="right"
                labelClass="fesd-koala-form-label"
                class={{
                    'fesd-koala-form': true,
                    'fesd-koala-form-query': type === 'query',
                }}
                ref={formRef}
                model={model}
                rules={rulesRef}
            >
                <FGrid wrap> {defaultSlot?.()} </FGrid>
            </FForm>
        );
    },
    formReset(formRef) {
        formRef.value?.resetFields();
    },
    formValidate(formRef) {
        return formRef.value?.validate();
    },
    queryActionRender({ handle, reset, extendSlot, extendRef }) {
        return (
            <FFormItem class="fesd-form-item-action">
                <FButton type="primary" class="action-margin" onClick={() => handle()}>
                    查询
                </FButton>
                {extendRef?.openInsertModal && (
                    <FButton type="primary" class="action-margin" onClick={() => extendRef.openInsertModal?.()}>
                        新增
                    </FButton>
                )}
                {extendSlot?.()}
                <FButton onClick={() => reset()} class="action-margin">
                    重置
                </FButton>
            </FFormItem>
        );
    },
    insertActionRender({ handle, reset, extendSlot }) {
        return (
            <FFormItem class="fesd-form-item-action" label=" ">
                <FButton type="primary" class="action-margin" onClick={() => handle()}>
                    保存
                </FButton>
                {extendSlot?.()}
                <FButton onClick={() => reset()} class="action-margin">
                    重置
                </FButton>
            </FFormItem>
        );
    },
    defineTableColumn(field, options) {
        if (!field) return {};
        let customRenderFunc;
        if (options) {
            customRenderFunc = (record) => {
                const opts = unref(options);
                const list = Array.isArray(record.cellValue) ? [...record.cellValue] : typeof record.cellValue === 'string' ? record.cellValue.split(',') : [record.cellValue];
                return list.map((key) => opts.find((item) => key === item.value)?.label || key).join('、');
            };
        }
        if (/date/i.test(field.type)) {
            customRenderFunc = (record) => {
                const format = field.dateFormate || (/time/i.test(field.type) ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
                const text = record.cellValue;
                if (Array.isArray(text)) {
                    return `${text[0] ? moment(text[0]).format(format) : ''} - ${text[1] ? moment(text[1]).format(format) : ''}`;
                }
                if (field.type === 'dates' || field.type === 'dateTimes') {
                    const start = record.row[`${field.name}Start`];
                    const end = record.row[`${field.name}End`];
                    return `${start ? moment(start).format(format) : ''} - ${end ? moment(end).format(format) : ''}`;
                }
                if (!text) return text;
                return moment(text).format(format);
            };
        }
        return {
            prop: field.name,
            label: field.label,
            customRender: customRenderFunc,
            slots: { customRender: `table_${field.name}`, header: `table_${field.name}_header` },
            ...field.props,
        };
    },
    tableRender(slots, { tableModel, columns, pagerModel, rowKey, pagerProps, tableProps }) {
        return (
            <>
                <FTable
                    // columns={columns}
                    {...tableProps}
                    rowKey={rowKey}
                    data={tableModel.value}
                    v-slots={slots}
                >
                    {columns.map((col) => {
                        const colSlot = {
                            default: null,
                            header: null,
                        };
                        const defaultKey = col.slots.customRender;
                        const headerKey = col.slots.header;
                        if (slots[defaultKey] || col.customRender) {
                            colSlot.default = (record) => {
                                if (slots[defaultKey]) {
                                    return slots[defaultKey](record);
                                } else if (col.customRender) {
                                    return col.customRender(record);
                                }
                            };
                        }
                        if (slots[headerKey]) {
                            colSlot.header = ({ column, columnIndex }) => {
                                if (slots[headerKey]) {
                                    return slots[headerKey]({ column, columnIndex });
                                } else {
                                    return column?.props?.label;
                                }
                            };
                        }
                        return <FTableColumn {...col} ellipsis v-slots={colSlot}></FTableColumn>;
                    })}
                </FTable>
                <div class="fesd-koala-pagination">
                    <FPagination
                        {...pagerProps}
                        v-model={[pagerModel.current, 'currentPage']}
                        pageSize={pagerModel.pageSize}
                        totalCount={pagerModel.total}
                        onChange={pagerModel.onChange}
                    ></FPagination>
                </div>
            </>
        );
    },
    tableActionsRender({ openUpdateModal, openViewModal, openDeleteModal, record }, extendSlot) {
        return (
            <>
                {openUpdateModal && (
                    <FButton type="link" onClick={() => openUpdateModal(record?.row)}>
                        更新
                    </FButton>
                )}
                {openViewModal && (
                    <FButton type="link" onClick={() => openViewModal(record?.row)}>
                        详情
                    </FButton>
                )}
                {openDeleteModal && (
                    <FButton type="link" onClick={() => openDeleteModal(record?.row)}>
                        删除
                    </FButton>
                )}
                {extendSlot()}
            </>
        );
    },
    modalRender(defaultSlot, { modalModel, onOk, onCancel }) {
        return (
            <FModal
                show={modalModel.visible}
                title={modalModel.title}
                displayDirective="if"
                okText={modalModel.okText || undefined}
                cancelText={modalModel.cancelText || undefined}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
            >
                {defaultSlot()}
            </FModal>
        );
    },
    pageRender(defaultSlot) {
        return (
            <FConfigProvider>
                <div class="fesd-koala-page">{defaultSlot()}</div>
            </FConfigProvider>
        );
    },
    message: FMessage,
    confirm(params) {
        FModal.confirm(params);
    },
});

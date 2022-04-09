import {
    FButton,
    FInputNumber,
    FTable,
    FInput,
    FSelect,
    FDatePicker,
    FRadio,
    FCheckbox,
    FForm,
    FFormItem,
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
    FDrawer,
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
    buttonRender(params, slots) {
        return params.show ? (
            <FButton class="action-margin" {...params}>
                {slots?.default ? slots.default() : params.text}
            </FButton>
        ) : null;
    },
    formItemFieldRender({ model, disabled, props, options, field }) {
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
            case 'text':
                body = model[field.name];
                break;
            default:
                body = <FInput {...prop} v-model={model[field.name]} />;
        }
        return body;
    },
    formItemRender({ field }, slots) {
        if (!field) return;
        const label = field.label ? field.label + ':' : undefined;
        return (
            <FGridItem span={field.span || 24}>
                <FFormItem label={label} prop={field.name}>
                    {slots.default()}
                </FFormItem>
            </FGridItem>
        );
    },
    formRender({ model, formRef, rules, type, props }, slots) {
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
                rules={rules}
                {...props}
            >
                <FGrid wrap> {slots.default()} </FGrid>
            </FForm>
        );
    },
    formReset(formRef) {
        formRef.value?.resetFields();
    },
    formValidate(formRef) {
        return formRef.value?.validate();
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
    tableRender({ tableDataRef, columns, pagerModel, rowKey, pagerProps, tableProps, pagerRef, tableRef }, slots) {
        return (
            <>
                <FTable
                    // columns={columns}
                    ref={tableRef}
                    rowKey={rowKey}
                    data={tableDataRef.value}
                    v-slots={slots}
                    {...tableProps}
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
                {pagerModel.show && (
                    <div class="fesd-koala-pagination">
                        <FPagination
                            ref={pagerRef}
                            v-model={[pagerModel.current, 'currentPage']}
                            pageSize={pagerModel.pageSize}
                            totalCount={pagerModel.total}
                            onChange={pagerModel.onChange}
                            onPageSizeChange={pagerModel.onPageSizeChange}
                            {...pagerProps}
                        ></FPagination>
                    </div>
                )}
            </>
        );
    },
    tableActionsRender({ openUpdateModal, openViewModal, openDeleteModal, record, config }, extendSlot) {
        const updateBtn = config?.update.btn || {};
        const deleteBtn = config?.delete.btn || {};
        const viewBtn = config?.view.btn || {};
        return (
            <>
                {openUpdateModal && (
                    <FButton type="link" onClick={() => openUpdateModal(record?.row)} {...updateBtn}>
                        {updateBtn.text}
                    </FButton>
                )}
                {openViewModal && (
                    <FButton type="link" onClick={() => openViewModal(record?.row)} {...viewBtn}>
                        {viewBtn.text}
                    </FButton>
                )}
                {openDeleteModal && (
                    <FButton type="link" onClick={() => openDeleteModal(record?.row)} {...deleteBtn}>
                        {deleteBtn.text}
                    </FButton>
                )}
                {extendSlot()}
            </>
        );
    },
    modalRender({ modalModel, onOk, onCancel, modalProps }, slots) {
        return (
            <FModal
                show={modalModel.visible}
                title={modalModel.title}
                displayDirective="if"
                okText={modalModel.okText || undefined}
                cancelText={modalModel.cancelText || undefined}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
                v-slots={slots}
                {...modalProps}
            />
        );
    },
    drawerRender({ modalModel, onOk, onCancel, modalProps }, slots) {
        return (
            <FDrawer
                show={modalModel.visible}
                title={modalModel.title}
                displayDirective="if"
                okText={modalModel.okText || undefined}
                cancelText={modalModel.cancelText || undefined}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
                footer={true}
                v-slots={slots}
                {...modalProps}
            />
        );
    },
    pageRender(params, slots) {
        return <div class="fesd-koala-page">{slots?.default?.()}</div>;
    },
    message: FMessage,
    confirm(params) {
        FModal.confirm(params);
    },
});

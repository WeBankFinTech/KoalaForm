import {
    Button,
    DatePicker,
    Form,
    FormItem,
    Input,
    InputNumber,
    message,
    Modal,
    RangePicker,
    Select,
    Table,
    ConfigProvider,
    Switch,
    CheckboxGroup,
    RadioGroup,
    TimePicker,
    Textarea,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { unref } from 'vue';
import { definePreset } from '@koala-form/core';
import moment from 'moment';
import './index.css';

export default definePreset({
    formatToEdit(data, field) {
        const value = data[field.name];
        switch (field.type) {
            case 'date':
            case 'dateTime':
                if (value) data[field.name] = moment(value);
                break;
            case 'dates':
            case 'dateTimes':
                if (!data[field.name]) data[field.name] = [];
                const start = data[`${field.name}Start`];
                const end = data[`${field.name}End`];
                if (start) {
                    data[field.name][0] = moment(start);
                }
                if (end) {
                    data[field.name][1] = moment(end);
                }
                break;
            case 'time':
                if (value) data[field.name] = moment(value, 'HH:mm:SS');
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
        const prop = {
            disabled,
            options: unref(options),
            ...props,
        };
        switch (field.type) {
            case 'number':
                body = <InputNumber {...prop} v-model={[model[field.name], 'value']} />;
                break;
            case 'date':
                body = <DatePicker {...prop} v-model={[model[field.name], 'value']} />;
                break;
            case 'select':
                body = <Select {...prop} v-model={[model[field.name], 'value']} />;
                break;
            case 'switch':
                body = <Switch {...prop} v-model={[model[field.name], 'checked']} />;
                break;
            case 'time':
                body = <TimePicker {...prop} v-model={[model[field.name], 'value']} />;
                break;
            case 'date':
            case 'dateTime':
                body = <DatePicker {...prop} showTime={field.type === 'dateTime'} v-model={[model[field.name], 'value']} />;
                break;
            case 'dates':
            case 'dateTimes':
                body = <RangePicker {...prop} showTime={field.type === 'dateTimes'} v-model={[model[field.name], 'value']} />;
                break;
            case 'checkbox':
                body = <CheckboxGroup {...prop} v-model={[model[field.name], 'value']} />;
                break;
            case 'radio':
                body = <RadioGroup {...prop} v-model={[model[field.name], 'value']} />;
                break;
            default:
                if (prop.type === 'textarea') {
                    body = <Textarea {...prop} v-model={[model[field.name], 'value']} />;
                } else {
                    body = <Input {...prop} v-model={[model[field.name], 'value']} />;
                }
        }
        return body;
    },
    formItemRender(field, defaultSlot) {
        if (!field || typeof defaultSlot !== 'function') return;
        return (
            <FormItem label={field.label} name={field.name}>
                {defaultSlot()}
            </FormItem>
        );
    },
    formRender(defaultSlot, { model, formRef, rulesRef, type } = { type: 'query' }) {
        const labelColSpan = type === 'query' ? 8 : 5;
        // return (
        //     <Form
        //         wrapperCol={{ span: 24 - labelColSpan }}
        //         labelCol={{ span: labelColSpan }}
        //         class={{
        //             'ant-koala-form': true,
        //             'ant-koala-form-query': type === 'query',
        //         }}
        //         ref={formRef}
        //         model={model}
        //         rules={rulesRef}
        //     >
        //         {defaultSlot?.()}
        //     </Form>
        // );
    },
    formReset(formRef) {
        formRef.value?.resetFields();
    },
    formValidate(formRef) {
        return formRef.value?.validate();
    },
    queryActionRender({ handle, reset, extendSlot, extendRef }) {
        return (
            <FormItem class="ant-form-item-action" wrapperCol={{ span: 24 }} labelCol={{ span: 0 }}>
                <Button type="primary" class="action-margin" onClick={() => handle()}>
                    查询
                </Button>
                {extendRef?.openInsertModal && (
                    <Button type="primary" class="action-margin" onClick={() => extendRef.openInsertModal?.()}>
                        新增
                    </Button>
                )}
                {extendSlot?.()}
                <Button onClick={() => reset()} class="action-margin">
                    重置
                </Button>
            </FormItem>
        );
    },
    defineTableColumn(field, options) {
        if (!field) return {};
        let customRenderFunc;
        if (options) {
            customRenderFunc = (record) => {
                const opts = unref(options);
                const list = Array.isArray(record.text) ? [...record.text] : typeof record.text === 'string' ? record.text.split(',') : [record.text];
                return list.map((key) => opts.find((item) => key === item.value)?.label || key).join('、');
            };
        }
        if (/date/i.test(field.type)) {
            customRenderFunc = (record) => {
                const format = field.dateFormate || (/time/i.test(field.type) ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
                const text = record.text;
                if (Array.isArray(text)) {
                    return `${text[0] ? moment(text[0]).format(format) : ''} - ${text[1] ? moment(text[1]).format(format) : ''}`;
                }
                if (field.type === 'dates' || field.type === 'dateTimes') {
                    const start = record.record[`${field.name}Start`];
                    const end = record.record[`${field.name}End`];
                    return `${start ? moment(start).format(format) : ''} - ${end ? moment(end).format(format) : ''}`;
                }
                if (!text) return text;
                return moment(text).format(format);
            };
        }
        return {
            dataIndex: field.name,
            key: field.name,
            title: field.label,
            customRender: customRenderFunc,
            slots: { customRender: `table_${field.name}`, title: `table_${field.name}_header` },
        };
    },
    tableRender(slots, { tableModel, columns, pagerModel, rowKey }) {
        return <Table columns={columns} rowKey={rowKey} dataSource={tableModel.value} pagination={pagerModel} v-slots={slots}></Table>;
    },
    tableActionsRender({ openDeleteModal, openUpdateModal, openViewModal, record }) {
        return (
            <>
                {openUpdateModal && (
                    <Button type="link" onClick={() => openUpdateModal(record.record)}>
                        更新
                    </Button>
                )}
                {openViewModal && (
                    <Button type="link" onClick={() => openViewModal(record.record)}>
                        详情
                    </Button>
                )}
                {openDeleteModal && (
                    <Button type="link" onClick={() => openDeleteModal(record.record)}>
                        删除
                    </Button>
                )}
            </>
        );
    },
    modalRender(slot, { modalModel, onOk, onCancel }) {
        return (
            <Modal
                visible={modalModel.visible}
                title={modalModel.title}
                okText={modalModel.okText}
                cancelText={modalModel.cancelText}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
            >
                {slot()}
            </Modal>
        );
    },
    pageRender(slot) {
        return (
            <ConfigProvider locale={zhCN}>
                <div class="ant-koala-page">{slot()}</div>
            </ConfigProvider>
        );
    },
    message: message,
    confirm(params) {
        Modal.confirm(params);
    },
});

import { Config } from './config';
import { Field, travelFields } from './field';
import useFormAction from './useFormAction';
import { VNodeChild, Slots, reactive, VNode, watch, Slot } from 'vue';
import { ACTION_TYPES } from './const';
import { _preset } from './preset';
import { merge, isFunction } from 'lodash-es';

export default function useModal(fields: Array<Field>, config: Config, type: ACTION_TYPES, handleQuery?: Function) {
    const { formatToEdit, confirm, modalRender, drawerRender } = _preset;
    let hasFirstRender = false; // 是否已经首次渲染过
    const modalModel = reactive({
        visible: false,
        title: '',
        okText: '',
        cancelText: '',
    });

    const modalProps: Record<string, any> = reactive({});
    const { form, reset, handle, respModel, render: formActionRender } = useFormAction(fields, config, type);

    const open = async (data?: Record<string, any>) => {
        const model = merge({}, data);
        if (isFunction(formatToEdit)) {
            travelFields(fields, type, (field) => formatToEdit(model, field));
        }
        switch (type) {
            case 'insert':
                form.initFields(model);
                break;
            case 'update':
            case 'view':
                reset();
                form.setFields(model);
                break;
        }
        modalModel.title = `${config.name || ''}${config[type]?.btn?.text}`;
        modalModel.visible = true;
        if (type === 'delete') {
            confirm?.({
                title: modalModel.title,
                content: config[type]?.getMessage?.(model || {}),
                onOk() {
                    handle(data);
                },
            });
        }
    };

    const handleCancel = () => {
        modalModel.visible = false;
    };

    const handleOk = () => {
        if (type === 'view') {
            handleCancel();
        } else {
            handle();
        }
    };

    const setModalProps = (value: Record<string, any>) => {
        if (!value) return;
        Object.assign(modalProps, value);
    };

    watch(respModel, (resp) => {
        if (resp) {
            handleCancel();
            config[type]?.['queryAfterSuccess'] && handleQuery?.();
        }
    });

    const render = (slots: Slots): VNodeChild => {
        if (!hasFirstRender && !modalModel.visible) return [];
        hasFirstRender = true;
        const slot = () => {
            const newSlots = { ...slots };
            if (!newSlots.extend_items) {
                // 避免使用preset的actions渲染
                newSlots.extend_items = () => [];
            }
            delete newSlots[`${type}_action`];
            return formActionRender(newSlots) as VNode[];
        };
        const typeActionSlot = slots[`${type}_action`] as Slot;
        const param = {
            modalModel,
            modalProps,
            onOk: handleOk,
            onCancel: handleCancel,
        };
        const footerSlot = isFunction(typeActionSlot) ? () => typeActionSlot(param) : undefined;
        switch (config.modalMode) {
            case 'drawer':
                return drawerRender?.(slot, param, footerSlot);
            default:
                return modalRender?.(slot, param, footerSlot);
        }
    };

    return {
        form,
        modalModel,
        modalProps,
        setModalProps,
        handleCancel,
        handleOk,
        open,
        render,
    };
}

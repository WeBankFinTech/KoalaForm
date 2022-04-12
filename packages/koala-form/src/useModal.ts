import { Config } from './config';
import { Field, travelFields } from './field';
import useFormAction from './useFormAction';
import { reactive, VNode, watch, Slot } from 'vue';
import { ACTION_TYPES } from './const';
import { _preset } from './preset';
import { merge, isFunction } from 'lodash-es';
import { ReactiveModel, KoalaFormRenderFunction, UseModalResult } from './types';

export default function useModal(fields: Array<Field>, config: Config, type: ACTION_TYPES, handleQuery?: Function): UseModalResult {
    const { formatToEdit, confirm, modalRender, drawerRender } = _preset;
    let hasFirstRender = false; // 是否已经首次渲染过
    const modalModel: ReactiveModel = reactive({
        visible: false,
        title: '',
        okText: '',
        cancelText: '',
    });

    const modalProps: Record<string, any> = reactive({});
    const formAction = useFormAction(fields, config, type);

    const open = async (data?: Record<string, any>) => {
        const model = merge({}, data);
        if (isFunction(formatToEdit)) {
            travelFields(fields, type, (field) => formatToEdit(model, field));
        }
        switch (type) {
            case 'insert':
                formAction.form.initFields(model);
                break;
            case 'update':
            case 'view':
                formAction.handleReset();
                formAction.form.setFields(model);
                break;
        }
        modalModel.title = `${config.name || ''}${config[type]?.btn?.text}`;
        modalModel.visible = true;
        if (type === 'delete') {
            confirm?.({
                title: modalModel.title,
                content: config[type]?.getMessage?.(model || {}),
                onOk() {
                    formAction.handleAction(data);
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
            formAction.handleAction();
        }
    };

    const setModalProps = (value?: Record<string, any>) => {
        if (!value) return;
        Object.assign(modalProps, value);
    };

    watch(formAction.actionRespRef, (resp) => {
        if (resp) {
            handleCancel();
            config[type]?.['queryAfterSuccess'] && handleQuery?.();
        }
    });

    const render: KoalaFormRenderFunction = (slots) => {
        if (!hasFirstRender && !modalModel.visible) return [];
        const typeActionSlot = slots[`${type}_action`] as Slot;
        hasFirstRender = true;
        const param = {
            modalModel,
            modalProps,
            onOk: handleOk,
            onCancel: handleCancel,
        };
        const modelSlots = {
            default() {
                const newSlots = { ...slots };
                if (!newSlots.extend_items) {
                    // 避免使用preset的actions渲染
                    newSlots.extend_items = () => [];
                }
                delete newSlots[`${type}_action`];
                return formAction.render(newSlots) as VNode[];
            },
            footer: isFunction(typeActionSlot) ? () => typeActionSlot(param) : undefined,
        };
        switch (config.modalMode) {
            case 'drawer':
                return drawerRender(param, modelSlots);
            default:
                return modalRender(param, modelSlots);
        }
    };

    return {
        form: formAction.form,
        formAction,
        modalModel,
        modalProps,
        open,
        render,
        handleOk,
        handleCancel,
        setModalProps,
    };
}

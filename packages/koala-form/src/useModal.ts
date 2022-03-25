import { Config } from './config';
import { Field, travelFields } from './field';
import useFormAction from './useFormAction';
import { VNodeChild, Slots, reactive, VNode, watch } from 'vue';
import { ACTION_TYPES, ACTION } from './const';
import { _preset } from './preset';
import { merge, isFunction } from 'lodash-es';

export default function useModal(fields: Array<Field>, config: Config, type: ACTION_TYPES, handleQuery?: Function) {
    const { formatToEdit, confirm, modalRender } = _preset;
    const modalModel = reactive({
        visible: false,
        title: '',
        okText: '',
        cancelText: '',
    });

    const modalProps: Record<string, any> = reactive({});
    const { form, reset, handle, respModel, render: formActionRender  } = useFormAction(fields, config, type);

    const open = async (data?: Record<string, any>) => {
        const model = merge({}, data);
        if (isFunction(formatToEdit)) {
            travelFields(fields, type, field => formatToEdit(model, field))
        }
        switch (type) {
            case 'insert':
            case 'update':
            case 'view':
                reset();
                form.initFields(model);
                break;
        }
        modalModel.title = `${config.name || ''}${ACTION[type].label}`;
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
    }

    watch(respModel, (resp) => {
        if (resp) {
            handleCancel();
            config[type]?.['queryAfterSuccess'] && handleQuery?.();
        }
    });

    const render = (slots: Slots): VNodeChild => {
        const slot = () => {
            return formActionRender(slots) as VNode[];
        };
        return modalRender?.(slot, {
            modalModel,
            modalProps,
            onOk: handleOk,
            onCancel: handleCancel,
        });
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

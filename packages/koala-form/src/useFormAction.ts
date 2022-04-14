import { merge, isUndefined } from 'lodash-es';
import { VNode, ref, Slot, onMounted, Ref } from 'vue';
import useForm from './useForm';
import { Config } from './config';
import { isFunction } from './utils';
import { Field, travelFields } from './field';
import { ACTION_TYPES } from './const';
import { _preset as preset } from './preset';
import { HandleActionFunction, KoalaFormRenderFunction, UseFormActionResult, TypeActionRenderFunction } from './types';
import { BtnProps } from '.';

export default function useFormAction(fields: Array<Field>, config: Config, type: ACTION_TYPES): UseFormActionResult {
    const form = useForm(fields, type);
    const actionRespRef: Ref<Record<string, any> | null> = ref({});
    const actionErrorRef: Ref<Record<string, any> | null> = ref(null);

    const handleAction: HandleActionFunction = async (extend, currentPage) => {
        const cfg = config[type];
        if (!cfg?.api) {
            throw new Error(`${type} api is need!`);
        }
        try {
            actionRespRef.value = null;
            await form.validate();
            let params: Record<string, any> = {};
            merge(params, form.model, extend || {});
            if (type === 'query') {
                // 设置pager
                params.pager = { current: currentPage || 1 };
            }

            if (isFunction(preset.formatToReqParams)) {
                travelFields(fields, type, (field) => preset.formatToReqParams?.(params, field));
            }

            if (cfg.before) {
                params = await cfg.before(params);
            }
            let resp = await preset.request?.(cfg.api, params, {
                method: cfg.method,
            });
            resp = await cfg.success?.(resp);
            actionRespRef.value = resp || true;
            cfg.successTip && preset.message?.success?.(`${cfg.btn?.text}成功`, 3);
            return resp;
        } catch (error: any) {
            await cfg.error?.(error);
            if (!isUndefined(error.valid) && !error.valid && cfg['validMessage']) {
                preset.message?.warning?.(cfg['validMessage'], 3);
                console.error(error);
                return;
            }
            actionErrorRef.value = error;
            throw error;
        }
    };

    const handleReset = () => {
        form.resetFields();
        if (type === 'query' && config.query?.queryAfterReset) {
            handleAction();
        }
    };

    onMounted(() => {
        if (type === 'query' && config.query?.firstAutoQuery) {
            handleAction();
        }
    });

    const defaultTypeActionRender: TypeActionRenderFunction = (param, slots) => {
        const typeConfig = config[type];
        const actionBtnProps: BtnProps = {
            type: 'primary',
            onClick: () => param.handleAction(),
        };
        const btn: BtnProps = Object.assign(actionBtnProps, typeConfig?.btn);
        const saveBtn: BtnProps = Object.assign(actionBtnProps, typeConfig?.['saveBtn']);
        const resetBtn: BtnProps = Object.assign({ onClick: param.handleReset }, typeConfig?.['resetBtn']);

        const vNodes = [];
        if (type === 'query' && (typeConfig?.open || btn?.show)) {
            // 查询按钮
            vNodes.push(preset.buttonRender(btn));
        } else if (saveBtn?.show) {
            // 保存表单按钮
            vNodes.push(preset.buttonRender(saveBtn));
        }
        if (slots?.extendAction) {
            // 扩展按钮
            vNodes.push(slots.extendAction());
        }
        if (resetBtn.show) {
            // 重置表单
            vNodes.push(preset.buttonRender(resetBtn));
        }
        return vNodes;
    };

    /**
     * - slots.[type]Action 自定义动作
     * - slots.[type]ActionExtend 基于preset的自定义动作的扩展
     * @param slots
     * @returns
     */
    const render: KoalaFormRenderFunction = (slots) => {
        const params = { handleAction, handleReset, formModel: form.model };
        const newSlots = { ...slots };
        const typeActionsSlot = slots[`${type}_action`] as Slot; // 覆盖preset的typeActionRender
        const typeActionsExtendSlot = slots[`${type}_action_extend`] as Slot; // 在typeActionRender中扩展
        const extendItems = slots.extend_items as Slot;
        const typeExtendItems = slots[`${type}_extend_items`] as Slot;

        if (isFunction(typeActionsExtendSlot)) {
            // 存在动作类型的扩展按钮自定义Slot时，将自定义的插入到默认渲染按钮中
            newSlots[`${type}_extend_items`] = () => {
                let vNodes: VNode[] = [];
                if (isFunction(typeExtendItems)) {
                    vNodes = vNodes.concat(typeExtendItems({ model: form.model }));
                } else if (isFunction(extendItems)) {
                    vNodes = vNodes.concat(extendItems({ model: form.model, type }));
                }
                const extendAction = () => typeActionsExtendSlot(params);
                vNodes = vNodes.concat(defaultTypeActionRender(params, { extendAction }) as VNode);
                return vNodes;
            };
        }

        if (isFunction(typeActionsSlot)) {
            // 存在动作类型的所有按钮自定义Slot时，将覆盖默认的按钮实现
            newSlots.extend_items = () => {
                let vNodes: VNode[] = [];
                if (isFunction(typeExtendItems)) {
                    vNodes = vNodes.concat(typeExtendItems({ model: form.model }));
                } else if (isFunction(extendItems)) {
                    vNodes = vNodes.concat(extendItems({ model: form.model, type }));
                }
                vNodes = vNodes.concat(typeActionsSlot(params));
                return vNodes;
            };
            delete newSlots[`${type}_extend_items`];
        }

        if (!newSlots.extend_items) {
            // 没有扩展表单项时，默认加入动作按钮的渲染
            newSlots.extend_items = () => defaultTypeActionRender(params) as VNode[];
        }

        return form.render(newSlots);
    };

    return {
        respModel: actionRespRef,
        errorRef: actionErrorRef,
        form,
        actionRespRef,
        actionErrorRef,
        handleAction,
        handleReset,
        render,
    };
}

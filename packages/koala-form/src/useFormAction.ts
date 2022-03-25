import useForm from './useForm';
import { Config } from './config';
import { Field } from './field';
import { Slots, VNodeChild, VNode, ref, Slot, onMounted, Ref, reactive } from 'vue';
import { _preset, Preset } from './preset';
import { ACTION, ACTION_TYPES, Pager } from './const';
import { isFunction } from './utils';
import { merge, isUndefined } from 'lodash-es';
import { travelFields } from '.';

export default function useFormAction(fields: Array<Field>, config: Config, type: ACTION_TYPES) {
    const form = useForm(fields, type);

    const respModel: Ref<Record<string, any> | null> = ref({});
    const errorRef = ref(null);
    const extendRef: {
        pagerModel?: Pager;
        openInsertModal?(data?: Record<string, any>): Promise<void>;
    } = reactive({});

    const handle = async (extend?: Record<string, any>, currentPage?: number) => {
        const cfg = config[type];
        if (!cfg?.api) {
            throw new Error(`${type} api is need!`);
        }
        try {
            respModel.value = null;
            await form.validate();
            let params: Record<string, any> = {};
            merge(params, form.model, extend || {});
            if (type === 'query' && extendRef.pagerModel) {
                extendRef.pagerModel.current = currentPage || 1;
                params.pager = {
                    current: extendRef.pagerModel.current,
                    pageSize: extendRef.pagerModel.pageSize,
                };
            }

            if (isFunction(_preset.formatToReqParams)) {
                travelFields(fields, type, (field) => _preset.formatToReqParams?.(params, field));
            }

            if (cfg.before) {
                params = await cfg.before(params);
            }
            let resp = await _preset.request?.(cfg.api, params, {
                method: cfg.method,
            });
            resp = await cfg.success?.(resp);
            respModel.value = resp || true;
            cfg.successTip && _preset.message?.success?.(`${ACTION[type].label}成功`, 3);
            return resp;
        } catch (error: any) {
            await cfg.error?.(error);
            if (!isUndefined(error.valid) && !error.valid && cfg['validMessage']) {
                _preset.message?.warning?.(cfg['validMessage'], 3);
                console.error(error);
                return;
            }
            errorRef.value = error;
            throw error;
        }
    };

    const reset = () => {
        form.resetFields();
        if (type === 'query' && config.query?.queryAfterReset) {
            handle();
        }
    };

    onMounted(() => {
        if (type === 'query' && config.query?.firstAutoQuery) {
            handle();
        }
    });
    /**
     * - slots.[type]Action 自定义动作
     * - slots.[type]ActionExtend 基于preset的自定义动作的扩展
     * @param slots
     * @returns
     */
    const render = (slots: Slots): VNodeChild => {        
        const params = { handle, reset, extendRef };
        const newSlots = {...slots }
        const typeActionsSlot = slots[`${type}_action`] as Slot; // 覆盖preset的typeActionRender
        const typeActionsExtendSlot = slots[`${type}_action_extend`] as Slot; // 在typeActionRender中扩展
        const typeActionRender = _preset[`${type}ActionRender` as keyof Preset] as Function;
        const extendItems = slots.extend_items as Slot;
        const typeExtendItems = slots[`${type}_extend_items`] as Slot;

        if (isFunction(typeActionsExtendSlot)) {
            newSlots[`${type}_extend_items`] = () => {
                let vNodes: VNode[] = [];
                if (isFunction(typeExtendItems)) {
                    vNodes = vNodes.concat(typeExtendItems({model: form.model}))
                } else if (isFunction(extendItems)) {
                    vNodes = vNodes.concat(extendItems({model: form.model, type}))
                }
                if (isFunction(typeActionRender)) {
                    vNodes = vNodes.concat(typeActionRender({ ...params, extendSlot: () => typeActionsExtendSlot(params) }));
                }
                return vNodes;
            }
        }

        if (isFunction(typeActionsSlot)) { // 覆盖所有preset的actions实现
            newSlots.extend_items = () => {
                let vNodes: VNode[] = [];
                if (isFunction(typeExtendItems)) {
                    vNodes = vNodes.concat(typeExtendItems({model: form.model}))
                } else if (isFunction(extendItems)) {
                    vNodes = vNodes.concat(extendItems({model: form.model, type}))
                }
                vNodes = vNodes.concat(typeActionsSlot(params));
                return vNodes;
            }
            delete newSlots[`${type}_extend_items`]
        }
        return form.render(newSlots);
    };

    return {
        form,
        respModel,
        errorRef,
        extendRef,
        handle,
        render,
        reset,
    };
}

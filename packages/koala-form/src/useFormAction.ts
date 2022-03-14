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
        const formItems = () => {
            // 合并formItems slot
            let vNodes: VNode[] = [];
            if (slots.formItems) {
                vNodes = vNodes.concat(slots.formItems() as VNode[]);
            }
            const actionRender = _preset[`${type}ActionRender` as keyof Preset] as Function;
            const actionsSlot = slots[`${type}_action`] as Slot;
            const params = {
                handle,
                reset,
                extendRef,
            };
            if (isFunction(actionsSlot)) {
                vNodes = vNodes.concat(actionsSlot(params));
            } else if (isFunction(actionRender)) {
                vNodes = vNodes.concat(
                    actionRender({
                        ...params,
                        extendSlot: () => slots[`${type}_action_extend`]?.(params),
                    }),
                );
            }
            return vNodes;
        };
        return form.render({ ...slots, extend_items: formItems });
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

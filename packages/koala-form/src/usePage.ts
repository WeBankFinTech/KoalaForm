import { Config } from './config';
import { Field, travelFields } from './field';
import { VNodeChild, Slots, VNode, Slot } from 'vue';
import { _preset as preset } from './preset';
import useQuery from './useQuery';
import useModal from './useModal';
import { isFunction } from './utils';
import { ACTION_TYPES } from './const';
import { UsePageResult, UseModalResult, BtnProps } from './types';

export default function usePage(fields: Array<Field>, config: Config): UsePageResult {
    const needActionsCol = config.update?.open || config.view?.open || config.delete?.open;
    let newFieldList = [...fields];
    if (needActionsCol) {
        // 自动插入actions
        let notFound = true;
        travelFields(fields, 'table', (field) => {
            if (field.name === 'actions') notFound = false;
        });
        if (notFound) {
            newFieldList = [...fields, { name: 'actions', label: '操作', table: true }];
        }
    }

    const query = useQuery(newFieldList, config);

    const actions: {
        insert?: UseModalResult;
        update?: UseModalResult;
        view?: UseModalResult;
        delete?: UseModalResult;
    } = {};

    ['insert', 'update', 'view', 'delete'].forEach((key) => {
        if (config[key].open) {
            actions[key] = useModal(fields, config, key as ACTION_TYPES, query.formAction.handleAction);
        }
    });

    const defaultTableActionsRender = (row: Record<string, any>, slots: Slots) => {
        const vNodes = [];
        if (actions.update) {
            const props = {
                type: 'link',
                onClick: () => actions.update?.open(row),
                ...config.update?.btn,
            };
            vNodes.push(preset.buttonRender(props) as VNode);
        }
        if (actions.view) {
            const props = {
                type: 'link',
                onClick: () => actions.view?.open(row),
                ...config.view?.btn,
            };
            vNodes.push(preset.buttonRender(props) as VNode);
        }

        if (actions.delete) {
            const props = {
                type: 'link',
                onClick: () => actions.delete?.open(row),
                ...config.delete?.btn,
            };
            vNodes.push(preset.buttonRender(props) as VNode);
        }
        if (slots.extend) {
            vNodes.push(slots.extend());
        }
        return vNodes as VNode[];
    };

    const render = (slots: Slots): VNodeChild => {
        const tableActionsSlot: Slot = (record = {}) => {
            if (!record.row) {
                console.warn(`preset.tableRnder slot table_[name] params record.row is empty!`);
            }
            const params = {
                openUpdateModal: actions.update?.open,
                openViewModal: actions.view?.open,
                openDeleteModal: actions.delete?.open,
                record,
            };
            // table的操作列name === 'actions'时，定制全部行操作
            if (slots.table_actions && isFunction(slots.table_actions)) {
                return slots.table_actions(params);
            } else {
                // 列表操作列的其他扩展按钮
                const extendSlot = () => {
                    if (slots.table_actions_extend && isFunction(slots.table_actions_extend)) {
                        return slots.table_actions_extend(params) as VNode[];
                    } else return [];
                };
                return defaultTableActionsRender(record.row, { extend: extendSlot });
            }
        };

        const slot = () => {
            // 在查询区域扩展新增按钮
            let query_action_extend = slots.query_action_extend as Slot;
            if (actions.insert) {
                query_action_extend = (params): VNode[] => {
                    let vNodes: VNode[] = [];
                    const insertBtnProps: BtnProps = {
                        type: 'primary',
                        onClick: () => actions.insert?.open(),
                        ...config.insert?.btn,
                    };
                    vNodes.push(preset.buttonRender(insertBtnProps) as VNode);
                    if (slots.query_action_extend) {
                        vNodes = vNodes.concat((slots.query_action_extend as Slot)(params));
                    }
                    return vNodes;
                };
            }
            return [
                query.render({ ...slots, query_action_extend, table_actions: tableActionsSlot }),
                actions.insert?.render(slots),
                actions.update?.render(slots),
                actions.view?.render(slots),
            ] as VNode[];
        };

        return preset.pageRender({}, { default: slot });
    };

    return {
        ...actions,
        actions,
        query,
        render,
    };
}

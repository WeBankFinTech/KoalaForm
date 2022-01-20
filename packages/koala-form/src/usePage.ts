import { Config } from './config';
import { Field, travelFields } from './field';
import { VNodeChild, Slots, VNode, Slot } from 'vue';
import { _preset } from './preset';
import useQuery from './useQuery';
import useModal from './useModal';
import { isFunction } from './utils';
import { ACTION_TYPES } from './const';

export default function usePage(fields: Array<Field>, config: Config) {
    const needActionsCol = config.update?.open || config.view?.open || config.delete?.open;
    let newMetaList = [...fields];
    if (needActionsCol) { // 自动插入actions
        let notFound = true;
        travelFields(fields, 'table', field => {
            if (field.name === 'actions') notFound = false
        })
        if (notFound) {
            newMetaList = [...fields, { name: 'actions', label: '操作', table: true }];
        }
    }

    const query = useQuery(newMetaList, config);

    const actions: {
        insert?: any;
        update?: any;
        view?: any;
        delete?: any;
    } = {};

    ['insert', 'update', 'view', 'delete'].forEach((key) => {
        if (config[key].open) {
            actions[key] = useModal(fields, config, key as ACTION_TYPES, query.query.handle);
        }
    });

    query.query.extendRef.openInsertModal = actions.insert?.open;

    const render = (slots: Slots): VNodeChild => {
        const tableActionsSlot: Slot = (record) => {
            const params = {
                openUpdateModal: actions.update?.open,
                openViewModal: actions.view?.open,
                openDeleteModal: actions.delete?.open,
                record,
            };
            if (slots.table_actions && isFunction(slots.table_actions)) {
                return slots.table_actions(params);
            } else {
                return _preset.tableActionsRender?.(params) as VNode[];
            }
        };

        const slot = () => {
            return [
                query.render({ ...slots, table_actions: tableActionsSlot }),
                actions.insert?.render(slots),
                actions.update?.render(slots),
                actions.view?.render(slots),
            ] as VNode[];
        };

        return _preset.pageRender?.(slot);
    };

    return {
        actions,
        render,
    };
}

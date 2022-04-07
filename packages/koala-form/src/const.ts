export const ACTION = {
    query: {
        key: 'query',
        label: '查询',
        metaKey: 'QUERY',
    },
    insert: {
        key: 'insert',
        label: '新增',
        metaKey: 'INSERT',
    },
    update: {
        key: 'update',
        label: '更新',
        metaKey: 'UPDATE',
    },
    delete: {
        key: 'delete',
        label: '删除',
        metaKey: 'DELETE',
    },
    view: {
        key: 'view',
        label: '详情',
        metaKey: 'VIEW',
    },
};

export type ACTION_TYPES = keyof typeof ACTION;

export interface Pager {
    current?: number;
    pageSize: number;
    total: number;
    onChange?(current: number): void;
    onPageSizeChange?(size: number): void;
    show: Boolean;
}

export const DEFAULT_PAGER: Pager = {
    pageSize: 10,
    current: 1,
    total: 0,
    show: true,
};

import { useSceneContext, useTableWithPager } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const {
            ctxs: [table, pager],
        } = useSceneContext(['table', 'pager']);

        const names = ['蒙奇·D·路飞', '罗罗诺亚·索隆', '山治'];
        const doQuery = () => {
            dataSource.value = [];
            const { pageSize, totalCount, currentPage } = pager.model;
            const len =
                Math.ceil(totalCount / pageSize) === currentPage
                    ? totalCount - (currentPage - 1) * pageSize
                    : pageSize;
            for (let index = 1; index <= len; index++) {
                dataSource.value.push({
                    id: index,
                    name: names[parseInt(Math.random() * 10) % 3],
                });
            }
        };

        const { render, dataSource } = useTableWithPager(
            {
                ctx: table,
                fields: [
                    {
                        name: 'id',
                        label: 'ID',
                    },
                    {
                        name: 'name',
                        label: '姓名',
                    },
                ],
            },
            {
                ctx: pager,
                pager: {
                    events: {
                        onChange: doQuery,
                    },
                },
            },
        );

        pager.model.pageSize = 5;
        pager.model.currentPage = 1;
        pager.model.totalCount = 32;

        doQuery();

        return render;
    },
});

import { useSceneContext, useTableWithPager } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const {
            ctxs: [table, pager],
        } = useSceneContext(['table', 'pager']);
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
            },
        );

        pager.modelRef.value.pageSize = 5;
        const names = ['蒙奇·D·路飞', '罗罗诺亚·索隆', '山治'];
        for (let index = 1; index <= 22; index++) {
            dataSource.value.push({
                id: index,
                name: names[parseInt(Math.random() * 10) % 3],
            });
        }
        return render;
    },
});

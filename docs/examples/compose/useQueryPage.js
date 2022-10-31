import { useSceneContext, useQueryPage, ComponentType } from '@koala-form/core';
import { defineComponent } from 'vue';
import { LIST_API } from '../const';

export default defineComponent({
    setup() {
        const {
            ctxs: [query, table, pager],
        } = useSceneContext(['query', 'table', 'pager']);
        const { render } = useQueryPage({
            api: LIST_API,
            query: {
                ctx: query,
                fields: [
                    {
                        name: 'name',
                        label: '姓名',
                        components: {
                            name: ComponentType.Input,
                        },
                    },
                ],
            },
            table: {
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
            pager: { ctx: pager },
        });

        // pager.model.pageSize = 5;
        // const names = ['蒙奇·D·路飞', '罗罗诺亚·索隆', '山治'];
        // for (let index = 1; index <= 22; index++) {
        //     dataSource.value.push({
        //         id: index,
        //         name: names[parseInt(Math.random() * 10) % 3],
        //     });
        // }
        return render;
    },
});

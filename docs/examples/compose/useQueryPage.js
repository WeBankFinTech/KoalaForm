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
        return render;
    },
});

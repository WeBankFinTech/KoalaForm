import { FMessage } from '@fesjs/fes-design';
import { useTable } from '@koala-form/core';
import { ComponentType, useSceneContext } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctxs } = useSceneContext(['table']);
        const { render, model } = useTable({
            ctx: ctxs[0],
            fields: [
                {
                    name: 'name',
                    label: '姓名',
                },
                {
                    name: 'sex',
                    label: '性别',
                    options: [
                        { value: '0', label: '女' },
                        { value: '1', label: '男' },
                    ],
                },
                {
                    name: 'age',
                    label: '年龄',
                },
                {
                    label: '操作',
                    props: { width: 200 },
                    components: {
                        name: ComponentType.Button,
                        children: ['详情'],
                        props: { type: 'link' },
                        events: {
                            onClick: (cxt, record, event) => {
                                FMessage.success(record.row.name);
                                console.log(cxt, record, event);
                            },
                        },
                    },
                },
            ],
        });

        model.value = [
            { name: '蒙奇·D·路飞', sex: '1', age: 16 },
            { name: '罗罗诺亚·索隆', sex: '1', age: 18 },
        ];
        return render;
    },
});

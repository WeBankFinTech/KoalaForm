import { FMessage } from '@fesjs/fes-design';
import { ComponentType, formatByOptions, useTable, genFormatByDate } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { render, modelRef } = useTable({
            fields: [
                {
                    name: 'name', // 每行数据取值的key
                    label: '姓名', // 行标题
                },
                {
                    name: 'sex',
                    label: '性别',
                    options: [
                        // 枚举映射
                        { value: '0', label: '女' },
                        { value: '1', label: '男' },
                    ],
                    format: formatByOptions, // 格式化展示值
                },
                {
                    name: 'age',
                    label: '年龄',
                },
                {
                    name: 'birthday',
                    label: '生日',
                    format: genFormatByDate(),
                },
                {
                    label: '操作',
                    props: { width: 100 },
                    components: {
                        name: ComponentType.Button,
                        children: ['详情'],
                        props: { type: 'link' },
                        events: {
                            onClick: (record, event) => {
                                // record只有在useTable下才会存在
                                FMessage.success(record.row.name);
                                console.log(record, event);
                            },
                        },
                    },
                },
            ],
        });

        modelRef.value = [
            { name: '蒙奇·D·路飞', sex: '1', age: 16, birthday: '2022-02-12' },
            {
                name: '罗罗诺亚·索隆',
                sex: '1',
                age: 18,
                birthday: Date.now() + '',
            },
        ];
        return render;
    },
});

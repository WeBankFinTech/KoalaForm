import {
    ComponentType,
    useForm,
    useSceneContext,
    hResetFields,
} from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        const { render } = useForm({
            ctx,
            form: { props: { labelWidth: '40px' } },
            fields: [
                {
                    name: 'name',
                    label: '姓名',
                    defaultValue: '蒙奇·D·路飞',
                    components: {
                        name: ComponentType.Input,
                    },
                },
                {
                    name: 'sex',
                    label: '性别',
                    defaultValue: '1',
                    options: [
                        { value: '0', label: '女' },
                        { value: '1', label: '男' },
                    ],
                    components: {
                        name: ComponentType.Select,
                    },
                },
                {
                    name: 'age',
                    label: '年龄',
                    components: {
                        name: ComponentType.InputNumber,
                    },
                },
                {
                    label: ' ',
                    components: {
                        name: ComponentType.Space,
                        children: [
                            {
                                name: ComponentType.Button,
                                children: ['保存'],
                                props: { type: 'primary' },
                                events: {
                                    onClick: (preVal) => {
                                        console.log(preVal);
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                children: ['重置'],
                                events: { onClick: () => hResetFields(ctx) },
                            },
                        ],
                    },
                },
            ],
        });
        return render;
    },
});

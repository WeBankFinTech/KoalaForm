import {
    ComponentType,
    useForm,
    doValidate,
    doClearValidate,
} from '@koala-form/core';
import { genForm } from '@koala-form/fes-plugin';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const form = useForm({
            form: genForm(),
            fields: [
                {
                    name: 'name',
                    label: '姓名',
                    required: true,
                    defaultValue: '蒙奇·D·路飞',
                    components: {
                        name: ComponentType.Input,
                    },
                },
                {
                    name: 'age',
                    label: '年龄',
                    rules: [
                        { required: true, message: '年龄不能为空' },
                        {
                            type: 'number',
                            min: 0,
                            max: 200,
                            message: '年龄范围0-200',
                        },
                    ],
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
                                props: { type: 'primary' },
                                children: '校验',
                                events: {
                                    onClick() {
                                        doValidate(form);
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                children: '清空校验',
                                events: {
                                    onClick() {
                                        doClearValidate(form);
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        });
        return form.render;
    },
});

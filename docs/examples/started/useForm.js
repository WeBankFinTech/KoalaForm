import { ComponentType, useForm, doResetFields } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const form = useForm({
            form: { props: { labelWidth: '40px' } },
            fields: [
                {
                    name: 'name', // model.name可以访问到值
                    label: '姓名', // 表单项的名称
                    defaultValue: '蒙奇·D·路飞', // 默认值
                    components: {
                        name: ComponentType.Input, // 表单组件是输入框
                    },
                },
                {
                    name: 'sex',
                    label: '性别',
                    defaultValue: '1',
                    options: [
                        // 设置下拉框选项
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
                                name: ComponentType.Button, // 按钮组件
                                children: ['保存'], // 按钮内容
                                props: { type: 'primary' }, // 组件的属性
                                events: {
                                    // 按钮的事件
                                    onClick: (event) => {
                                        console.log(event, form.model);
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                children: ['重置'],
                                events: { onClick: () => doResetFields(form) }, // 重置按钮点击调用handler函数
                            },
                        ],
                    },
                },
            ],
        });
        return form.render;
    },
});

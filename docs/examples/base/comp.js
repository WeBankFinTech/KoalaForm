import { ComponentType, useScene, useForm } from '@koala-form/core';
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
            ],
        });

        const { render } = useScene({
            components: [
                { name: 'h3', children: '用户信息' },
                {
                    name: 'div',
                    props: { style: { padding: '20px' } },
                    children: [
                        form, // 嵌套
                        {
                            name: ComponentType.Button,
                            children: '保存',
                            events: {
                                onClick: () => {
                                    console.log(form.model);
                                },
                            },
                        },
                    ],
                },
            ],
        });

        return render;
    },
});

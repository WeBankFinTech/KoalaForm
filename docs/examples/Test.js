import {
    ComponentType,
    useForm,
    // setProps,
    whenEvent,
    whenLifeCycle,
    whenIf,
    // getState,
    // resetFields,
} from '@koala-form/core';
import { computed, defineComponent, ref, unref, watch } from 'vue';

const changeAction = {
    when: whenEvent('change'),
    handles: (cxt, ...args) => {
        console.log(args);
    },
};

export default defineComponent({
    setup() {
        const options = [
            { value: '0', label: '女' },
            { value: '1', label: '男' },
        ];
        const saveBtnLabel = ref('保存');
        const { render } = useForm({
            ctxName: 'userForm',
            formProps: { labelWidth: '60px', labelPosition: 'right' },
            fields: [
                {
                    name: 'name',
                    label: '姓名:',
                    component: ComponentType.Input,
                    required: true,
                    actions: { ...changeAction, when: whenEvent('input') },
                },
                {
                    name: 'age',
                    label: '年龄:',
                    component: ComponentType.InputNumber,
                    actions: [
                        changeAction,
                        {
                            when: whenIf('age >= 18'),
                            handles: (cxt, value) => {
                                console.log('成年人');
                            },
                        },
                        {
                            label: '重置',
                            component: ComponentType.Button,
                            when: whenEvent('click'),
                            handles: (cxt) => {
                                console.log(cxt);
                            },
                        },
                    ],
                    defaultValue: 2,
                },
                {
                    name: 'sex',
                    label: '性别:',
                    component: ComponentType.Select,
                    actions: {
                        when: whenLifeCycle('mounted'),
                        handles: [
                            (cxt) => {
                                // setProps({ sex: { options } }, 'field', cxt);
                            },
                        ],
                    },
                },
            ],
            actionsLayout: {
                component: ComponentType.Space,
                props: { justify: 'center' },
            },
            actions: [
                {
                    label: saveBtnLabel,
                    component: ComponentType.Button,
                    props: { type: 'primary' },
                    when: whenEvent('click'),
                    handles: (cxt) => {
                        console.log(cxt);
                    },
                },
                {
                    label: '取消',
                    component: ComponentType.Button,
                    when: whenEvent('click'),
                    handles: (cxt) => {
                        console.log(cxt);
                    },
                },
            ],
        });

        // setProps(
        //     {
        //         sex: {
        //             options: [
        //                 { value: '0', label: '女' },
        //                 { value: '1', label: '男' },
        //             ],
        //         },
        //     },
        //     'field',
        // );

        // setProps({ layout: 'inline', inlineItemWidth: '30%' }, 'form', 'userForm');

        // const state = getState('userForm');
        // console.log(state);
        // watch(
        //     state,
        //     () => {
        //         console.log(state);
        //     },
        //     {
        //         deep: true,
        //     },
        // );
        setTimeout(() => {
            saveBtnLabel.value = '保存按钮';
        }, 2000);
        return render;
    },
});

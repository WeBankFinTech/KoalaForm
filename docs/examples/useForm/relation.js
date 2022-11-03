import { FMessage } from '@fesjs/fes-design';
import {
    ComponentType,
    useForm,
    useSceneContext,
    when,
} from '@koala-form/core';
import { genFesDButton, genFesDForm } from '@koala-form/fes-plugin';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        const showCheck = computed(() => {
            return ctx.model.age < 18;
        });
        const { render } = useForm({
            ctx,
            form: genFesDForm('horizontal', { labelWidth: 50 }),
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
                    vIf: when('!!name'),
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
                            genFesDButton(
                                '保存',
                                () => {
                                    FMessage.success('--保存--');
                                },
                                {
                                    disabled: when(() => ctx.model.age <= 0),
                                },
                            ),
                            genFesDButton(
                                '审核',
                                () => {
                                    FMessage.success('--审核--');
                                },
                                {
                                    vShow: showCheck,
                                },
                            ),
                        ],
                    },
                },
            ],
        });
        return render;
    },
});

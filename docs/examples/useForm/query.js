import { FMessage } from '@fesjs/fes-design';
import {
    ComponentType,
    useForm,
    useSceneContext,
    doResetFields,
} from '@koala-form/core';
import { genForm, genQueryAction } from '@koala-form/fes-plugin';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        const { render } = useForm({
            ctx,
            form: genForm('inline'),
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
                    name: 'age',
                    label: '年龄',
                    components: {
                        name: ComponentType.InputNumber,
                    },
                },
                genQueryAction({
                    query: () => FMessage.success('点击查询'),
                    reset: () => doResetFields(ctx),
                }),
            ],
        });
        return render;
    },
});

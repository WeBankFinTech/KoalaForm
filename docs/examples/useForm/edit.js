import {
    ComponentType,
    useForm,
    useSceneContext,
    hResetFields,
    hFormData,
} from '@koala-form/core';
import { genFesDForm, genFesDSubmitAction } from '@koala-form/fes-plugin';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        const { render } = useForm({
            ctx,
            form: genFesDForm(),
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
                genFesDSubmitAction({
                    save: () => console.log(hFormData(ctx)),
                    clear: () =>
                        Object.assign(ctx.model, { name: null, age: null }),
                    reset: () => hResetFields(ctx),
                }),
            ],
        });
        return render;
    },
});

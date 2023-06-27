import { ComponentType, useForm, useSceneContext, doResetFields, doGetFormData } from '@koala-form/core';
import { genSubmitAction } from '@koala-form/fes-plugin';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        const { render } = useForm({
            ctx,
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
                genSubmitAction({
                    save: () => console.log(doGetFormData(ctx)),
                    clear: () => Object.assign(ctx.modelRef.value, { name: null, age: null }),
                    reset: () => doResetFields(ctx),
                }),
            ],
        });
        return render;
    },
});

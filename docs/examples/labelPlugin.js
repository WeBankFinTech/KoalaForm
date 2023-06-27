import { ComponentType, useForm, useSceneContext, travelTree, mergeRefProps } from '@koala-form/core';
import { defineComponent } from 'vue';

const formLabelColonPlugin = (api) => {
    api.describe('form-label-colon-plugin');

    api.on('formSchemeLoaded', ({ ctx }) => {
        // 遍历scheme
        travelTree(ctx.schemes, (scheme) => {
            if (scheme.props?.label?.trim()) {
                // 合并属性
                mergeRefProps(scheme, 'props', { label: scheme.props.label + ':' });
            }
        });
    });
};

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('form');
        ctx.use(formLabelColonPlugin);
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
            ],
        });
        return render;
    },
});

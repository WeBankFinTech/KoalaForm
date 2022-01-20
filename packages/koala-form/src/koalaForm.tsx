import { defineComponent, PropType } from 'vue';
import usePage from './usePage';
import { Config } from './config';
import { Field } from './field';

const KoalaForm = defineComponent({
    props: {
        render: Function,
        fields: Array as PropType<Field[]>,
        config: Object as PropType<Config>,
    },
    setup(props, { slots }) {
        let render = props.render;
        if (!render && props.fields && props.config) {
            const page = usePage(props.fields, props.config);
            render = page.render;
        }
        return () => render?.(slots);
    },
});

export default KoalaForm;

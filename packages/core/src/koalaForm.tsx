import { defineComponent } from 'vue';

const KoalaForm = defineComponent({
    props: {
        render: Function,
    },
    setup(props, ctx) {
        return () => {
            return props.render?.(ctx.slots);
        };
    },
});

export default KoalaForm;

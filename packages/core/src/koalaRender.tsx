import { defineComponent, PropType } from 'vue';
import { SceneContext } from './base';
import { turnArray } from './helper';
import { composeRender } from './plugins';

const KoalaRender = defineComponent({
    props: {
        render: {
            type: Object as PropType<SceneContext['render'] | SceneContext['render'][]>,
            required: true,
        },
    },
    setup(props, ctx) {
        return () => {
            const render = composeRender(turnArray(props.render));
            return render(ctx.slots);
        };
    },
});

export default KoalaRender;

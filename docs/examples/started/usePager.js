import { FMessage } from '@fesjs/fes-design';
import { useSceneContext, usePager, hSetPager, LinkHandler } from '@koala-form/core';
import { defineComponent, watch } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('pager');
        const { render, model } = usePager({
            ctx,
            pager: {
                events: {
                    onChange: new LinkHandler(({ preVal }) => {
                        FMessage.info('onChange ' + preVal);
                    }),
                },
            },
        });
        model.currentPage = 2;
        model.totalCount = 100;
        // setPagerTotal(100, ctx)();
        // setPagerCurrent(2, ctx)();

        watch(
            () => model.currentPage,
            () => {
                FMessage.success('watch ' + model.currentPage);
            },
        );

        return render;
    },
});

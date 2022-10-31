import { FMessage } from '@fesjs/fes-design';
import { useSceneContext, usePager, hSetPager } from '@koala-form/core';
import { defineComponent, watch } from 'vue';

export default defineComponent({
    setup() {
        const { ctx } = useSceneContext('pager');
        const { render, model } = usePager({
            ctx,
            pager: {
                events: {
                    onChange: (value) => {
                        FMessage.info('onChange ' + value);
                    },
                },
            },
        });
        model.currentPage = 2;
        model.totalCount = 100;
        // hSetPager(ctx, { currentPage: 2, totalCount: 100 });

        watch(
            () => model.currentPage,
            () => {
                FMessage.success('watch ' + model.currentPage);
            },
        );

        return render;
    },
});

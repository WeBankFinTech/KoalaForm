import { FMessage } from '@fesjs/fes-design';
import { usePager } from '@koala-form/core';
import { defineComponent, watch } from 'vue';

export default defineComponent({
    setup() {
        const { render, model } = usePager({
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

import { FMessage } from '@fesjs/fes-design';
import { usePager } from '@koala-form/core';
import { defineComponent, watch } from 'vue';

export default defineComponent({
    setup() {
        const { render, modelRef } = usePager({
            pager: {
                props: {
                    style: {
                        justifyContent: 'center',
                    },
                },
                events: {
                    onChange: (value) => {
                        FMessage.info('onChange ' + value);
                    },
                },
            },
        });
        modelRef.value.currentPage = 2;
        modelRef.value.totalCount = 100;
        // doSetPager(ctx, { currentPage: 2, totalCount: 100 });

        watch(
            () => modelRef.value.currentPage,
            () => {
                FMessage.success('watch ' + modelRef.value.currentPage);
            },
        );

        return render;
    },
});

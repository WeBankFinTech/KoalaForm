// complexPage/use/useDepartment.js

import { computed, ref } from 'vue';
import { sleep, appendAll } from '../utils';

export function useDepartment() {
    const res = ref(null);
    const error = ref(null);
    const loading = ref(false);

    const doQuery = async () => {
        try {
            loading.value = true;

            await sleep(100);

            const pageData = [
                {
                    departmentId: 1,
                    departmentName: '科技部',
                },
                {
                    departmentId: 2,
                    departmentName: '金融部',
                },
                {
                    departmentId: 3,
                    departmentName: '销售部',
                },
            ];

            res.value = pageData;
        } catch (err) {
            console.error('useDepartment || error:', err);
            error.value = err || new Error();
        } finally {
            await sleep(200);
            loading.value = false;
        }
    };

    doQuery();

    const departmentList = computed(() => {
        let options = [];

        if (error.value) {
            return options;
        }
        if (loading.value) {
            return options;
        }
        if (!res.value) {
            return options;
        }

        options = res.value.map((item) => ({
            label: item.departmentName,
            value: item.departmentId,
        }));

        return options;
    });

    const departmentListAll = computed(() => appendAll(departmentList.value));

    return {
        departmentLoading: loading,
        departmentList,
        departmentListAll,
    };
}

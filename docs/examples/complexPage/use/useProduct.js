import { ref, computed, watch, isRef } from 'vue';
import { appendAll, sleep } from '../utils';

/**
 * @param departmentId 产品列表依赖部门查找，所以部门必须是 ref 对象
 */
export function useProduct(departmentId = null) {
    const res = ref(null);
    const error = ref(null);
    const productLoading = ref(false);

    const doQuery = async () => {
        try {
            productLoading.value = true;
            await sleep(100);

            const pageDataMap = {
                1: [
                    {
                        productId: 1,
                        productName: '微粒贷',
                    },
                ],
                2: [
                    {
                        productId: 2,
                        productName: '微业贷',
                    },
                ],
                3: [
                    {
                        productId: 3,
                        productName: 'We2000',
                    },
                ],
            };

            res.value = pageDataMap[departmentId.value] || [];
        } catch (err) {
            console.error('useProduct || error:', err);
            error.value = err || new Error();
        } finally {
            await sleep(200);
            productLoading.value = false;
        }
    };

    if (isRef(departmentId)) {
        watch(
            departmentId,
            () => {
                if (departmentId.value) {
                    doQuery();
                } else {
                    // 部门选择 全部 的情况下，产品列表需要清空
                    res.value = [];
                }
            },
            { immediate: true },
        );
    }

    doQuery();

    const productList = computed(() => {
        let options = [];

        if (error.value) {
            return options;
        }
        if (productLoading.value) {
            return options;
        }
        if (!res.value) {
            return options;
        }

        options = res.value.map((item) => ({
            label: item.productName,
            value: item.productId,
        }));

        return options;
    });

    const productListAll = computed(() => appendAll(productList.value));

    return {
        productList,
        productListAll,
        productLoading,
    };
}

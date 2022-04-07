// complexPage/use/useTableList.js

import { watch, ref } from 'vue';
import { sleep } from '../utils';

const PAGE_CONFIG = {
    current: 1,
    pageSize: 10,
};
const PAGE_PROPS = {
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 50],
    showTotal: true,
};
const TABLE_PROPS = {
    bordered: true,
};

function useQuery(props, pagerModel, setTableValue, setPagerValue) {
    const tableLoading = ref(false);
    async function doQuery() {
        try {
            const params = {
                ...props.queryData,
                pageSize: pagerModel.pageSize,
                currentPage: pagerModel.current,
            };
            console.log('useQuery || params:', params);

            tableLoading.value = true;

            const res = {
                totalCount: 100,
                pageData: [
                    {
                        id: 1,
                        userId: 'aaa',
                        userName: '啊啊啊',
                        departmentId: 1,
                        departmentName: '科技部',
                        productId: 1,
                        productName: '微粒贷',
                        status: 'enable',
                    },
                    {
                        id: 2,
                        userId: 'bbb',
                        userName: '嘿嘿嘿',
                        departmentId: 2,
                        departmentName: '金融部',
                        productId: 2,
                        productName: '微业贷',
                        status: 'enable',
                    },
                    {
                        id: 3,
                        userId: 'ccc',
                        userName: '嘻嘻嘻',
                        departmentId: 3,
                        departmentName: '销售部',
                        productId: 3,
                        productName: 'We2000',
                        status: 'disable',
                    },
                ],
            };

            setTableValue(res.pageData);
            setPagerValue({
                total: res.totalCount,
            });
        } catch (err) {
            console.error('useQuery || err:', err);
        } finally {
            await sleep(200);
            tableLoading.value = false;
        }
    }

    // 初始化分页
    setPagerValue({
        pageSize: PAGE_CONFIG.pageSize,
        current: PAGE_CONFIG.current,
        onChange(current) {
            setPagerValue({ current });
            doQuery();
        },
        onPageSizeChange(size) {
            setPagerValue({
                pageSize: size,
                current: PAGE_CONFIG.current,
            });
            doQuery();
        },
    });

    watch(
        () => props.queryData,
        () => {
            setPagerValue({
                current: PAGE_CONFIG.current,
            });
            doQuery();
        },
        {
            immediate: true,
            deep: false,
        },
    );

    return {
        doQuery,
        tableLoading,
    };
}

export function useTableList(props, pagerModel, setTableValue, setPagerValue, setPagerProps, setTableProps) {
    const { tableLoading } = useQuery(props, pagerModel, setTableValue, setPagerValue);

    setPagerProps(PAGE_PROPS);
    setTableProps(TABLE_PROPS);

    return { tableLoading };
}

import { ElOption } from 'element-plus';
import { unref } from 'vue';

export const genSelectSlots = (options: []) => ({
    default() {
        return unref(options || []).map((item: any) => <ElOption key={item.value} {...item}></ElOption>);
    },
});

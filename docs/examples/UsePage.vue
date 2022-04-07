<template>
    <KoalaForm :render="render">
        <template #table_actions_extend>
            <FButton type="link">审核</FButton>
        </template>
        <!-- 弹框交互自定义弹框的操作按钮 -->
        <template #update_action="{ modalModel, modalProp, onOk, onCancel }">
            <FButton type="primary" style="margin-right: 10px">审核</FButton>
            <FButton type="primary" style="margin-right: 10px" @click="onOk">保存</FButton>
            <FButton @click="onCancel">关闭</FButton>
        </template>
    </KoalaForm>
</template>

<script>
import { usePage, KoalaForm } from '@koala-form/core';
import { useUser } from './user';
import { FButton } from '@fesjs/fes-design';

export default {
    components: { KoalaForm, FButton },
    setup() {
        const { fields, config } = useUser();
        // 弹框模式改为抽屉模式
        config.modalMode = 'drawer';
        const { render, actions } = usePage(fields, config);
        return {
            render,
        };
    },
};
</script>

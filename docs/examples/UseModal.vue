<template>
    <div>
        <FButton type="primary" @click="() => open()">更新</FButton>
        <FButton style="margin-left: 20px" type="primary" @click="() => open('drawer')">Drawer风格</FButton>
        <KoalaForm :render="render"></KoalaForm>
        <KoalaForm :render="drawer.render"></KoalaForm>
    </div>
</template>

<script>
import { useModal, KoalaForm } from '@koala-form/core';
import { useUser } from './user';

export default {
    components: { KoalaForm },
    setup() {
        const { fields, config, mockUser } = useUser();
        const { render, open, setModalProps } = useModal(fields, config, 'update');
        const drawer = useModal(fields, { ...config, modalMode: 'drawer' }, 'update');
        setModalProps({
            title: '我是setModalProps设置的标题',
        });

        return {
            render,
            drawer,
            open(type) {
                if (type === 'drawer') {
                    drawer.open(mockUser);
                } else {
                    open(mockUser);
                }
            },
        };
    },
};
</script>

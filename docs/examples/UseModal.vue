<template>
    <div>
        <FButton type="primary" @click="() => open()">更新</FButton>
        <KoalaForm :render="render"></KoalaForm>
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
        setModalProps({
            title: '我是setModalProps设置的标题',
        });
        return {
            render,
            open() {
                open(mockUser);
            },
        };
    },
};
</script>

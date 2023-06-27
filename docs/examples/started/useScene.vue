<template>
    <KoalaRender :render="render" />
</template>

<script>
import { useScene, KoalaRender } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { KoalaRender },
    setup() {
        const { render } = useScene({
            components: [
                {
                    name: 'div',
                    props: { id: 'baseScene' },
                    children: [
                        { name: 'h3', children: ['基础场景'] },
                        {
                            name: 'p',
                            children: ['我是基础场景的内容', { name: 'br' }, '使用KoalaRender'],
                        },
                    ],
                },
            ],
        });
        return {
            render,
        };
    },
});
</script>

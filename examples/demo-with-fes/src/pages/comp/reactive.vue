<template>
    <div class="pager">
        <h3>响应式联动</h3>
        <div>用响应式对象控制组件描述的渲染结果</div>
        <ElButton @click="show.vIf = !show.vIf">vIf</ElButton>
        <ElButton @click="show.vShow = !show.vShow">vShow</ElButton>
        <ElButton @click="show.disabled = !show.disabled">disabled</ElButton>
        <KoalaRender :render="scene1.render"></KoalaRender>
        <h3>When联动</h3>
        <div>用When组件描述的渲染结果</div>
        <ElButton @click="show2.vIf = !show2.vIf">vIf</ElButton>
        <ElButton @click="show2.vShow = !show2.vShow">vShow</ElButton>
        <ElButton @click="show2.disabled = !show2.disabled">disabled</ElButton>
        <KoalaRender :render="scene2.render"></KoalaRender>

        <h3>属性联动</h3>
        <div>用When组件描述的渲染结果</div>
    </div>
</template>

<script setup>
import { defineRouteMeta } from '@fesjs/fes';
import { useScene, KoalaRender, ComponentType, when } from '@koala-form/core';
import { ElButton } from 'element-plus';
import { computed, reactive } from 'vue';
// import CustomComp from '../../components/CustomComp.vue';

defineRouteMeta({
    name: 'reactive',
    title: '联动控制',
});

const show = reactive({
    vIf: true,
    vShow: true,
    disabled: true,
});

const show2 = reactive({
    vIf: true,
    vShow: true,
    disabled: true,
});

const scene1 = useScene({
    components: [
        {
            name: 'div',
            vIf: computed(() => show.vIf),
            children: 'vIf控制',
        },
        {
            name: 'div',
            vShow: computed(() => show.vShow),
            children: 'vShow控制',
        },
        {
            name: ComponentType.Button,
            disabled: computed(() => show.disabled),
            children: 'disabled控制',
        },
    ],
});

const scene2 = useScene({
    components: [
        {
            name: 'div',
            vIf: when(() => show2.vIf),
            children: '组件控制',
        },
        {
            name: 'div',
            vShow: when(() => show2.vShow),
            children: 'vShow控制',
        },
        {
            name: ComponentType.Button,
            disabled: when(() => show2.disabled),
            children: 'disabled控制',
        },
    ],
});
</script>

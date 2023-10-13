<template>
    <div class="pager">
        <h3>指定组件</h3>
        <KoalaRender :render="scene1.render"></KoalaRender>
        <h3>属性设置</h3>
        <KoalaRender :render="scene2.render"></KoalaRender>
    </div>
</template>

<script setup>
import { useScene, KoalaRender, ComponentType } from '@koala-form/core';
import { defineRouteMeta } from '@fesjs/fes';
import { ElButton } from 'element-plus';
import CustomComp from '../../components/CustomComp.vue';

defineRouteMeta({
    name: 'basic',
    title: '基础使用',
});

const scene1 = useScene({
    components: [
        {
            name: 'div',
            children: '我是一个普通的div标签',
        },
        {
            name: ComponentType.Button,
            children: '我是ComponentType.Button映射的按钮组件',
        },
        {
            name: ElButton,
            children: '我是直接使用ElButton组件',
        },
        {
            name: CustomComp,
            children: '我是组件默认的插槽内容',
        },
    ],
});

const scene2 = useScene({
    components: [
        {
            name: 'div',
            props: {
                class: 'my-class',
                style: {
                    color: 'red',
                    margin: '30px',
                },
            },
            children: '普通标签的属性',
        },
        {
            name: ComponentType.Button,
            props: {
                type: 'primary',
            },
            children: '组件属性，有哪些属性可查看组件库的文档',
        },
        {
            name: CustomComp,
            props: {
                msg: '自定义组件属性',
            },
            children: '自定义组件',
        },
    ],
});
</script>

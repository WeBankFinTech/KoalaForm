<template>
    <div style="background: #eee; padding: 20px">
        自定义组件
        <slot name="before" />
        <div>属性：{{ props.msg }}</div>
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    msg: String,
});
</script>

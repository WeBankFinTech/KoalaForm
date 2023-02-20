<script setup>
import { FButton } from '@fesjs/fes-design';
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Test from './components/Test';

const show = ref(false);
</script>

<template>
    <div>
        <FButton @click="show = !show">切换显示</FButton>
        <HelloWorld v-if="show" />
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

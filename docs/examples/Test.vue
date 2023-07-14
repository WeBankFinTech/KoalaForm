<template>
    <Test></Test>
</template>

<script>
import { defineComponent, onUnmounted, ref } from 'vue';
const Test = defineComponent({
    name: 'Test',
    data() {
        return {
            name: 'aring',
        };
    },
    methods: {
        hello: () => {
            console.log('hello');
        },
    },
    render() {
        // debugger;
        this.hello();
        return '11111';
    },
});

export default defineComponent({
    components: { Test },
    setup() {
        // to do
    },
});
</script>

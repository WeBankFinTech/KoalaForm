<template>
    <!-- <FTable :data="dataList">
        <FTableColumn label="ID" prop="id"></FTableColumn>
    </FTable> -->
    <FButton v-for="(item, index) in dataList">{{ index }}</FButton>
</template>

<script setup>
import { FButton } from '@fesjs/fes-design';
import { onUnmounted, ref } from 'vue';

const dataList = ref([]);
for (let index = 0; index < 1; index++) {
    dataList.value.push({ name: index });
}

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
];

onUnmounted(() => {
    console.log('------');
});
</script>

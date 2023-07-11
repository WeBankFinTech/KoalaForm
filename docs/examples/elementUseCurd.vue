<template>
    <KoalaRender :render="render">
        <!-- 扩展查询操作 -->
        <template #queryActionsExtend>
            <ElButton type="primary" @click="doExport">导出</ElButton>
            <ElButton type="primary" @click="doBatch">批量</ElButton>
        </template>
        <template #tableActionsExtend="{ row }">
            <ElButton type="primary" link @click="doPass(row)">审核</ElButton>
            <ElButton type="primary" link :disabled="row.id === '2'" @click="openModal('update', { row })">更新</ElButton>
        </template>
    </KoalaRender>
</template>

<script setup>
import { ComponentType, KoalaRender, doGetFormData, useSceneContext } from '@koala-form/core';
import { useCurd, mapTableFields, componentPlugin } from '@koala-form/element-plugin';
import { computed } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
const sexOptions = [
    { value: '0', label: '女' },
    { value: '1', label: '男' },
];

const educationOptions = [
    { value: '1', label: '高中以下' },
    { value: '2', label: '大专' },
    { value: '3', label: '大学本科' },
    { value: '4', label: '研究生' },
    { value: '5', label: '其他' },
];

const hobbyOptions = [
    { value: '1', label: '唱' },
    { value: '2', label: '跳' },
    { value: '3', label: 'rap' },
    { value: '4', label: '篮球' },
];

const FIELDS = {
    id: { name: 'id', label: '编号', format: (model, value) => value },
    name: { name: 'name', label: '姓名', components: { name: ComponentType.Input } },
    age: { name: 'age', label: '年龄', components: { name: ComponentType.InputNumber } },
    sex: { name: 'sex', label: '性别', options: sexOptions, components: { name: ComponentType.Select } },
    hobby: { name: 'hobby', type: 'array', label: '爱好', options: hobbyOptions, components: { name: ComponentType.CheckboxGroup } },
    birthday: { name: 'birthday', label: '出生日期', components: { name: ComponentType.DatePicker, props: { type: 'daterange' } } },
    idCard: { name: 'idCard', label: '身份证', components: { name: ComponentType.Input } },
    education: { name: 'education', label: '学历', options: educationOptions, components: { name: ComponentType.Select } },
    degree: { name: 'degree', label: '学位', components: { name: ComponentType.Input } },
    address: { name: 'address', label: '住址', components: { name: ComponentType.Input, props: { type: 'textarea' } } },
};

const {
    ctxs: [query, table, pager, modal, edit],
} = useSceneContext(['query', 'table', 'pager', 'modal', 'edit'], [componentPlugin]);

const showDegree = computed(() => ['2', '3', '4'].includes(edit.modelRef.value.education));

const { render, editTypeRef, selectedRows, openModal } = useCurd({
    name: '用户',
    query: {
        ctx: query,
        fields: [FIELDS.name, FIELDS.sex, FIELDS.birthday],
    },
    table: {
        ctx: table,
        rowKey: 'id',
        selection: { props: { fixed: true, width: 50 } },
        actionField: { props: { fixed: 'right', width: 320 } },
        fields: mapTableFields(
            [
                { ...FIELDS.id, props: { fixed: true, width: 80 } },
                FIELDS.name,
                FIELDS.age,
                FIELDS.sex,
                FIELDS.hobby,
                { ...FIELDS.idCard, format: (model, value) => value && '****' + value.slice(14) },
                FIELDS.birthday,
                FIELDS.education,
                { ...FIELDS.address, props: { width: 300 } },
            ],
            { props: { width: 150 } },
        ),
    },
    pager: { ctx: pager },
    edit: {
        ctx: edit,
        fields: [
            { ...FIELDS.id, vIf: computed(() => editTypeRef.value !== 'create') },
            { ...FIELDS.name, required: true },
            FIELDS.age,
            FIELDS.sex,
            FIELDS.education,
            FIELDS.hobby,
            FIELDS.idCard,
            { ...FIELDS.birthday, components: { name: ComponentType.DatePicker } },
            { ...FIELDS.degree, vIf: showDegree },
            FIELDS.address,
        ],
    },
    modal: { ctx: modal },
    actions: {
        query: {
            api: '/user.json',
        },
        create: {
            api: '/success.json',
        },
        reset: {},
        update: {
            hidden: true, // 更新按钮修改行数据判断时，可以隐藏默认更新按钮，在template实现
            api: '/error.json',
        },
        delete: {
            api: '/success.json',
        },
        view: {},
    },
});

// 插件局部安装
query.use(componentPlugin);
table.use(componentPlugin);
pager.use(componentPlugin);
modal.use(componentPlugin);
edit.use(componentPlugin);

const doExport = () => {
    ElMessage.success('导出');
    console.log('导出', doGetFormData(query));
};

const doBatch = () => {
    if (!selectedRows.value?.length) {
        ElMessage.error('至少选择一条记录');
        return;
    }
    ElMessage.success('批量操作 ==> ids: ' + selectedRows.value);
    console.log('批量操作', selectedRows.value);
};

const doPass = (record) => {
    ElMessage.success('审核 ===> ' + record.name);
    console.log(record);
};
</script>

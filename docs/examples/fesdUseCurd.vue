<template>
    <KoalaRender :render="render">
        <!-- 扩展查询操作 -->
        <template #queryActionsExtend>
            <FButton type="primary" @click="doExport">导出</FButton>
            <FButton type="primary" @click="doBatch">批量</FButton>
        </template>
        <template #tableActionsExtend="{ row }">
            <FButton type="link" @click="doPass(row)">审核</FButton>
            <FButton type="link" :disabled="row.id === '2'" @click="openModal('update', { row })">更新</FButton>
        </template>
    </KoalaRender>
</template>

<script setup>
import { ComponentType, KoalaRender, doGetFormData, useSceneContext } from '@koala-form/core';
import { useCurd, mapTableFields } from '@koala-form/fes-plugin';
import { computed } from 'vue';
import { FButton, FMessage } from '@fesjs/fes-design';
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

const { ctx: edit } = useSceneContext('edit');

const showDegree = computed(() => ['2', '3', '4'].includes(edit.modelRef.value.education));

const { render, editTypeRef, query, selectedRows, openModal } = useCurd({
    name: '用户',
    query: {
        fields: [FIELDS.name, FIELDS.sex, FIELDS.birthday],
    },
    table: {
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
    pager: {},
    edit: {
        ctx: edit,
        fields: [
            { ...FIELDS.id, vIf: computed(() => editTypeRef.value !== 'create') },
            { ...FIELDS.name, required: true, disabled: computed(() => editTypeRef.value !== 'create') },
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
    modal: {},
    actions: {
        query: {
            api: '/user.json',
            before(params) {
                // 修改请求参数
                params.myId = '111';
                // return false; // 阻止请求
                return params;
            },
            after(data) {
                // return false; // 阻止默认数据绑定逻辑
                // 修改请求接口，适配绑定数据
                const { pager, list } = data;
                return {
                    list: list,
                    pager: pager,
                };
            },
        },
        create: {
            api: '/success.json',
            before(params) {
                // 修改请求参数
                params.myId = '111';
                // return false; // 阻止请求
                return params;
            },
            after(data) {
                // return false; // 阻止关闭弹窗和刷新列表
                return data;
            },
        },
        reset: {},
        update: {
            hidden: true, // 更新按钮修改行数据判断时，可以隐藏默认更新按钮，在template实现
            api: '/error.json',
            before(params) {
                // 修改请求参数
                params.myId = '111';
                // return false; // 阻止请求
                return params;
            },
            after(data) {
                // return false; // 阻止关闭弹窗和刷新列表
                return data;
            },
        },
        delete: {
            api: '/success.json',
            before(params) {
                // 修改请求参数
                params.myId = '111';
                // return false; // 阻止请求
                return params;
            },
            after(data) {
                // return false; // 阻止默认提示和刷新列表
                return data;
            },
        },
        view: {},
    },
});

const doExport = () => {
    FMessage.success('导出');
    console.log('导出', doGetFormData(query));
};

const doBatch = () => {
    if (!selectedRows.value?.length) {
        FMessage.warn('至少选择一条记录');
        return;
    }
    FMessage.success('批量操作 ==> ids: ' + selectedRows.value);
    console.log('批量操作', selectedRows.value);
};

const doPass = (record) => {
    FMessage.success('审核 ===> ' + record.name);
    console.log(record);
};
</script>

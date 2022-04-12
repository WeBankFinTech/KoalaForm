---
sidebarDepth: 3
---
# usePage

完整的表单页面一般包括CURD操作，usePage就是包含表单完整的功能。

<ExampleDoc>
<UsePage>
</UsePage>
<template #code>

<<< @/examples/UsePage.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法定义
### useQuery
```ts
export interface UsePageResult {
    /**
     * @deprecated 将在1.2.0版本移除
     */
    actions: {
        insert?: UseModalResult;
        update?: UseModalResult;
        view?: UseModalResult;
        delete?: UseModalResult;
    };
    query: UseQueryResult;
    insert?: UseModalResult;
    update?: UseModalResult;
    view?: UseModalResult;
    delete?: UseModalResult;
    render: KoalaFormRenderFunction;
}

function usePage(fields: Array<Field>, config: Config): UsePageResult

```

### 参数说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| fields | 表单所有字段的定义 | `Array<Field>` |
| config | 操作配置| `Config` |

### 返回说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| query | useQuery的操作对象 | `UseQueryResult`
| insert | useModal新增表单的操作对象 | `UseModalResult`
| update | useModal更新表单的操作对象 | `UseModalResult`
| view | useModal详情表单的操作对象 | `UseModalResult`
| delete | useModal新增删除的操作对象 | `UseModalResult`
| render | render列表的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数 | `KoalaFormRenderFunction`

## Render slots
usePage由useQuery和useModal组成，所以支持他们的slot，另外还提供了下面这些：
| slot name    | 说明                    | 参数               |
| ------------ | ----------------------- | ----------------- |
| `table_actions`  | table操作列自定义，在useTable对应`table_[name]`, 其中name === 'actions' | `{record， openUpdateModal, openViewModal, openDeleteModal }` |
| `table_actions_extend`  | 在更新、删除、详情按钮的基础上，扩展其他按钮 | `{ record, openUpdateModal, openViewModal, openDeleteModal}` |

::: tip
在完整的表单页面中，才会集成列的更新、删除、详情等操作，所以在usePage处理才有意义。

当useTable中操作列的name === 'actions'时，这些slots才会启用。

table_actions的优先级大于table_actions_extend。
:::
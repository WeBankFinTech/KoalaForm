---
sidebarDepth: 3
---
# KoalaForm组件
该组件用于在vue template中渲染useForm、useTable、useFormAction、useModal、useQuery、usePage返回的render方法。

## 属性

| 属性        | 说明                           | 类型                      | 默认值       |
| ----------- | ----------------------------- | ------------------------- | ------------ |
| render        | render方法         | `Function`       |
| fields     | 表单字段定义的字段      |  `Array<Field>`    | 无           |
| config | 表单页面配置            | `Config`                    | 无           |

::: tip
当只有fields和config时，会使用usePage获取render。

当传入了render后，fields和config会忽略。
:::


## Slots
该组件的slots都会透传给传入的render方法，所以主要看render方法支持的slots，常见的slots有下：

| render来源    | slot name        | 说明                           | 参数                      |
| --------- |----------- | ----------------------------- | ------------------------- |
| useForm   |`[name]`  | 字段formItem的内容，全部表单都生效 | `{ type, model, rules, props, disabled, options }` |
| useForm       |`formItem_[name]`  | 字段formItem的内容，指定类型表单生效 | `{ type, model, rules, props, disabled, options }` |
| useForm   |`[type]_formItem_[name]`  | 字段的的FormItem，全部表单都生效 | `{ type, model, rules, props, disabled, options }` |
| useForm   |`[type]_[name]`  | 字段的的FormItem，指定类型表单都生效 | `{ type, model, rules, props, disabled, options }` |
| useForm   |`extend_items`  | 在Form内扩展FormItem | `{ type, model }` |
| useForm   | `[type]_extend_items`  | 在Form内扩展指定类型的FormItem，可覆盖`extend_items` | `{ model }` |
| useTable   |`table_[name]`  | table字段key渲染的内容 |  `record: { row, column, rowIndex, columnIndex, cellValue }` |
| useTable   |`table_[name]_header`  | table表头字段key渲染的内容 | `{ column, columnIndex }` |
| useFormAction   |`[type]_action_extend`  | `preset.[type]ActionRender`自定义扩展的内容 | `{ formModel, handleAction, handleReset  }` |
| useFormAction   |`[type]_action`  | 自定义操作 | `{ formModel, handleAction, handleReset  }` |
| useModal  |`[type]_action`  | 自定义footer操作按钮 | `{ formModel, modalModel, modalProp, onOk, onCancel }` |
| usePage  |`table_actions`  | table操作列自定义，在useTable对应`table_[name]`, 其中name === 'actions' | `{record， openUpdateModal, openViewModal, openDeleteModal }` |
| usePage  |`table_actions_extend`  | 在更新、删除、详情按钮的基础上，扩展其他按钮 | `{ record, openUpdateModal, openViewModal, openDeleteModal}` |

::: tip
name对应Field的属性name，指向的是当前字段

type对应是ACTION_TYPES， 可取值为`query` `insert` `update` `delete` `view` `table`， 指向的是当前场景
:::

## 示例

<ExampleDoc>
<KoalaFormDemo>
</KoalaFormDemo>
<template #code>

<<< @/examples/KoalaFormDemo.vue

</template>
</ExampleDoc>
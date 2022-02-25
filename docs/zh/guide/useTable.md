---
sidebarDepth: 3
---
# useTable

用于最纯表格展示场景，你可以通过字段定义解析出列表的column，使用render函数可以直接渲染表格，还支持：
- 自定义字段值的渲染
- 自定义表头字段的渲染
- 自定义操作列
- 单枚举、多枚举类型自动映射（比如性别、爱好字段）
- 日期时间自动格式化（比如出生日期）

<ExampleDoc>
<UseTable>
</UseTable>
<template #code>

<<< @/examples/UseTable.vue

<<< @/examples/user.js

</template>
</ExampleDoc>


## 方法参数

- **fields**

表单所有字段的定义，类型：`Array<Field>`

- **uniqueKey**

列表行唯一标识字段名，类型：`string`，默认值：**`'id'`**

## 返回结果
- **columns**

table的列定义，具体根据`preset.defineTableColumn`的实现返回，一般可以直接用于table组件的columns属性
- **tableModel**

双向绑定的model对象，表格的数据

- **pagerModel**

分页组件的model对象

- **setTableValue**

设置tableModel的值
```js
// 传入数组设置
setTableValue([{id: 1}, {id: 2}])

// 设置更新第二行的数据
setTableValue({id: 1}, 1)
```

- **setPagerValue**

设置pagerModel的值

```js
setPagerValue({
    pageSize: 10, // 分页大小
    current: 1, // 当前分页
    total: 20, // 总条数
    onChange(current) { // 分页组件改变回调
        setPagerValue({ current });
    },
})
```

- **render**,

render列表的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数

## Render slots
render方法实际是依赖`preset.tableRender`的实现，特殊情况下，需要支持自定义扩展字段，而render函数的参数slots提供了支持，slots会透传给`preset.tableRender`，怎么支持看具体实现，这些建议的slot如下：

| slot name    | 说明                    | 参数               |
| ------------ | ----------------------- | ----------------- |
| `table_[key]`  | table字段key渲染的内容 | 行相关数据，跟组件库相关 |
| `table_[key]_header`  | table表头字段key渲染的内容 | 列相关数据，跟组件库相关 |

```vue
<!-- 基于koala-form-preset-fesd实现的slot -->
<template>
    <KoalaForm :render="render">
        <!-- 字段内容 -->
        <template #table_name="{ row, column, rowIndex, columnIndex, cellValue }">
            <a>{{ cellValue }}</a>
        </template>
         <!-- 表头内容 -->
        <template #table_name_header="{ column }">
            <a>{{ column?.props?.label }}</a>
        </template>
    </KoalaForm>
</template>

```
---
sidebarDepth: 3
---
# useQuery

用于查询表单和列表展示，由useFormAction和useTable组合而成。

<ExampleDoc>
<UseQuery>
</UseQuery>
<template #code>

<<< @/examples/UseQuery.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法参数

- **fields**

表单所有字段的定义，类型：`Array<Field>`

- **config**

操作配置，类型：`Config`

## 返回结果
- **query**

`useFormAction`返回的结果
- **table**

`useTable`返回的结果

- **render**

render由query.render和table.render一起渲染

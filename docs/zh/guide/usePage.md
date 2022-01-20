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

## 方法参数

- **fields**

表单所有字段的定义，类型：`Array<Field>`

- **config**

操作配置，类型：`Config`

## 返回结果
- **actions**

所有表单的操作对象

- **render**

render由所有actions的render和`preset.pageRender`一起渲染。

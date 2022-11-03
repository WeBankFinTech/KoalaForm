---
sidebarDepth: 3
---
# useForm
在curd中出现表单场景是查询表单、新增表单、更新表单。

## 表单配置

## Handler

## Context

## 查询表单

配合fes-plugin提供的presetFesDForm、fesDQueryAction更快的搭建出一个查询的表单

<ExampleDoc>
<UseFormQuery>
</UseFormQuery>
<template #code>

<<< @/examples/useForm/query.js

</template>
</ExampleDoc>

## 新增/更新表单

同样fesDSubmitAction能快速搭建提交新增/更新表单的操作

<ExampleDoc>
<UseFormEdit>
</UseFormEdit>
<template #code>

<<< @/examples/useForm/edit.js

</template>
</ExampleDoc>

## 表单联动

下面三个属性表单联动更简单，可以作用于组件和Fields字段上

- vIf：是否渲染
- vShow：是否显示
- disabled：是否可用

类型是：`Ref<boolean> | boolean | When`，如下面例子所示：
1. 字段性别上的`vIf: when('!!name')`, 表示当字段name不为空时，渲染性别字段。
2. 保存按钮的`disabled: when(() => ctx.model.age <= 0)`，表示年龄age>0时，可保存按钮可点击。
3. 审核按钮的`vShow: showCheck`，其中showCheck时一个Ref，根据Ref的值，判断审核按钮是否显示，判断age大于18岁时，不需要提交审核

其中when接受字符串表达式和函数，更多了解请参考[When](./when.md)

<ExampleDoc>
<UseFormRelation>
</UseFormRelation>
<template #code>

<<< @/examples/useForm/relation.js

</template>
</ExampleDoc>
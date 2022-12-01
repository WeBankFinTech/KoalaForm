---
sidebarDepth: 3
---
# useForm
在curd中出现表单场景是查询表单、新增表单、更新表单。

## 表单配置

## Handler

## Context

## 查询表单
查询表单一般是横向排列的，常见的操作是查询和重置

<ExampleDoc>
<UseFormQuery>
</UseFormQuery>
<template #code>

<<< @/examples/useForm/query.js

</template>
</ExampleDoc>

## 新增/更新表单

新增/更新表单一般是垂直排列，场景的操作是保存、清空和重置

<ExampleDoc>
<UseFormEdit>
</UseFormEdit>
<template #code>

<<< @/examples/useForm/edit.js

</template>
</ExampleDoc>

<!-- ## 多列表单

<ExampleDoc>
<UseFormColEdit>
</UseFormColEdit>
<template #code>

<<< @/examples/useForm/colEdit.js

</template>
</ExampleDoc> -->


## 表单联动

表单联动可使用下面三个属性，可以作用于ComponentDesc组件描述和Fields字段上：

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
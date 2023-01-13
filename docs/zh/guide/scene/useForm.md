---
sidebarDepth: 3
---
# useForm
在curd中出现表单场景是查询表单、新增表单、更新表单。表单的关键就是字段，所以useForm通过传入的字段定义`Filed`，就可以获得表单的render函数，并对表单的常见操作提供了支持，比如
- 表单布局
- 表单校验
- 表单重置
- 表单提交
- 表单初始化
- 表单联动

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

## 表单校验

<ExampleDoc>
<UseFormValidate>
</UseFormValidate>
<template #code>

<<< @/examples/useForm/validate.js

</template>
</ExampleDoc>


## 表单操作

<ExampleDoc>
<UseFormValidate>
</UseFormValidate>
<template #code>

<<< @/examples/useForm/validate.js

</template>
</ExampleDoc>


## 表单联动

表单联动可使用下面三个属性，可以作用于ComponentDesc组件描述和Fields字段上：

- vIf：是否渲染
- vShow：是否显示
- disabled：是否可用

类型是：`Ref<boolean> | boolean | When`，如下面例子所示：
1. 字段性别上的`vIf: when('!!name')`, 表示当字段name不为空时，渲染性别字段。
2. 保存按钮的`disabled: when(() => ctx.modelRef.value.age <= 0)`，表示年龄age>0时，可保存按钮可点击。
3. 审核按钮的`vShow: showCheck`，其中showCheck时一个Ref，根据Ref的值，判断审核按钮是否显示，判断age大于18岁时，不需要提交审核

其中when接受字符串表达式和函数，更多了解请参考[When](./when.md)

<ExampleDoc>
<UseFormRelation>
</UseFormRelation>
<template #code>

<<< @/examples/useForm/relation.js

</template>
</ExampleDoc>
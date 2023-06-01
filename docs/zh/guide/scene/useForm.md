---
sidebarDepth: 3
---
# useForm
在curd中出现表单场景是查询表单、新增表单、更新表单。

useForm根据传入的字段定义创建表单场景

```js
const ctx = useForm({ fields: [ { name: 'user', label: '用户' } ] })
ctx.initFields({ user: 'test' })

ctx.modelRef.value.user; // test

ctx.render // 渲染函数

```

对表单的常见操作也提供了支持，比如：

- 表单布局
- 表单校验
- 表单重置
- 表单提交
- 表单初始化
- 表单联动

## API

### 参数

- ctx：指定上下文
- form：form组件
- fields：表单字段定义

```js
export interface FormSceneConfig extends SceneConfig {
    ctx: FormSceneContext;
    form?: ComponentDesc;
    fields: Field[];
}
```

### 返回

- formRef：表单组件实例引用
- initFields：初始化字段值
- resetFields：重置为最近一次初始化的值
- setFields： 设置表单值
- clearValidate：清空校验
- validate：校验

```js
export interface FormSceneContext extends SceneContext {
    formRef: Ref;
    initFields: (values: Record<string, unknown>, name?: string) => void;
    resetFields: () => void;
    setFields: (values: Record<string, unknown>, name?: string) => Record<string, unknown>;
    clearValidate: () => void;
    validate: (names?: string[]) => Promise<unknown>;
}
```

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


## 表单联动

表单联动可使用下面三个属性，可以作用于ComponentDesc组件描述和Fields字段上：

- vIf：是否渲染
- vShow：是否显示
- disabled：是否可用

类型是：`Ref<boolean> | boolean | When`，如下面例子所示：
1. 字段性别上的`vIf: when('!!name')`, 表示当字段name不为空时，渲染性别字段。
2. 保存按钮的`disabled: when(() => ctx.modelRef.value.age <= 0)`，表示年龄age>0时，可保存按钮可点击。
3. 审核按钮的`vShow: showCheck`，其中showCheck时一个Ref，根据Ref的值，判断审核按钮是否显示，判断age大于18岁时，不需要提交审核

其中when接受字符串表达式和函数，更多了解请参考[When]

<ExampleDoc>
<UseFormRelation>
</UseFormRelation>
<template #code>

<<< @/examples/useForm/relation.js

</template>
</ExampleDoc>
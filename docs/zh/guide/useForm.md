---
sidebarDepth: 3
---
# useForm

用于最基础的纯表单场景

<ExampleDoc>
<UseForm>
</UseForm>
<template #code>

<<< @/examples/UseForm.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法参数

- **fields**

表单所有字段的定义，类型：`Array<Field>`

- **type**

用于判断当前表单Meta的解析，类型：ACTION_TYPES，可取值为：`query` `insert` `update` `delete` `view`
## 返回结果
- **formRef**

Form组件的实例，一般Form组件都会包含validate、resetFields方法，实际要看依赖的组件库。
- **model**

双向绑定的model对象，其属性都是Meta定义解析的字段，可以通过setFields来进行赋值。

- **rulesRef**

根据Meta解析的字段校验规则。

- **setFields**

设置model的值

- **initFields**

设置初始化的数据，并且初始化model

- **resetFields**

用上一次initFields的值，重置model
```js
initFields({ name: '蒙奇·D·路飞', age: 16 });
setFields({ age: 18 });
resetFields(); // model.age => 16
```

- **validate**

根据表单组件的规则校验字段

- **formItemRender**,

render表单项的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数，可以自己写Form去包裹
```vue
<template>
    <Form>
        <KoalaForm :render="formItemRender"></KoalaForm>
    </Form>
</template>
```

- **render**,

render表单的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数

## Render slots
`preset.formItemFieldRender`虽然提供了常见字段类型的render，但是特殊情况下，需要支持自定义扩展字段，而render函数的参数slots提供了支持。

| slot name    | 说明                    | 参数               |
| ------------ | ----------------------- | ----------------- |
| `[key]`  | 字段formItem的内容，全部表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `formItem_[key]`  | 字段formItem的内容，指定类型表单生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `[type]_formItem_[key]`  | 字段的的FormItem，全部表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `[type]_[key]`  | 字段的的FormItem，指定类型表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `extend_items`  | 在Form内扩展FormItem | `{ type, model }` |

**参数**
- type：操作表单类型，ACTION_TYPES
- model：表单的model对象
- rulesRef：字段校验规则
- props：Field.props
- disabled：是否可用
- options：Field.optionsKey或者Meta.optionsRef解析的枚举数组

:::tip
关于form-item相关的slots解析优先级如下：

`[type]_[key]` > `[type]_formItem_[key]` > `[key]` > `formItem_[key]` > `preset.formItemFieldRender`

如果没有字段没有对应的slot，那么`preset.formItemFieldRender`就会根据Meat.type来渲染。

:::

<ExampleDoc>
<UseFormSlots>
</UseFormSlots>
<template #code>

<<< @/examples/UseFormSlots.vue
</template>
</ExampleDoc>
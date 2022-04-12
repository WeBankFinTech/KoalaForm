---
sidebarDepth: 3
---
# useForm

用于最基础的纯表单场景，你可以通过字段定义解析出表单的字段，通过render也可以直接渲染表单，支持：
- 自定义字段渲染
- 按类型自动映射字段的表单组件
- 字段校验规则
- 枚举类型解析
- 初始化/设置值


<ExampleDoc>
<UseForm>
</UseForm>
<template #code>

<<< @/examples/UseForm.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法定义
### useForm
```ts
export interface UseFormResult {
    model: ReactiveModel;
    formRef: Ref<any>;
    /**
     * @deprecated 请使用rules, 将在1.2.0版本移除
     */
    rulesRef: ReactiveModel;
    rules: ReactiveModel;
    formProps: ReactiveModel;
    render: KoalaFormRenderFunction;
    formItemRender: KoalaFormRenderFunction;
    initFields: (fields?: Record<string, any>) => void;
    resetFields: (fields?: Record<string, any>) => void;
    validate: (nameList?: string[] | undefined) => Promise<any>;
    setFields: (value: Record<string, any>) => void;
    setFormProps: (props: Record<string, any>) => void;
}

function useForm(fields: Field[] | undefined, type: ACTION_TYPES): UseFormResult;

```
### 参数说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| fields | 表单所有字段的定义 | `Array<Field>` |
| type | 用于判断当前表单Field的解析 | `ACTION_TYPES`，可取值为： `query` `insert` `update` `delete` `view` |

### 返回说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| formRef | Form组件的实例，一般Form组件都会包含validate、resetFields方法，实际要看依赖的组件库。| `Ref`
| model | 双向绑定的model对象，其属性都是Field定义解析的字段，可以通过setFields来进行赋值。| `ReactiveModel`
| rules | 根据Field解析的字段校验规则。| `ReactiveModel`
| formProps | form组件属性响应式对象，用setFormProps设置| `ReactiveModel`
| setFields | 设置model的值 | `Function`
| initFields | 设置初始化的数据，并且初始化model| `Function`
| resetFields | 用上一次initFields的值，重置model | `Function`
| validate | 根据表单组件的规则校验字段| `Function`
| setFormProps | 设置formProps的值| `Function`
| formItemRender | render表单项的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数，可以自己写Form去包裹| `Function`
| render | render表单的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数 | `Function`


- **resetFields示例**

```js
initFields({ name: '蒙奇·D·路飞', age: 16 });
setFields({ age: 18 });
resetFields(); // model.age => 16
```

- **formItemRender示例**

```vue
<template>
    <Form>
        <KoalaForm :render="formItemRender"></KoalaForm>
    </Form>
</template>
```

## Render slots
`preset.formItemFieldRender`虽然提供了常见字段类型的render，但是特殊情况下，需要支持自定义扩展字段，而render函数的参数slots提供了支持。

| slot name    | 说明                    | 参数               |
| ------------ | ----------------------- | ----------------- |
| `[key]`  | 字段formItem的内容，全部表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `formItem_[key]`  | 字段formItem的内容，指定类型表单生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `[type]_formItem_[key]`  | 字段的的FormItem，全部表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `[type]_[key]`  | 字段的的FormItem，指定类型表单都生效 | `{ type, model, rulesRef, props, disabled, options }` |
| `extend_items`  | 在Form内扩展FormItem | `{ type, model }` |
| `[type]_extend_items`  | 在Form内扩展指定类型的FormItem，可覆盖`extend_items` | `{ model }` |

**参数**
- type：操作表单类型，ACTION_TYPES
- model：表单的model对象
- rulesRef：字段校验规则
- props：Field.props
- disabled：是否可用
- options：Field.enumsName或者Field.options解析的枚举数组

:::tip
关于form-item相关的slots解析优先级如下：

`[type]_[key]` > `[type]_formItem_[key]` > `[key]` > `formItem_[key]` > `preset.formItemFieldRender`

如果没有字段没有对应的slot，那么`preset.formItemFieldRender`就会根据Field.type来渲染。

:::

<ExampleDoc>
<UseFormSlots>
</UseFormSlots>
<template #code>

<<< @/examples/UseFormSlots.vue
</template>
</ExampleDoc>
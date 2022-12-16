---
sidebarDepth: 2
---

# 字段描述

在表单和列表场景中，关键的定义就是字段，用Field来描述字段。
```ts
export interface Field {
    label?: string;
    name?: string;
    type?: ValueType;
    vIf?: Ref<boolean> | boolean | When;
    vShow?: Ref<boolean> | boolean | When;
    options?: Ref<EnumOption[]> | EnumOption[] | ((model: any) => Promise<EnumOption[]>);
    props?: Reactive;
    defaultValue?: any;
    rules?: Array<ValidateRule>;
    required?: boolean;
    components?: ComponentDesc | ComponentDesc[];
    slotName?: string;
    format?: (model: any, value: any, scheme: Scheme) => VNodeChild | string;
}
```

如下面定义了表单的和列表的字段

<ExampleDoc>
<BaseField>
</BaseField>
<template #code>

<<< @/examples/base/field.jsx

</template>
</ExampleDoc>

## 表单字段
label - 定义表单字段说明，支持响应式

name - 定义表单字段名

defaultValue - 是默认值，也是重置的值

components - 指定字段的组件。

```js

const labelRef = ref('姓名')

const nameField = {
    name: 'name', // model.name可以访问到值
    label: labelRef, // 表单项的名称
    defaultValue: '蒙奇·D·路飞', // 默认值
    components: { // 如果components是数组，取第一个作为字段的组件
        name: ComponentType.Input, // 表单组件是输入框
    },
}
```

## 列表字段
label - 列标题，支持响应式

name - 列字段名

```js
const nameField = {
    name: 'name', // 列字段
    label: '姓名', // 列标题
}
```


## 字段规则
required、rules用于定义字段的校验规则，required为true时，会解析成rule: `{ require: true, message: '必填项', type: field.type }`

type则可以指定字段的值类型，使得校验类型准确。

表单上下文提供validate、clearValidate控制表单的校验。

```js

const nameField = {
    name: 'name',
    required: true, // 要求必填项
}

const form = useForm({ fields: [nameField] });

form.validate() // 校验表单

form.clearValidate() // 清空校验态

```

## 控制渲染、属性、插槽
和组件描述的一样，[看这里](./form)


## options增强
常见的select、radio、checkbox，都是提供可以选择的枚举项，在表单中，不仅可以通过组件的属性props提供options，还可以通过Field的options增强，除了响应式外，还支持异步函数。

而在列表或者在查看字段的时，需要把字段的值映射成枚举的描述，format可以返回渲染的结果。

```js

const options = [
    { value: '0', label: '女' },
    { value: '1', label: '男' },
]
const sexField = {
    name: 'sex',
    components: {
        name: ComponentType.Select,
    },
}

sexField.components.props = { options } // 通过属性设置

sexField.options = options // 直接设置

const options = ref([])
sexField.options = options // 响应式设置

sexField.options = async () => {
    return await request('/api/get') // 异步函数设置
}

sexField.format = formatByOptions // 通过options格式化显示

```

## format
自定义的内容的方式除了slotName外，Field还提供了format的方式，内部提供了常用的options格式和时间格式化

::: tip 渲染优先级
format > slotName > components
:::

```jsx

// 枚举
const sexField = {
    name: 'sex',
    format: formatByOptions
}

// 时间
const dateField = {
    name: 'date',
    format: genFormatByDate('YYYY-MM-DD')
}

// 时间范围
const dateRangeField = {
    name: 'dates',
    format: genFormatByDate('YYYY-MM-DD', { startName: 'start', endName: 'end' })
}

const customFiled = {
    name: 'custom',
    format: (model: any, value: any, scheme: Scheme) => <div>当前值-{{value}}<div>
}

```

## 列表事件
往列表添加一列操作栏，对事件进行了增强，事件的第一个参数返回了行数据
::: warning 关于行数据
行数据是列渲染的slot参数，跟UI框架提供的一致。
:::

```js
useTable({ fields: [
    { name: 'name', label: '姓名' },
    {
        label: '操作',
        components: {
            name: ComponentType.Button,
            children: '删除',
            props: { type: 'link' },
            events: {
                onClick(record) { // 第一个参数是行数据
                    const { rowIndex } = record;
                    table.model.value.splice(rowIndex, 1);
                },
            },
        },
    },
] })
```





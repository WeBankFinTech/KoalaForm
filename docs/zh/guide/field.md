# Field

**`Field`** 是用于描述一个字段该如何处理。同一个字段会用在很多地方，比如用户名可以在查询表单、列表中等，Field 就是对该字段描述，一次定义多处使用。如下表列表了对一个字段的描述能力


## 基础属性

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| status | 字段状态 | `FIELD_STATUS_TYPE` |
| name | 字段名称| `string` |
| label | 字段对应的描述 | `string` |
| type  | 字段在表单中类型，用于判断渲染对应的组件 | `string` |
| required | 字段在表单中是否必填 | `boolean` | false
| rules | 字段在表单中的校验规则 | `Array` `Object` |
| props | 字段在表单组件的属性 | `Object` |
| enumsName | 用于获取options枚举项的名字 | `string` |
| options | 动态options，用于像select之类的枚举组件 | `array/Ref<array>/Promise<array>` |
| span | form-item栅格占比，共24，query模块默认6，也就是一行可以放4个查询条件 | `number` |


::: tip
`FIELD_STATUS_TYPE` 用于判断渲染对应的表单控件，可取值有

 `text` `input` `number` `select` `date` `dateTime` `dates` `dateTimes` `radio` `checkbox` `switch` `time`
 
其他类型组件的扩展支持，依赖于preset的实现
:::

## 模块属性

默认继承所有基础属性

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| query | 在 query 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` | `{ status: false, span: 6 }`
| table | 在 table 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` | 
| insert | 在 insert 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` | `{ status: false, span: 24 }`
| update | 在 update 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` | `{ status: false, span: 24 }`
| delete | 在 delete 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` |
| view | 在 view 模块的配置，值为非 `false` 时启用  | `boolean`、 `Object` | `{ status: false, span: 24 }`

## 模块忽略属性
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| queryIgnore | 在 query 中忽略的属性  | `Array<string>` | `['required', 'rules']`
| tableIgnore | 在 table 中忽略的属性  | `Array<string>` | `['required', 'rules']`
| insertIgnore | 在 insert 中忽略的属性  | `Array<string>` |
| updateIgnore | 在 update 中忽略的属性  | `Array<string>` |
| deleteIgnore | 在 delete 中忽略的属性  | `Array<string>` |
| viewIgnore | 在 view 中忽略的属性  | `Array<string>` |

## 属性合并规则
为了减少重复定义，采取基础属性 + 语法糖属性 + 对应模块属性 + 对应模块忽略属性合并的规则如下：
- 根据模块忽略属性的字段，移除基础属性
- 移除后的基础属性跟对应的模块属性做合并，模块属性将覆盖基础属性

假如某页面定义如下：
```js
const fields = defineFields([
    { name: 'id', label: 'ID', view: true, update: { status: 'disabled' } },
    { name: 'name', label: '姓名', required: true, status: true },
    { name: 'age', label: '年龄', type: 'number', status: true },
    { name: 'actions', label: '操作', table: { props: { width: 220 } } },
]);
```
合并后解析如下：
- id 在view可见、在update表单中disabled，在其他模块model不存在属性id。
- name 所有的模块都可见，但是required在insert、update上才有小，因为其他模块默认忽略required、rules属性
- age 所有模块可见
- actions 仅仅在table中可见


## 方法
- **defineFields(fields: Field[]): Field[]**

定义字段

- **travelFields(fields: Field[], type: string, cb: (field: BaseField)**

根据类型遍历字段

## 例子
拿我们上手的例子来看看
- id 不会在查询和新增表单中展示，在更新表单中不能编辑
- name 在所有的场景都可用，在新增和更新表单中需要必填
- age 在所有的场景都可用，在表单中由preset解析，一般会解析成数字输入组件


<ExampleDoc>
<User>
</User>
<template #code>

<<< @/examples/User.vue
</template>
</ExampleDoc>
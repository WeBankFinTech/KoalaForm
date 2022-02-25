# Field

**`Field`** 是用于描述一个字段该如何处理。同一个字段会用在很多地方，比如用户名可以在查询表单、列表中等，那么Field就是对该字段描述，一次定义多处使用。如下表列表了对一个字段的描述能力

### Field属性

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| status | 字段状态，控制字段在表单中的状态 | `Object` |
| - query | 在查询表单的状态 | `FIELD_STATUS_TYPE` | false
| - table | 在table的状态 | `FIELD_STATUS_TYPE` | false
| - insert | 在新增表单的状态 | `FIELD_STATUS_TYPE` | false
| - update | 在更新表单的状态 | `FIELD_STATUS_TYPE` | false
| - delete | 在删除表单的状态 | `FIELD_STATUS_TYPE` | false
| - view | 在详情表单的状态 | `FIELD_STATUS_TYPE` | false
| key | 字段的model属性名，一般跟api接口保持一致 | `string` |
| label | 字段对应的描述 | `string` |
| type  | 字段在表单中类型，用于判断渲染对应的组件 | `string` |
| required | 字段在表单中是否必填 | `boolean` | false
| rules | 字段在表单中的校验规则 | `Array` `Object` |
| rulesUse | 字段校验规则在哪些表单生效 | `Array<string>` | `['insert', 'update']`
| props | 字段在表单组件的属性 | `Object` |
| propsUse | 属性在哪些表单生效 | `Array<string>` | `['all']`
| colProps | 字段在table组件的列属性 | `Object` |
| optionsKey | 静态项获取的key，用于preset.getOptions | `string` |
| optionsRef | 动态options，用于像select之类的枚举组件 | `Ref<any>` |
| dateFormate | 日期类型的转换格式 | `string` |

:::tip
`FIELD_STATUS_TYPE` 的类型有这些：
- true：model中有该字段、视图会展示
- false：字段忽略
- 'hidden'：model中有该字段、但视图不会展示
- 'disabled'：model中有该字段、但视图只能看，不能编辑
:::

### 例子
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
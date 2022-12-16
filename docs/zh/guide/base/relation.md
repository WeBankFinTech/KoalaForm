---
sidebarDepth: 2
---

# 联动基础
在表单中经常会有多个字段相互关联，在组件和字段的定义都提到了vIf、vShow和disabled，他们支持的类型都是

`Ref<boolean> | When | boolean`

可以使用它们实现字段间的联动。

## vIf、vShow

vIf等价于vue模板指令`v-if`，如果是false时，则不渲染组件或者字段。

vShow等价于vue模版指令`v-show`，如果是false时，则不显示渲染的组件或字段。

```js

const btn = { name:  ComponentType.Button, vIf: false }

const showName = ref(false);
const nameFiled = { label: '姓名', name: 'name', vIf: showName } // 不渲染

const showAge = ref(false);
const ageFiled = { label: '年龄', name: 'age', vShow: showAge } // 渲染，不显示

```

## disabled
disabled等价于组件的属性props.disabled，比如按钮disabled为true是不能点击。
::: warning
存在disabled属性的组件才会生效。
:::

```js

const disabled = ref(true)
const btn = { name:  ComponentType.Button, disabled: disabled } // 按钮无法点击

```

## 响应式联动
假如接受的值是`Ref<boolean>`时，意味可以动态的去控制组件或字段的显示。
```js
const { ctx } = useSceneContext(['form']) 

// 存在id时，是更新表单
const isForUpdate = computed(() => ctx.model.id)

// 是否成人
const isAdult = computed(() => cxt.model.age >= 18)

useForm({ ctx, fields: [
    { label: 'ID', name: 'id', vIf: isForUpdate }, // 更新表单才显示
    { label: '姓名', name: 'name', components: { name: ComponentType.Input, disabled: isForUpdate }  }, // 更新表单不能修改名称
    { label: '年龄', name: 'age', components: { name: ComponentType.InputNumber }  },
    { label: '职业', name: 'work', vShow: isAdult, components: { name: ComponentType.Input} }, // 成人可以填写职业
] })
```

## when联动
when是一个函数，接受字符表达式或者函数

- 字符表达式，可以根据当前上下文的modal属性来编写表达式，比如age >= 18
- 函数，函数内部可以写响应式的变量去判断，返回true/false。

::: tip
字符表达式的变量只能是当前上下文的model属性。
:::

```jsx
const { ctx } = useSceneContext(['form']) 

// 存在id时，是更新表单
const isForUpdate = when('!!id');

// 是否成人
const isAdult = when(() => cxt.model.age >= 18);

useForm({ ctx, fields: [
    { label: 'ID', name: 'id', vIf: isForUpdate }, // 更新表单才显示
    { label: '姓名', name: 'name', components: { name: ComponentType.Input, disabled: isForUpdate }  }, // 更新表单不能修改名称
    { label: '年龄', name: 'age', components: { name: ComponentType.InputNumber }  },
    { label: '职业', name: 'work', vShow: isAdult, components: { name: ComponentType.Input} }, // 成人可以填写职业
] })
```

## props联动
组件的属性props是支持响应式的，因为也可以做联动

```js

const { ctx } = useSceneContext(['form']) 

const styleRef = computed(() =>( { color: ctx.model.age >= 18 'red' : '' })) // 单个属性值响应式

const propsRef = computed(() => ({ // 整个属性响应式
    disabled: !cxt.model.name
}));

useForm({ ctx, fields: [
    { label: '姓名', name: 'name', components: { name: ComponentType.Input, props: propsRef }  },
    { label: '年龄', name: 'age', components: { name: ComponentType.InputNumber }  },
    { label: '职业', name: 'work', components: { name: ComponentType.Input , props: { style: styleRef }} },
] })

```

## 联动扩展
联动主要是靠响应式的实现，因此需要扩展其他方式的表单联动可以通过解析组件或者字段的定义来实现，具体可参考[插件]()



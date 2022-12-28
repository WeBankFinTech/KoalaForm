---
sidebarDepth: 3
---

# 组件描述

在场景中，使用ComponentDesc定义场景的结构树。
```ts
export interface ComponentDesc {
    name: string;
    props?: Reactive;
    vIf?: Ref<boolean> | When | boolean;
    vShow?: Ref<boolean> | When | boolean;
    disabled?: Ref<boolean> | When;
    events?: Record<string, (value: any, ...args: any[]) => void>;
    slotName?: string;
    children?: Array<string | ComponentDesc | SceneContext> | string | ComponentDesc | SceneContext;
}
```

如下面定义场景的组件树

<ExampleDoc>
<BaseComp>
</BaseComp>
<template #code>

<<< @/examples/base/comp.js

</template>
</ExampleDoc>

## 类型
通过name指定组件的节点类型，可以是标准的dom元素类型，如a、div，也可以是组件库的组件名，由ComponentType提供支持。
```js

const div = { name: 'div' }

const btn = { name:  ComponentType.Button }

```

## 属性
由props设置组件属性，支持响应式的动态属性。
```js

const disabled = ref(true); // 响应式属性

const btn = { name:  ComponentType.Button, props: { type: 'primary', disabled } }

// 样式属性
const div = { name: 'div', props: { class: 'box', style: { color: 'red' } } }

```

## 控制渲染
vIf、vShow、disabled支持多种方式控制渲染结果实现联动，更详细的使用可参考[联动基础](./relation)
```js

const vShow = ref(true)
const model = reactive({ age: 12 })
const btn = {
    vIf: true, // 默认是true，
    vShow, // 默认是true，这里指定响应式方式控制
    disabled: when(() => model.age <= 18) // when条件控制
}

```

## 绑定事件
通过events可以绑定组件的事件
```js

const input = {
    name: ComponentType.Input,
    events: {
        onClick: evt => {}, // 点击事件
        onChange: evt => {}, // 改变事件
        // ...更多 
    }
}

```

## 插槽
slotName可指定插槽，实现自定义的扩展内容，slots对象有上下文render传入
::: tip
slotName指向的是默认插槽，如果需要传入组件的其他名称插槽，那么通过`[slotName]__[组件的插槽名]`规则传入，所以`[slotName]`也等价于`[slotName]__default`
:::

```jsx
const modal = {
    name: ComponentType.Modal,
    slotName: 'test'
}

// jsx
const slots = {
    test: () => 'modal内容' // 默认插槽
    test__footer: () => <button>确定</button> // 组件的footer插槽
}

const ctx = useScene({ components: modal })

ctx.render(slots) // 渲染

// template
<KoalaRender :render="ctx.render">
    <template name="test">modal内容</template>
    <template name="test__footer"><button>确定</button></template>
</KoalaRender>
```

## 嵌套子组件
children属性可进添加组件的子组件，形成组件树。
::: tip 插槽优先级
当插槽提供了默认插槽后，将会覆盖子组件的渲染
:::
```js
const div = {
    name: 'div',
    children: [
        { name: ComponentType.Input }
    ]
}
```

## 嵌套子场景
children还支持嵌套子场景，传入被嵌套的场景上下文将会被渲染到组件默认插槽上。
```js
const form = useForm({ fields: [] })

const modal = {
    name: ComponentType.Modal,
    children: form
}

const modal = useScene({ components: modal }) 

```





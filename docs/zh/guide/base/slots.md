---
sidebarDepth: 2
---

# 自定义渲染
自定义渲染可通过slotName和format实现。

slotName使用可参考[组件描述/插槽](./component.md#插槽)

format使用可参考[字段描述描述/format](./field.md#format)

## 渲染优先级
如果同时存在format、slotName、children、components，那么优先级低的将不会渲染。

优先级时 format > slotName > (children = components)

```js
const name = {
    label: '姓名',
    name: 'name',
    format: () => 'test',
    slotName: 'name',
    components: { name: 'input' }
}
// 只会渲染format的内容

const name2 = {
    name: 'div',
    slotName: 'name',
    children: [
        { name: 'div', 'test' }
    ]
}
const { render } = useScene({ components: [name2] })
render({
    name: () => 'slot test'
})
// 只会渲染slotName的内容

```

## KoalaRender
KoalaRender组件用于渲染场景上下文，方便在template中编写slot。

<ExampleDoc expanded>
<BaseSlotRender>
</BaseSlotRender>
<template #code>

<<< @/examples/base/slotRender.vue

</template>
</ExampleDoc>
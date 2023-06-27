---
sidebarDepth: 2
---

# 事件基础
可以通过`ComponentDesc`的属性events绑定事件。

## 绑定事件
events是对象，属性名为事件名，约定事件名为`on[事件名]` 如：
- onClick
- onChange
- onInput
- onSelect

::: tip 事件回调参数
事件的回调参数和组件的事件回调参数一致，依赖于组件库。
:::

```js

const btn = { name:  ComponentType.Button, events: {
    onClick: (event) => {}
} }

const select = { name:  ComponentType.Select, events: {
    onChange: (value) => {},
    onBlur: (event) => {}
} }


```

## 增强列表事件
在列表里面响应事件，一般需要获取当前事件触发的行数据，比如点击编辑/删除按钮，需要取到行的ID等数据，因此对于列表里面的事件回调，参数的顺序是：
- 列表 Column Slot的参数
- 绑定组件的事件参数

```js

useTable({ fields: [
    { label: 'ID', name: 'id' },
    { label: '操作', components: {
        name: ComponentType.Button,
        children: ['删除'],
        events: {
            // // 第一个参数就是列插槽的参数，第一个参数是按钮组件的事件参数
            onClick: (record, event) => {}
        }
    }}
] })

```

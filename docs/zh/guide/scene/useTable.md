---
sidebarDepth: 3
---
# useTable

表格展示数据，最主要的就是字段定义、行数据操作和数据格式转换

useTable提供了一些能力，更好的使用表格。

```js
const ctx = useTable({
    fields: [ // 设置列表头 
        { name: 'user', label: '用户' },
        { name: 'date', label: '时间', format: gen },
        { label: '操作', slotName: 'options' }
    ]
})

// 设置数据
ctx.modelRef.value = [
    { user: '蒙奇·D·路飞', date: Date.now() }
];

ctx.render // 渲染函数

```
## API

### 参数

- ctx：指定上下文
- table：table组件
- fields：table字段定义

```js
export interface TableSceneConfig extends SceneConfig {
    ctx: TableSceneContext;
    table: ComponentDesc;
    fields: Field[];
}
```

### 返回

- ref：列表组件实例引用
- modelRef：列表数据，双向绑定

```js
export interface TableSceneContext extends SceneContext {
    ref: Ref;
    modelRef: Ref<Array<unknown>>;
}
```

## 更新数据

```js
const { modelRef } = useTable({ fields: [] })
modelRef.value = [{user: '111'}, { user: '2222' }]
```

## 修改table属性
```js
useTable({
    table: { props: { rowKey: 'id' } }
    fields: []
})

```

## 修改列属性
通过Field.props修改列属性，比如固定位置、宽度等
```js
useTable({
    fields: [
        { name: 'user', label: '用户', props: { fixed: 'left', width: 150 } },
    ]
})
```

## 自定义渲染数据
通过Field.format
```js

useTable({
    fields: [
        { name: 'user', label: '用户', format: (model, value) => value || '--' },
        { name: 'date', label: '时间', format: genFormatByDate() },
        { name: 'status', label: '状态', options: [] , format: formatByOptions },
    ]
})

```
通过slotName

```html
<template>
    <KoalaRender :render="render">
        <template #options>
            自定义操作
        </template>
    </KoalaRender>
</template>

<script setup>
    const { render } = useTable({
        fields: [
            { label: '操作', slotName: 'options' }
        ]
    })
</script>
```
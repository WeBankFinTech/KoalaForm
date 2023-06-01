---
sidebarDepth: 3
---
# 快速上手

## 创建vue3应用
```bash
npm init vue@latest
```
在项目被创建后，通过以下步骤安装依赖并启动开发服务器：
```bash
cd <your-project-name>
npm install
npm run dev
```

或者这里下载[Demo项目](index.md)

## 安装
安装`@koala-form/core`、`@koala-form/fes-plugin`
::: tip
@koala-form/core依赖vue3；@koala-form/fes-plugin依赖@fesjs/fes-design，请确保依赖已安装
:::

```bash
npm i @koala-form/core
npm i @fesjs/fes-design
npm i @koala-form/fes-plugin
```

## 全局设置
在入口app.js文件中

<<< @/examples/main.js

## 基础场景
<ExampleDoc expanded>
<StartedScene>
</StartedScene>
<template #code>

<<< @/examples/started/useScene.js
</template>
</ExampleDoc>

场景返回的render，会渲染场景定义的内容。

也在template中，可以使用KoalaRender组件渲染render。

<ExampleDoc expanded>
<StartedSceneVue>
</StartedSceneVue>
<template #code>

<<< @/examples/started/useScene.vue
</template>
</ExampleDoc>

## 表单这么写
表单使用useForm描述，fields是表单的字段定义，这里定义了字段部分属性：
- name 字段名，会作为字段的变量名
- label 字段描述，用于表单项的标签文本
- defaultValue 默认值，初始或者重置的值
- components: 字段的表单控件，用ComponentDesc进行描述

按钮也是用ComponentDesc进行描述，其中events是传入组件的响应事件。

在响应事件，可以调用一些内置的handler函数进行处理表单的处理，
比如`doResetFields`会将表单进行重置。

`cxt.modelRef`可以直接访问到表单响应式的model，可以进行更多的操作

了解更多关于useForm，请移步[这里](./scene/useForm.md)

<ExampleDoc expanded>
<StartedUseForm>
</StartedUseForm>
<template #code>

<<< @/examples/started/useForm.js
</template>
</ExampleDoc>


## 列表这么写
列表用useTable描述，和表单有点区别是fields是描述列表的列，
- name 字段名，映射行数据的key
- label 列名
- options 字段需要映射的枚举项
- format 该列的数据格式化显示
- components： 该列渲染为ComponentDesc描述的组件

::: tip
列表里面的按钮也是ComponentDesc进行描述，为了方便行操作，对events的响应事件做了增强处理，回调函数的第一个参数可以拿到行的数据
```js
events: {
    onClick: (record, event) => {
        // record只有在useTable下才会存在
        FMessage.success(record.row.name);
        console.log(record, event);
    },
},
```
:::

`cxt.modelRef`是table的响应式数据源，可以进赋值操作。

了解更多关于useTable，请移步[这里](./scene/useTable.md)

<ExampleDoc>
<StartedUseTable>
</StartedUseTable>
<template #code>

<<< @/examples/started/useTable.js
</template>
</ExampleDoc>

## 分页这么写
分页用usePager描述，属性pager是分页组件描述

`cxt.modelRef`是pager的响应式数据，可进行修改
- currentPage 当前页码
- totalCount 总数
- pageSize 页数量 

了解更多关于usePager，请移步[这里](./scene/usePager.md)

<ExampleDoc>
<StartedUsePager>
</StartedUsePager>
<template #code>

<<< @/examples/started/usePager.js
</template>
</ExampleDoc>

## 弹窗这么写
弹窗用useModal描述，

`cxt.modelRef`是pager的响应式数据，可进行修改
- show 是否显示
- title 标题

了解更多关于useModal，请移步[这里](./scene/useModal.md)

<ExampleDoc>
<StartedUseModal>
</StartedUseModal>
<template #code>

<<< @/examples/started/useModal.jsx
</template>
</ExampleDoc>

## 组合CURD
通过useForm、useTable、usePager、useModal基础场景可以组合出场景的curd表单页面。

为了使curd上手更容易，在@koala-form/fes-plugin中也提供了组合场景 [useCurd](../ui/fes.md#usecurd)

<ExampleDoc>
<StartedUseCurd>
</StartedUseCurd>
<template #code>

<<< @/examples/started/useCurd.js
</template>
</ExampleDoc>

---
sidebarDepth: 3
---
# 快速上手

## 安装
安装`@koala-form/core`、`@koala-form/preset-fesd`
::: tip
@koala-form/core依赖vue3；@koala-form/preset-fesd依赖@fesjs/fes-design，请确保依赖已安装
:::

```bash
npm i vue@3.0.7
npm i @koala-form/core
npm i @fesjs/fes-design
npm i @koala-form/preset-fesd
```

## 使用预设
在入口文件中

<<< @/examples/main.js


## 表单这么写

<ExampleDoc>
<StartedUseForm>
</StartedUseForm>
<template #code>

<<< @/examples/started/useForm.js
</template>
</ExampleDoc>


## 列表这么写

<!-- <ExampleDoc>
<StartedUseTable>
</StartedUseTable>
<template #code>

<<< @/examples/started/useTable.js
</template>
</ExampleDoc> -->

## 写一个用户表单试试
实现如下一个用户的表单的CURD操作，通过定义字段名和配置，仅需几十行代码就可以实现完成的一个表单功能。

<!-- <ExampleDoc>
<Test>
</Test>
<template #code>

<<< @/examples/User.vue
</template>
</ExampleDoc> -->


这个表单场景太简单了，实际的业务上会有各种复杂的表单，**Koala Form**也能支持吗？

那是自然的，**Koala Form**提供了这些灵活的能力：
- **表单重组：** 基础表单（useForm）、带操作的表单（useFromAction）、模态框表单（useModal）、查询表单（useQuery）、列表（useTable）、完整的表单页面（usePage），可以自由选择组合到你的页面中，满足的更复杂的业务。

- **Slot：** 每个字段域都会提供对应的slot，特殊的字段域，你可以用slot来覆盖默认的渲染。

- **仅逻辑：** 每个use都会导出相应的model、操作方法及render，如果render的效果与需求的差异大，你可以自己实现自己的render。

- **Preset：** 提供Preset扩展，你可以自定义自己的Preset，也可以继承已有的Preset再扩展。

为了更好的掌握这些灵活性，让我们学习下设计原理。
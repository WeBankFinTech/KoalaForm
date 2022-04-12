---
sidebarDepth: 3
---
# useQuery

用于查询表单和列表展示，由useFormAction和useTable组合而成。

<ExampleDoc>
<UseQuery>
</UseQuery>
<template #code>

<<< @/examples/UseQuery.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法定义
### useQuery
```ts
export interface UseQueryResult {
    /**
     * @deprecated 请使用formAction，将在1.2.0版本移除
     */
    query: UseFormActionResult;
    formAction: UseFormActionResult;
    table: UseTableResult;
    render: KoalaFormRenderFunction;
}

function useQuery(fields: Array<Field>, config: Config): UseQueryResult

```

### 参数说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| fields | 表单所有字段的定义 | `Array<Field>` |
| config | 操作配置| `Config` |

### 返回说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| formAction | useFormAction的操作对象 | `UseFormActionResult`
| table | useTable的操作对象 | `UseTableResult`
| render | render列表的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数 | `KoalaFormRenderFunction`

- **render**

render由query.render和table.render一起渲染

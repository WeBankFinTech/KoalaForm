---
sidebarDepth: 3
---
# useFormAction

基于useForm添加了数据请求操作的表单

<ExampleDoc>
<useFormAction>
</useFormAction>
<template #code>

<<< @/examples/useFormAction.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法定义
### useFormAction
```ts
export interface UseFormActionResult {
    form: UseFormResult;
    /**
     * @deprecated 请使用    actionRespRef，将在1.2.0版本移除
     */
    respModel: Ref<Record<string, any> | null>;
    /**
     * @deprecated 请使用actionErrorRef，将在1.2.0版本移除
     */
    errorRef: Ref<Record<string, any> | null>;
    actionRespRef: Ref<Record<string, any> | null>;
    actionErrorRef: Ref<Record<string, any> | null>;
    handleAction: HandleActionFunction;
    handleReset: () => void;
    render: KoalaFormRenderFunction;
}

function useFormAction(fields: Array<Field>, config: Config, type: ACTION_TYPES): UseFormActionResult

```

### 参数说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| fields | 表单所有字段的定义 | `Array<Field>` |
| config | 操作配置| `Config` | 
| type | 用于判断当前表单Field的解析，可取值为：`query` `insert` `update` `delete` `view` | `ACTION_TYPES` | 

### 返回说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| form | useForm返回的表单的操作对象 | `UseFormResult`
| actionRespRef | 处理操作handle的方法调用接口返回结果，如果config有对应的success处理，那么就是success返回的结果 | `Ref<Record<string, any>>`
| actionErrorRef | 处理操作handle的方法执行错误，包括config对应的before、success的抛错、字段校验错误等。| `RRef<Record<string, any>>`
| handleAction | 执行表单处理的方法，请求对应的接口，返回处理后的接口数据。回调config配置的执行前（before）、执行成功（success）、执行错误（error），一般用于处理数据适配| `HandleActionFunction`
| handleReset | 分页组件重置表单，如果是查询表单，会而外的重新调用handle。| `Function`
| render | 渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数 | `Function`

- **actionRespRef示例**
```js
// watch respModel可以拿到接口成功的数据
watch(actionRespRef, () => {
    // to do
});
```

- **handleAction示例**

```js
// config配置handleAction的回调
// handleAction会回调config配置的执行前（before）、执行成功（success）、执行错误（error），一般用于处理数据适配。
const config = defineConfig({
    uniqueKey: 'id',
    query: {
        api: '/user.json',
        async before(params) { // 传递给查询接口之前，加上额外的参数userId
            params.userId = 'aringlai';
            return params;
        },
    },
    insert: {
        api: '/success.json',
        async success(res) {
            if (res?.code !== 0) { // 判断接口是否成功
                FMessage.error(res.message);
                throw new Error(res.message);
            }
        },
    },
});

```

## Render slots
render方表单渲染是调用`form.render`，而动作按钮时靠`preset.[type]ActionRender`的实现，一般建议实现调用handle和resetFields的按钮，并且提供可扩展的slots添加其他按钮，通过参数extendSlot传递给`preset.[type]ActionRender`。
| slot name    | 说明                    | 参数               |
| ------------ | ----------------------- | ----------------- |
| `[type]_action`  | 自定义操作 | `{ handleAction, handleReset  }` |
| `[type]_action_extend`  | `preset.[type]ActionRender`自定义扩展的内容 | `{ handleAction, handleReset  }` |

```vue
<!-- 基于koala-form-preset-fesd实现的slot -->
<template>
    <KoalaForm :render="insert.render">
        <template #insert_action_extend="{ handleAction, handleReset }">
            <FButton>清除</FButton>
        </template>
    </KoalaForm>
</template>

```
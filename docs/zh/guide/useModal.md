---
sidebarDepth: 3
---
# useModal
modal常见于新增、修改表单，基于useFormAction添加了modal的逻辑组合成了useModal

<ExampleDoc>
<UseModal>
</UseModal>
<template #code>

<<< @/examples/UseModal.vue

<<< @/examples/user.js

</template>
</ExampleDoc>

## 方法定义
### useModal
```ts
export interface UseModalResult {
    /**
     * @deprecated 请使用formAction，将在1.2.0版本移除
     */
    form: UseFormResult;
    formAction: UseFormActionResult;
    modalModel: ReactiveModel;
    modalProps: ReactiveModel;
    open: (data?: Record<string, any>) => Promise<void>;
    render: KoalaFormRenderFunction;
    handleOk: () => void;
    handleCancel: () => void;
    setModalProps: (props?: Record<string, any>) => void;
}

function useModal(fields: Array<Field>, config: Config, type: ACTION_TYPES, handleQuery?: Function | undefined): UseModalResult
```

### 参数说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| fields | 表单所有字段的定义 | `Array<Field>` |
| config | 操作配置| `Config` | 
| type | 用于判断当前表单Field的解析，可取值为：`query` `insert` `update` `delete` `view` | `ACTION_TYPES` | 
| handleQuery | 用于查询表单提交成功时，需要刷新列表数据的回调 | `Function` | 

### 返回说明

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| formAction | useFormAction的操作对象 | `UseFormActionResult`
| modalModel | modal组件绑定属性 | `ReactiveModel`
| modalProps | modal组件属性 | `ReactiveModel`
| setModalProps | 设置modalProps的值 | `Function`
| open | 打开modal | `Function`
| handleOk | 确认按钮调用的方法。 | `Function`
| handleCancel | 取消按钮调用的方法。 | `Function`
| render | render列表的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数 | `KoalaFormRenderFunction`

## Render slots
render方表单渲染是调用`form.render`，而modal是靠`preset.modalRender`的实现。
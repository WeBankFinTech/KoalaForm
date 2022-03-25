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

## 方法参数

- **fields**

表单所有字段的定义，类型：`Array<Field>`

- **config**

操作配置，类型：`Config`

- **type**

用于判断当前表单Field的解析，类型：ACTION_TYPES，可取值为：`query` `insert` `update` `delete` `view`

- **modalProps**

modal组件的属性响应式对象

- **handleQuery**

用于表单提交成功时，需要刷新列表数据的回调

## 返回结果
- **form**

useForm返回的表单的操作对象

- **modalModel**

modal组件绑定属性
```js
const modalModel = reactive({
    visible: false, // modal是否可见
    title: '', // 标题
    okText: '', // 确认按钮文字
    cancelText: '', // 取消按钮文字
});
```

- **handleOk**

确认按钮调用的方法。

- **handleCancel**

取消按钮调用的方法。

- **`open(data?: Record<string, any> | undefined):Promise<void>`**

打开modal，参数是设置form的数据，打开之前会调用`preset.modelFormatToEdit`去格式化数据，再传递给表单。

- **render(slots: Slots): VNodeChild**

render列表的渲染方法，在vue文件的template中可以借助KoalaForm组件渲染，接受Slots作为参数

- **setModalProps**

设置modalProps的值

## Render slots
render方表单渲染是调用`form.render`，而modal是靠`preset.modalRender`的实现。
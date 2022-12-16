---
sidebarDepth: 2
---

## 全局配置
在入口文件中，配置全局应用，比如插件、网络请求等。

<<< @/examples/main.js

## 使用表单场景
表单抽象为一个场景，使用useForm，可以快速的建立一个表单。
```js
useForm({ fields: [] })
```

## 添加字段
每个表单都包含多个字段，用于搜集用户输入，字段的表现有各种形式，比如输入框、下拉选择框、单选、多选等，使用Field描述表单的字段，定义字段的标签描述、属性名、默认值、组件等。
```js
const name = {
    name: 'name', // model.name可以访问到值
    label: '姓名', // 表单项的名称
    defaultValue: '蒙奇·D·路飞', // 默认值
    components: {
        name: ComponentType.Input, // 表单组件是输入框
    },
}

useForm({ fields: [name] })

```

## 添加操作
用户填写完表单后，会把数据提交给服务，所以我们需要给表单添加提交操作，需要用到ComponentDesc定义按钮的内容、属性和响应事件等。
```js

// ...
const submit = {                 
    name: ComponentType.Button, // 按钮组件
    children: ['提交'], // 按钮内容
    props: { type: 'primary' }, // 组件的属性
    events: {
        // 按钮的事件
        onClick: (event) => {
            console.log(event);
        },
    },
}

useForm({
    fields: [
        name,
        { // 添加一行，放置表单操作
            label: ' ',
            components: [submit]
        }
    ] 
})

```

## 上下文
useForm返回场景上下文，可以进行表单重置、校验、渲染等。
```js
// ...

const form = useForm({});

form.initFields({name: 'aring'}) // 初始默认值

form.resetFields() // 重置

form.validate() // 校验

form.render() // 渲染

```

## 多个表单
useSceneContext可以预创建上下文，同时有多个表单时，可以先创建上下文。
```js
const [form1, form2] = useSceneContext(['form1', 'form2']);
useForm({ cxt: form1 });
useForm({ cxt: form2 });
```

## 完整表单
场景上下文render方法可以渲染出表单。

<ExampleDoc>
<BaseForm>
</BaseForm>
<template #code>

<<< @/examples/base/form.js

</template>
</ExampleDoc>




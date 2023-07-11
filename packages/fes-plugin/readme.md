<p align="center">
  <a href="../../">
    <img alt="koala" width="250" src="https://koala-form.mumblefe.cn/logo.png
">
  </a>
</p>
<h1 align="center">Koala-Form</h1>

<div align="center">

低代码表单解决方案，让你跟考拉一样“懒”
</div>

-   使用文档 - [https://koala-form.mumblefe.cn/zh/ui/fes.html](https://koala-form.mumblefe.cn/zh/ui/fes.html)

## Install

```bash
npm i @koala-form/core
npm i @koala-form/fes-plugin
```

## Usage
注册全局插件
```js
import '@koala-form/fes-plugin';
import { installPluginPreset } from '@koala-form/core';

// 将依赖的插件安装到全局
installPluginPreset();
```
写一个简单的表单
```html
<template>
    <KoalaRender :render="render"></KoalaRender>
</template>

<script>
import { KoalaRender, useForm, ComponentType } from '@koala-form/core';

export default {
    components: { KoalaRender },
    setup() {
        const { render } = useForm({
            fields: [
                {
                    name: 'name', // modelRef.value.name可以访问到值
                    label: '姓名', // 表单项的名称
                    defaultValue: '蒙奇·D·路飞', // 默认值
                    components: {
                        name: ComponentType.Input, // 表单组件是输入框
                    },
                },
            ],
        });
        return {
            render
        };
    },
};
</script>
```


## 反馈
<p align="center">
  <!-- <a href="https://fes-design-4gvn317r3b6bfe17-1254145788.ap-shanghai.app.tcloudbase.com/"> -->
    <img width="362" src="./docs/public/logo.png">
  </a>
</p>

<h1 align="center">Koala-Form</h1>

<div align="center">

低代码表单解决方案，让你跟考拉一样“懒”
</div>

## Install

```bash
npm i @koala-form/core
npm i @koala-form/preset-fesd
```

## Usage
使用预设
```js
import { usePreset } from '@koala-form/core';
import fesdPreset from '@koala-form/preset-fesd';

usePreset(fesdPreset);
```
写一个简单的表单
```html
<template>
    <KoalaForm :metaList="metaList" :config="config"></KoalaForm>
</template>

<script>
import { KoalaForm, defineFields, defineConfig } from '@koala-form/core';
import { BASE_URL } from './const';

const commonStatus = { query: true, table: true, insert: true, update: true, delete: true, view: true };
const metaList = defineFields([
    { key: 'id', label: 'ID', status: { ...commonStatus, query: false, insert: false, update: 'disabled' } },
    { key: 'name', label: '姓名', status: commonStatus, required: true },
    { key: 'age', label: '年龄', type: 'number', status: commonStatus },
    { key: 'actions', label: '操作', colProps: { width: 220 }, status: { table: true } },
]);

const config = defineConfig({
    name: '用户',
    query: { api: `${BASE_URL}user.json` },
    insert: { api: `${BASE_URL}success.json` },
    update: { api: `${BASE_URL}success.json` },
    delete: { api: `${BASE_URL}success.json` },
});

export default {
    components: { KoalaForm },
    setup() {
        return {
            metaList,
            config,
        };
    },
};
</script>
```


## 反馈

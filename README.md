<p align="center">
  <a href="../../">
    <img alt="koala" width="250" src="./docs/public/logo.png">
  </a>
</p>

<h1 align="center">Koala-Form</h1>

<div align="center">

低代码表单解决方案，让你跟考拉一样“懒”

[![GitHub issues](https://img.shields.io/github/issues/WeBankFinTech/KoalaForm.svg?style=flat-square)](../../issues)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../../pulls)
[![Page Views Count](https://badges.toozhao.com/badges/01H51S4REBN596ZZ2BTNVV6566/green.svg)](https://badges.toozhao.com/stats/01H51S4REBN596ZZ2BTNVV6566 "Get your own page views count badge on badges.toozhao.com")

</div>

-   使用文档 - [https://koala-form.mumblefe.cn/](https://koala-form.mumblefe.cn/)
-   更新日志 - [CHANGELOG.md](./CHANGELOG.md)

# 痛点

对于中后台产品的前端开发来说，最常见的场景无非是开发一个表的CURD操作

-   Create：创建表单
-   Update：更新表单
-   Retrieve 查询表单&表格展示
-   Delete：删除

当你开发多个表单页面时，你会发现这些页面除了字段和接口不同，大概有80%的其他逻辑基本一样，但还是少不了那些胶水代码。而`Koala Form`可以帮你减少这80%的胶水代码

## Koala Form 是什么？

`Koala Form` 是一个表单页面的低代码解决方案。以Vue3为基础，围绕后台产品的表单场景进行封装，使得开发者仅需关注表单页面的字段和接口。

它主要具备以下特点

-   🚀 **高效的** ，从零开发一个完整的表单页面也许需要你花一天或者几个小时，而Koala From也许仅需几分钟，你需要做的就配置字段的展示规则。
-   🧨 **简单的** ，内置基础的表单场景，`useScene`, `useFrom`、`useTable`、`useModal`、`usePager`, 根据传入的字段规则解析，返回场景上下文用于操作场景内容，render函数可以减少了你对UI的关注。

-   💪 **灵活的** ，丰富的场景可以自由组合；所有的字段也支持vueslot; 可扩展自己的插件，render自己的UI。

## UI库插件

| 插件                                                                                                                         | 介绍                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [@koala-form/fes-plugin](https://koala-form.mumblefe.cn/zh/ui/fes.html)                                        | Fes Design组件库的桥接插件                                            |
| [@koala-form/element-plugin](https://koala-form.mumblefe.cn/zh/ui/element.html)                       | Element Plus组件库的桥接插件                                |

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

| Github Issue                         | KoalaForm社区群                        |
 | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [KoalaForm/issues](../../issues) | 微信添加好友`aring_93`，邀请进社区群 |

## 参与共建

我们非常欢迎社区同学能提交 PR：

1. fork 项目!
2. 创建你的功能分支: `git checkout -b my-new-feature`
3. 本地提交新代码: `git commit -am 'Add some feature'`
4. 推送本地到服务器分支: `git push origin my-new-feature`
5. 创建一个 PR

如果是发现 Bug 或者期望添加新功能，请提交[issue](../../issues)。
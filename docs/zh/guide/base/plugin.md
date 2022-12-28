---
sidebarDepth: 2
---

# 插件基础
使用插件可以扩展场景或者场景的功能，比如可以通过插件来适配UI库、扩展ComponentDesc和Field的配置。
## 安装到全局

- installInGlobal 将插件安装到全局，意味着所有的场景都生效。

- installPluginPreset 将预设[内置插件](#内置插件列表)安装到全局

```js
import { componentPlugin } from '@koala-form/fes-plugin';
import { installPluginPreset } from '@koala-form/core';

installInGlobal(componentPlugin); // 安装fes design组件插件

installPluginPreset() // 安装所有预设内置插件

```
## 局部安装
全局安装的插件将在所有的场景中生效，当场景需要特定的插件时，可以使用上下文进行局部安装。

```js
const plugin = (api) => {
    // do something
}

const cxt = useSceneContext('name');
ctx.use(plugin); // 安装插件到局部场景中
```

## 内置插件列表
| 插件         |      插件说明               |
| ------------ | ----------------------- |
| [disabledPlugin]() | 组件disbaled支持 |
| [eventsPlugin]() | 事件支持 |
| [formatPlugin]() | 格式化解析支持 |
| [formRule]() | 表单校验规则支持 |
| [optionsPlugin]() | 枚举选项支持 |
| [renderPlugin]() | 场景渲染 |
| [slotPlugin]() | 插槽支持 |
| [vIfPlugin]() | vIf支持 |
| [vShowPlugin]() | vShow支持 |
---
sidebarDepth: 3
---

# 插件基础
使用插件可以扩展场景或者场景的功能，比如可以通过插件来适配UI库、扩展ComponentDesc和Field的配置。

内置了这些插件

| 插件         |      插件说明               |
| ------------ | ----------------------- |
| disabledPlugin | 组件disbaled支持 |
| eventsPlugin | 事件支持 |
| formatPlugin | 格式化解析支持 |
| formRule | 表单校验规则支持 |
| optionsPlugin | 枚举选项支持 |
| renderPlugin | 场景渲染 |
| slotPlugin | 插槽支持 |
| vIfPlugin | vIf支持 |
| vShowPlugin | vShow支持 |
| vModelsPlugin | 组件响应式属性绑定 |

## 安装到全局

- installInGlobal 将插件安装到全局，意味着所有的场景都生效。

- installPluginPreset 将所有内置插件安装到全局

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

## disabledPlugin
为disabled提供响应式支持

- 作用于组件描述属性：disabled
- 作用于字段描述属性：无
- 提供行为函数：无
- 提供帮助函数：无

## eventsPlugin
为组件提供事件绑定

- 作用于组件描述属性：events
- 作用于字段描述属性：无
- 提供行为函数：无
- 提供帮助函数：无

## formatPlugin
 格式化解析支持

- 作用于组件描述属性：format
- 作用于字段描述属性：format
- 提供行为函数：无
- 提供帮助函数：formatByOptions、genFormatByDate
## formRule
 表单校验规则支持

- 作用于组件描述属性：无
- 作用于字段描述属性：required、rules
- 提供行为函数：doValidate、doClearValidate
- 提供帮助函数：无
## optionsPlugin
 枚举选项支持

- 作用于组件描述属性：无
- 作用于字段描述属性：options
- 提供行为函数：doTransferOptions、doRemoteOptions、doComputedOptions、doComputedLabels
- 提供帮助函数：无

## renderPlugin
 场景渲染

- 作用于组件描述属性：无
- 作用于字段描述属性：无
- 提供行为函数：无
- 提供帮助函数：无

## slotPlugin
 插槽支持

- 作用于组件描述属性：slotName
- 作用于字段描述属性：slotName
- 提供行为函数：无
- 提供帮助函数：无

## vIfPlugin
 vIf支持

 - 作用于组件描述属性：vIf
- 作用于字段描述属性：vIf
- 提供行为函数：无
- 提供帮助函数：无
## vShowPlugin
 vShow支持

 - 作用于组件描述属性：vShow
- 作用于字段描述属性：vShow
- 提供行为函数：无
- 提供帮助函数：无

## vModelsPlugin
 组件响应式属性绑定

 - 作用于组件描述属性：vModels
- 作用于字段描述属性：vModels
- 提供行为函数：无
- 提供帮助函数：无
---
sidebarDepth: 2
---

# 自定义插件

在插件基础中，可以通过一个函数来定义一个插件, 如

```ts
export const plugin: PluginFunction<SceneContext, SceneConfig> = (api, config) => {
  // do something
}
```
其中PluginFunction的类型如下
```ts
export type PluginFunction<T extends SceneContext = SceneContext, K extends SceneConfig = SceneConfig> = (api: Plugin<T, K>, config?: K) => void;
```

插件的执行是通过事件驱动的，所以我们是在插件函数内使用api的on/emit定义插件的任务和依赖。

## 编写一个插件

为了更好的了解插件，我们可以简单写一个给form label自动加上`:`的插件

首先我们给插件加一个描述
```ts
const formLabelColonPlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-label-colon-plugin');
}
```

接下我们要知道，useForm场景执行之后，form字段会解析到Scheme上，此时会触发插件formSchemeLoaded的事件

因此在插件中，添加事件

```ts
const formLabelColonPlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-label-colon-plugin');

    api.on('formSchemeLoaded', ({ ctx }) => {
      // 添加处理
    })
}
```

在场景上下文中，可以访问到Scheme，此钩子还可以访问到已解析的字段，因此可以加上这样处理

```ts
import { travelTree, mergeRefProps } from '@koala-form/core';

const formLabelColonPlugin: PluginFunction<FormSceneContext, FormSceneConfig> = (api) => {
    api.describe('form-label-colon-plugin');

    api.on('formSchemeLoaded', ({ ctx }) => {
      // 遍历scheme
      travelTree(ctx.schemes, (scheme) => {
            if (scheme.props?.label?.trim()) {
              // 合并属性
              mergeRefProps(scheme, 'props', { label: scheme.props.label + ':' });
            }
        });
    })
}
```
最后安装使用

安装到全局使用

```js
import { installPluginPreset } from '@koala-form/core';

installInGlobal(formLabelColonPlugin);
```

或者场景安装

```js
import { useSceneContext } from '@koala-form/core';

const { ctx } = useSceneContext(['form'])

ctx.use(formLabelColonPlugin)
```

运行示例效果

<ExampleDoc>
<LabelPlugin>
</LabelPlugin>
<template #code>

<<< @/examples/labelPlugin.js
</template>
</ExampleDoc>

关于插件的更多细节，可以参考[设计原理](./design.md)和[API](./api.md)。
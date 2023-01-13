---
sidebarDepth: 3
---
# 基础场景
基础场景使用`useScene`。用ComponentDesc描述一段组件树，通过场景上下文返回的render方法，即可将组件树渲染成VNode树。

插件是扩展useScene功能的途径，为了将一些重复的功能更好的复用，通过插件修改场景的上下文（SceneContext）定制出一些特定的场景：useForm、useTable、usePager、useModal。

<ExampleDoc>
<StartedScene>
</StartedScene>
<template #code>

<<< @/examples/started/useScene.js
</template>
</ExampleDoc>

## 场景配置
- ctx：传入的场景上下文
- components：场景的组件树
```ts
export interface SceneConfig {
    ctx?: SceneContext;
    components?: ComponentDesc[] | ComponentDesc;
}
```
## 场景上下文
场景提供上下文进行场景渲染和操作场景的API。

- name 场景名
- modelRef 场景的响应式的对象，用于取值和更新值。
- schemes 组件树的解析态，用于插件的修改和访问。
- getComponent 解析组件，用于扩展UI库
- render 渲染场景

```ts
export interface SceneContext {
    name: string;
    modelRef?: Ref;
    schemes: Array<Scheme>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
}
```

## useSceneContext
多个场景相互依赖上下文，可以使用`useSceneContext`先去生成场景的上下文引用，再传入场景中实例化。

```js
// 单场景上下文
const { ctx } = useSceneContext('form');
useForm({ ctx })

// 多场景上下文
const { ctxs: [form, table] } = useSceneContext(['form', 'table']);
useForm({ ctx: form })
useTable({ ctx: table })
```
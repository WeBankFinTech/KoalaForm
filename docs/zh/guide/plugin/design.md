---
sidebarDepth: 2
---

# 设计原理

在插件基础中讲过，可以使用插件扩展场景或者场景的功能，比如vIf、vShow等。

那么插件是如何实现扩展功能的呢？

## 场景上下文
所有的场景都可以继承SceneContext，扩展自定义场景的上下文。
```js
export interface SceneContext {
    name: string;
    modelRef: Ref;
    schemes: Array<Scheme>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
    __config?: SceneConfig;
    __pluginStarted?: boolean;
    readonly __scopedId: string | number;
    readonly __plugins: PluginFunction[];
    /** 插件 */
    readonly use: (define: PluginFunction) => SceneContext;
}
```

其中上下文的核心就是`schemes`和`render`，插件也就是主要围绕着schemes来扩展功能。

## scheme是什么
scheme实际上是一个中间态的节点，schemes就是中间态的节点树。

```js
export interface Scheme {
    component: string | ComponentDesc;
    props?: Reactive;
    vModels?: Record<string, ModelRef>;
    vShow?: Ref<boolean>;
    vIf?: Ref<boolean>;
    events?: Record<string, (...args: unknown[]) => void>;
    children?: SchemeChildren;
    slots?: Slots;
    __ref?: Ref;
    __node: unknown;
}

export type SchemeChildren = Array<Scheme | string | ModelRef | Slot> | string | ModelRef | Slot;
```

我们可以称开发者定义的Field、ComponentDesc为初始态。

在场景中运行一系列插件把初始态转换为中间态。

最终render方法会根据中间态渲染成vNode终态。

如下图：
<div>
    <img src="/design.png" width="600px"/>
</div>

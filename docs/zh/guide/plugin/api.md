---
sidebarDepth: 2
---

# 插件API


## describe
描述插件名

- 类型

```ts
describe(name: string): void
```

## onStart
插件可以通过on/emit来进行通信，改方法是插件开始执行的钩子

- 类型

```ts
onStart(handler: PluginHook): void;
```

其中
```ts
interface PluginHookData<T = SceneContext, K = SceneConfig> {
    id: number;
    /** 插件名 */
    name: string;
    scopeId: string;
    ctx: T;
    config: K;
    [key: string]: any;
}
declare type PluginHook<T = SceneContext, K = SceneConfig> = (data: PluginHookData<T, K>) => void;
```

- 说明

  PluginHook函数回传的参数包括当前执行的场景上下文和配置等属性，因此可以在钩子里根据配置处理上下文。

- 示例
```js
api.onStart(({ ctx, config }) => {
    // do something
})
```

## onSelfStart
仅插件自己的开始执行的钩子

- 类型

```ts
onSelfStart(handler: PluginHook): void;
```

## onSelf
仅监听插件自己的事件钩子

- 类型

```ts
onSelf(type: string, handler: PluginHook): void;
```

## on
监听插件事件钩子

- 类型

```ts
on(type: string, handler: PluginHook): void;
```

## emit
出发事件钩子

- 类型

```ts
emit(type: string, event?: PluginHookData | any): void;
```

- 说明

插件直接通信，可以通过emit事件，通知钩子执行，event是事件的参数。

## start

开始执行插件，并触发start事件。

```ts
start(config: K): void;
```

## destroy

插件销毁

```ts
destroy(): void;
```
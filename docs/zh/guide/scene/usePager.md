---
sidebarDepth: 3
---
# usePager

封装分页器场景

```js
const ctx = usePager({})

// 设置数据
ctx.modelRef.value.currentPage = 100;

// 或者通过handle调用
doSetPager(ctx, {
    currentPage: 12,
    totalCount: 1000
})

ctx.render // 渲染函数


```
## API

### 参数

- ctx：指定上下文
- pager：table组件

```js
export interface PagerSceneConfig extends SceneConfig {
    ctx: PagerSceneContext;
    pager: ComponentDesc;
}
```

### 返回

- ref：分页组件实例引用
- modelRef：分页数据，双向绑定
- isPager：上下文标识是分页

```js
export interface PagerSceneContext extends SceneContext {
    modelRef: Ref<{
        pageSize: number;
        currentPage: number;
        totalCount: number;
    }>;
    ref: Ref;
    isPager: boolean;
}
```
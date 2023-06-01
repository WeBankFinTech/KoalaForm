---
sidebarDepth: 3
---
# useModal

模态框场景可以用于展示新增和修改表单。

```js
const form = useForm({})
const ctx = useModel({ 
    modal: {
        children: form, // 嵌套form场景
    }
})

// 设置数据
ctx.modelRef.value.show = true;

// 或者通过handle调用
doOpen(ctx)
doClose(ctx)

ctx.render // 渲染函数

```
## API

### 参数

- ctx：指定上下文
- modal：modal组件
- title: 标题

```js
export interface ModalSceneConfig extends SceneConfig {
    ctx?: ModalSceneContext;
    title?: string;
    modal?: ComponentDesc;
}
```

### 返回

- ref：模态框组件实例引用
- modelRef：模态框数据，双向绑定

```js
export interface ModalSceneContext extends SceneContext {
    modelRef: Ref<{
        show: boolean;
        title: string;
    }>;
    ref: Ref;
}
```

### 抽屉模式

```js
const ctx = useModel({ 
    modal: {
        name: ComponentType.Drawer
    }
})
```
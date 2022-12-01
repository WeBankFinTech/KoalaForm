---
sidebarDepth: 3
---

# Fes Plugin
此插件依赖`@fesjs/fes-design`，提供了以下功能：

- 将组件名解析到响应的组件
- 提供场景的的预设配置

## 使用插件

直接引用默认安装到全局

```js
import '@koala-form/fes-plugin';
```

在场景上下文安装
```js
import { useSceneContext } '@koala-form/core';
import { componentPlugin } '@koala-form/fes-plugin';
const cxt = useSceneContext('name')
ctx.use(componentPlugin);
```

## 使用Preset

## Preset API
preset是提供一些方便快捷的方法去生成场景的配置，比如按钮、表单等。

### genButton
生成按钮配置，返回一个button组件的`ComponentDesc`

***@param*** 
- name — 按钮名称
- handler — 按钮点击回调
- props — 部分属性

```js
const genButton: (name: string, handler: (rowData?: Record<string, any>) => void, props?: {
    type?: 'primary' | 'text' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'default';
    size?: 'small' | 'middle' | 'large';
    disabled?: ComponentDesc['disabled'];
    vIf?: ComponentDesc['vIf'];
    vShow?: ComponentDesc['vShow'];
}) => ComponentDesc
```

### genForm
生成表单配置，返回一个form组件的`ComponentDesc`

***@param*** 
- layout — 表单布局方式，默认是垂直horizontal
- props — form组件属性

```js
const genForm: (layout?: 'horizontal' | 'inline', props?: {
    inlineItemWidth?: number | string;
    labelWidth?: number | string;
    labelPosition?: 'left' | 'top' | 'right';
}) => ComponentDesc
```

### genQueryAction
生成查询表单的行为配置，返回一个`Filed`

***@param*** 
- handlers 行为响应
    - query 查询按钮的响应，不传则隐藏
    - reset 重置按钮的响应，不传则隐藏
    - create 新增按钮的响应，不传则隐藏

```js
const genQueryAction: (handlers: {
    query?: () => void;
    reset?: () => void;
    create?: () => void;
}) => Field
```

### genSubmitAction
生成提交表单的行为配置，返回一个`Filed`

***@param*** 
- handlers 行为响应
    - save 保存按钮的响应，不传则隐藏
    - clear 清空按钮的响应，不传则隐藏
    - reset 重置按钮的响应，不传则隐藏
```js
const genSubmitAction: (handlers: {
    save?: () => void;
    clear?: () => void;
    reset?: () => void;
}) => Field
```
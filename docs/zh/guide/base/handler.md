---
sidebarDepth: 3
---

# 行为函数
CURD表单页面的行为操作逻辑基本是固定、重复的，比如

- 点击查询按钮：获取查询表单数据 -> 分页重置为1（如有）-> 处理请求参数 -> 发起请求 -> 处理请求结果 -> 更新列表数据 -> 更新分页（如有）

- 点击查询的重置按钮：重置查询表单 -> 执行【点击查询按钮】的逻辑 

- 点击列表分页：获取查询表单数据 -> 处理请求参数 -> 发起请求 -> 处理请求结果 -> 更新列表数据 -> 更新分页（如有）

- 点击新增按钮：重置新增表单 -> 打开新增表单的弹窗

- 点击新增表单的保存：校验表单 -> 获取表单 -> 处理请求参数 -> 发起请求 -> 处理请求结果 -> 关闭弹窗 -> 执行【点击查询按钮】的逻辑

将上面的逻辑抽象成一个个单独步骤，我们称为行为函数，并约定以do开头。

## 组合使用
行为函数抽象的是细小步骤，可以提高复用性。因此当我们处理用户的行为时，可以直接组合行为行数，而不用写一系列处理逻辑。
```js
// 组合查询
const doQuery = async () => {
    const data = doBeforeQuery(query, pager);
    const res = await doRequest('/user.json', data);
    doAfterQuery(table, pager, res);
};

// 组合重置查询
const doReset = async () => {
    doSetPager(pager, { currentPage: 1 });
    doResetFields(query);
    await doQuery();
};
```

**行为函数可以是普通的函数，也可以是由场景或者插件提供函数。**

## doRequest
发起网络请求。该函数依赖于全局配置的request实现。

**参数**
- api：请求地址
- params：请求参数
- opt：请求配置

**结果**

返回请求的响应体。

```ts
const doRequest: (
    api: string,
    params?: Record<string, any>,
    opt?: Record<string, any>
) => Promise<any>
```

## doResetFields
重置表单字段，由 **【表单场景】** 提供

**参数**
- cxt：表单场景上下文

```ts
const doResetFields: (ctx: FormSceneContext) => void
```

## doInitFields
设置表单字段初始值，由 **【表单场景】** 提供

**参数**
- cxt：表单场景上下文
- values: 对象值或者是指定name的值
- name：指定values更新到那个字段更新。

```ts
const doInitFields: (
    ctx: FormSceneContext,
    values: Record<string, any>, 
    name?: string
) => void
```

```js
doInitFields(ctx, { name: 'aring', age: 18 }) // 多个字段更新

doInitFields(ctx, 'aring', 'name') // 单个字段更新
```

## doSetFields
更新表单字段值，由 **【表单场景】** 提供

**参数**
- cxt：表单场景上下文
- values: 对象值或者是指定name的值
- name：指定values更新到那个字段更新。

```ts
const doSetFields: (
    ctx: FormSceneContext,
    values: Record<string, any>, 
    name?: string
) => void
```

```js
doSetFields(ctx, { name: 'aring', age: 18 }) // 多个字段更新

doSetFields(ctx, 'aring', 'name') // 单个字段更新
```

## doGetFormData
由 **【表单场景】** 提供，取from的model数据进行格式化，规则如下:

- 日期处理，当组件时时间组件，会转成时间戳；如果值是数组，那么会解析成${fieldName}Start和${fieldName}End字段
- 多选，当组件是Select或者CheckBox并值是数组时，转成用','分割，如[1,2,3] => '1,2,3'

@param values — form外的其他参数

@param ctx — 指定上下文

@returns 格式化后的数据

```ts
const doGetFormData: (
    ctx: FormSceneContext,
    values?: Record<string, any>
) => Record<string, any>
```

## doValidate
由 **【表单规则插件】** 提供，校验表单。

@param ctx — 指定上下文

@param names — 指定校验的字段名

```ts
const doValidate: (ctx: FormSceneContext, names?: string[]) => Promise<void>
```

## doClearValidate
由 **【表单规则插件】** 提供，清空校验态。

@param ctx — 指定上下文

```ts
const doClearValidate: (ctx: FormSceneContext) => void
```

## doSetPager
由 **【分页场景】** 提供，设置分页。

@param ctx — 指定上下文

@param value — 需要更新的分页信息

@returns 更新后的分页

```ts
const doSetPager: (ctx: PagerSceneContext, value: {
    currentPage?: number;
    pageSize?: number;
    totalCount?: number;
}) => {
    pageSize: number;
    currentPage: number;
    totalCount: number;
}
```

## doOpen
由 **【弹窗场景】** 提供，打开弹窗。

@param ctx — 指定上下文

```ts
const doOpen: (ctx: ModalSceneContext) => void
```

## doClose
由 **【弹窗场景】** 提供，关闭弹窗。

@param ctx — 指定上下文

```ts
const doClose: (ctx: ModalSceneContext) => void
```

## doTransferOptions
由 **【options插件】** 提供，转换枚举对象

@param list — 转换前的枚举项数组

@param valueName — 枚举值字段，默认是value

@param labelName — 枚举描述字段，默认是label

@returns — 转换后的枚举列表

```ts
const doTransferOptions: (list: Record<string, any>[], valueName?: string, labelName?: string) => EnumOption[]
```

```js
const list = [
    { id: '1', name: 'xx', type: 'A' },
]
doTransferOptions(list, 'id', 'name'); // => [{key: '1', label: 'xx', ...}]

doTransferOptions(list, 'type', 'name'); // => [{key: 'A', label: 'xx'}]
```

## doRemoteOptions
由 **【options插件】** 提供，获取远程的options

@param api — 请求地址

@param data — 请求参数

@param config — 配置
- opt: 请求配置
- valueName：枚举值字段，默认是value
- labelName：枚举描述字段，默认是label
- path: 请求结果取options的路径

```ts
const doRemoteOptions: (api: string, data?: Record<string, any>, config?: {
    opt?: Record<string, any>;
    valueName?: string;
    labelName?: string;
    path?: string;
}) => Promise<EnumOption[]>
```

## doComputedOptions
由 **【options插件】** 提供，获取字段的响应式options

@param cxt — 上下文

@param fieldName — 字段名

```ts
const doComputedOptions: (cxt: FormSceneContext, fieldName: string) => Ref<EnumOption[]>
```

## doComputedLabels
由 **【options插件】** 获取字段的响应式枚举

@param cxt — 上下文

@param value — 枚举值

@param config — 配置
- fieldName：字段名
- split：如果value是数组，映射枚举后的分隔符

@returns — 枚举描述

```ts
const doComputedLabels: (cxt: FormSceneContext, value: any, config: {
    fieldName: string;
    split?: string;
}) => Ref<string>
```

## doBeforeQuery
查询之前参数整理，handle的结果格式如下：
```js
{
   ...formModel, // 表单字段
   page?: { // 分页数据
     pageSize,
     currentPage
   }
}
```
如接口参数格式不是适配，可以后面新增一个handle进行处理

@param pager — 分页上下文

@param form — 表单上下文

```ts
const doBeforeQuery: (form: FormSceneContext, pager?: PagerSceneContext) => {
    [key: string]: any;
    page?: {
        pageSize: number;
        currentPage: number;
    } | undefined;
}
```

## doAfterQuery

解析查询结果解析到分页和列表上

@param pager — 分页上下文

@param table — 列表上下文

```ts
const doAfterQuery: (table: TableSceneContext, pager?: PagerSceneContext, data?: {
    list: any[];
    page: PagerSceneContext['model'];
}) => void
```

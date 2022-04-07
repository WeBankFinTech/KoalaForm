# Config
`Config`用于描述表单的动作，调用后台接口并数据转换，比如查询、新增、修改、保存等。
## Config

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
| name | 表单名字| `string` |
| uniqueKey | 列表中每行数据唯一值的字段名 | `string` | `id`
| query  | query 动作的配置 | `QueryActionConfig` |
| insert | insert动作的配置 | `InsertActionConfig` |
| update | update动作的配置 | `UpdateActionConfig` |
| delete | delete动作的配置 | `DeleteActionConfig` |
| view | view动作的配置 | `ActionConfig` |

## ActionConfig
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
api | 接口请求地址 | ` string`
method | 接口请求的方法 | ` RequestMethod`
open | 动作开启 | ` boolean`
btn | 动作按钮配置 | `BtnProp`
successTip | 接口调用成功提示 | ` boolean`
validMessage | 表单校验不通过提示 | ` string`
before | 接口调用前回调，返回Promise.reject可以阻止接口执行 | `function(params: Record<string, any>): Promise<Record<string, any>>`
success | 接口调用成功回调，返回Promise.reject可以阻止执行 | `function(res: Record<string, any>): Promise<Record<string, any>>`
error | 接口调用发生错误回调，返回Promise.reject可以阻止接口执行 | function(`err: any): Promise<any>`

::: tip
BtnProp类型配置按钮组件属性 `{show: boolean, text: string | vNode, ...otherProps}`，如：

```js
defineConfig({
    query: {
        btn: { text: '搜索', size: 'large' }, // 将查询按钮文字改为搜索，并且大小改为large
        resetBtn: { show: false } // 隐藏重置按钮
    }
})
```

:::

## QueryActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
name | 动作按钮对应的名字 | `string` `VNode` | "查询"
queryAfterReset | 是否开启重置之后调用查询 | ` boolean`
firstAutoQuery | 是否开启首次调用 | ` RequestMethod`
resetBtn | 重置按钮配置 | `BtnProp`
success | 接口调用成功回调，返回Promise.reject可以阻止执行 | `function(res: Record<string, any>): Promise<{ tableModel: Record<string, any>[]; pagerModel: Pager }>`

## InsertActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
name | 动作按钮对应的名字 | `string` `VNode` | "新增"
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`
saveBtn | 保存按钮配置 | `BtnProp`
resetBtn | 重置按钮配置 | `BtnProp`


## UpdateActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
name | 动作按钮对应的名字 | `string` `VNode` | "更新"
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`
saveBtn | 保存按钮配置 | `BtnProp`
resetBtn | 重置按钮配置 | `BtnProp`

## DeleteActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
name | 动作按钮对应的名字 | `string` `VNode` | "删除"
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`
getMessage | 确认提示  | `function(model: Record<string, any>): string;`

## ViewActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
name | 动作按钮对应的名字 | `string` `VNode` | "详情"


## 方法
- **setGlobalConfig(config: Config)**

设置全局配置

- **defineConfig(config: Config): Config**

定义当前表单配置
## 全局默认配置
```js
const globalConfig: Config = {
    name: '',
    uniqueKey: 'id',
    query: {
        api: '',
        method: 'GET',
        btn: {
            text: '查询',
            show: true,
        },
        resetBtn: {
            text: '重置',
            show: true,
        },
        queryAfterReset: true,
        firstAutoQuery: true,
        before: async (params) => params,
        success: async (res) => ({
            tableModel: res?.result?.list || [],
            pagerModel: res?.result?.pager,
        }),
        error: async (err) => err,
    },
    insert: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'POST',
        validMessage: '请检查表单字段',
        btn: {
            text: '新增',
            show: true,
        },
        saveBtn: {
            text: '保存',
            show: true,
        },
        resetBtn: {
            text: '重置',
            show: true,
        },
    },
    update: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'PUT',
        validMessage: '请检查表单字段',
        btn: {
            text: '更新',
            show: true,
        },
        saveBtn: {
            text: '保存',
            show: true,
        },
        resetBtn: {
            text: '重置',
            show: true,
        },
    },
    delete: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'DELETE',
        getMessage() {
            return `确定删除该记录？`;
        },
        btn: {
            text: '删除',
            show: true,
        },
    },
    view: {
        open: true,
        method: 'GET',
        btn: {
            text: '详情',
            show: true,
        },
    },
};
```

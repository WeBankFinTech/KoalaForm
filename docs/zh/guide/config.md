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
successTip | 接口调用成功提示 | ` boolean`
validMessage | 表单校验不通过提示 | ` string`
before | 接口调用前回调，返回Promise.reject可以阻止接口执行 | `function(params: Record<string, any>): Promise<Record<string, any>>`
success | 接口调用成功回调，返回Promise.reject可以阻止执行 | `function(res: Record<string, any>): Promise<Record<string, any>>`
error | 接口调用发生错误回调，返回Promise.reject可以阻止接口执行 | function(`err: any): Promise<any>`

## QueryActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
queryAfterReset | 是否开启重置之后调用查询 | ` boolean`
firstAutoQuery | 是否开启首次调用 | ` RequestMethod`
success | 接口调用成功回调，返回Promise.reject可以阻止执行 | `function(res: Record<string, any>): Promise<{ tableModel: Record<string, any>[]; pagerModel: Pager }>`

## InsertActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`


## UpdateActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`

## DeleteActionConfig
继承`ActionConfig`
| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- 
queryAfterSuccess | 是否开启接口成功之后调用查询刷新列表 | ` boolean`
getMessage | 确认提示  | `function(model: Record<string, any>): string;`


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
    },
    update: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'PUT',
        validMessage: '请检查表单字段',
    },
    delete: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'DELETE',
        getMessage() {
            return `确定删除该记录？`;
        },
    },
    view: {
        open: true,
        method: 'GET',
    },
};
```

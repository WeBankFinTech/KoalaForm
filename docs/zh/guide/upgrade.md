---
sidebarDepth: 2
---

# V1到V2迁移指南

## 全局配置

1. setGlobalConfig删除、增删改查模块移除。
2. 删除usePreset
3. 改用v2的插件安装和配置
4. uniqueKey移动到useCurd中的table配置
5. 模块的请求不再统一处理，请自行处理数据格式。

```js
import '@koala-form/fes-plugin';
import { setupGlobalConfig, installPluginPreset } from '@koala-form/core';
import { request } from '@fesjs/fes';

// 将依赖的插件安装到全局
installPluginPreset();
setupGlobalConfig({ request }) // 配置请求
```

## 字段

1. type不再指定组件，改为components
2. status和模块属性移除，改为由传入的场景决定。
3. enumsName移除，不支持从fes中读取options，统一为options配置，可以加如下方法获取：
```js
import { enums } from '@fesjs/fes';

export const getEnumOptions = (name) => enums.get(name, commEnumExt);
```

4. span移除，由用户自己在场景中控制表单组件属性。

## 场景
大多数场景使用的是usePage，新版中我们用[useCurd](../ui//fes.md)，配置和使用方法不一样

1. usePage的字段通过status解析到模块中，useCurd则提供模块自由传入
```js
useCurd({
    query: {},
    table: {},
    edit: {},
    modal: {},
    pager: {},
    actions: {}
})
```
2. 处理请求，useCurd中，使用actions配置请求处理
```js
useCurd({
    actions: {
        query: {
            before(params) {
                const { page, ...newParams } = params
                if (page) {
                    newParams.pager = {
                        pageSize: page.pageSize
                        current： page.currentPage
                    }
                }
                newParams.addProps = '123'
                return newParams
            },
            after(data) {
                const { pager, dataList } = data
                return {
                    list: dataList,
                    page: {
                        totalCount: pager.total
                    }
                }
            }
        }
    }
})
```

3. 日期、日期范围格式化

列表中可以通过genFormatByDate指定格式化

4. 枚举值转化

通过formatByOptions转

5. slots
useCurd提供了

queryActionsExtend 在重置按钮前扩展查询域按钮

tableActionsExtend 在最后扩展列表操作按钮

其他可以通过指定字段或者组件的slotName

6. KoalaForm组件改为KoalaRender只接受render函数

7. 方法、属性访问

有场景上下文提供，或者使用handler函数，一般以do开头。


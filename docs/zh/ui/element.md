---
sidebarDepth: 3
---

# Element Plus Plugin
此插件依赖`element-plus`，提供了以下功能：

- 将组件名解析到响应的组件
- 提供场景的的预设配置

::: warning
组件映射说明

- Modal使用的是Dialog组件，Dialog组件默认不提供footer按钮，useModal的场景会添加默认的取消/确定按钮，支持解析属性cancelText, okText，事件onOk，onCancel

- Select使用的是ElSelectV2组件

- SelectCascader使用的是ElCascader组件

- SelectTree使用的是ElTreeSelect组件

- CheckboxGroup可根据options渲染Checkbox

- RadioGroup可根据options渲染Radio
:::


## 使用插件

安装到全局

```js
import { installInGlobal } from '@koala-form/core';
import { componentPlugin } from '@koala-form/element-plugin';
installInGlobal(componentPlugin);
```

在场景上下文安装
```js
import { useSceneContext } from '@koala-form/core';
import { componentPlugin } from '@koala-form/element-plugin';
const ctx = useSceneContext('name')
ctx.use(componentPlugin);

// const ctx = useSceneContext('name', componentPlugin)

```

## Form布局增强
Form和FormItem属性新增span，用于增强Form布局能力。span属性值范围：1-24，默认为12。

::: warning
 version >= 2.0.8

 span仅在inline模式下有效。
:::



```js
import { useForm } from '@koala-form/core';

useForm({
    form: { props: { inline: true, span: 6 } } // 统一设置，每个field的span都为6
    fields: [
        { name: 'name', label: '姓名'}, // 未设置span，则继承From的span，6
        { name: 'sex', label: '性别', span: 4 }, // 单独设置span为4
    ]
})

// 非inline模式下，span无效
useForm({
    form: { props: { inline: false, span: 6 } }
    fields: [
        { name: 'name', label: '姓名'},
        { name: 'sex', label: '性别', span: 4 },
    ]
})

```


## 使用Preset
UI插件提供一些预设，使页面写起来更简洁。

<ExampleDoc>
<ElementCurd>
</ElementCurd>
<template #code>

<<< @/examples/elementCurd.js

</template>
</ExampleDoc>

## Preset API
preset是提供一些方便快捷的方法去生成场景的配置，比如按钮、表单等。

### genButton
生成按钮配置，返回一个button组件的`ComponentDesc`

***@param*** 
- name — 按钮名称
- handler — 按钮点击回调
- props — 部分属性

```js
const genButton: (name: string, handler?: ((rowData?: any) => void) | undefined, props?: {
    [key: string]: any;
    type?: "default" | "success" | "warning" | "info" | "primary" | "danger" | undefined;
    size?: "default" | "small" | "large" | undefined;
    disabled?: ComponentDesc['disabled'];
    vIf?: ComponentDesc['vIf'];
    vShow?: ComponentDesc['vShow'];
} | undefined) => ComponentDesc
```

### genForm
生成表单配置，返回一个form组件的`ComponentDesc`

***@param*** 
- inline — 表单布局方式，默认是false
- props — form组件属性

```js
const genForm: (inline?: boolean, props?: {
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

### genTableAction
生成列表的行为配置

***@param*** 
- handlers 行为响应
    - update 更新按钮的响应，不传则隐藏
    - delete 删除按钮的响应，不传则隐藏
    - view 详情按钮的响应，不传则隐藏
- label: 操作列名
```js
const genTableAction: (handlers: {
    update?: () => void;
    delete?: () => void;
    view?: () => void;
}, label?: string) => Field
```

## useCurd
虽然有了基础场景可以自由组合，但是像CRUD这种组合逻辑也是大同小异，所以我们组合了`useCurd`的场景，更方便快捷的使用。

<ExampleDoc>
<ElementUseCurd>
</ElementUseCurd>
<template #code>

<<< @/examples/elementUseCurd.vue

</template>
</ExampleDoc>

### 配置说明
useCurd提供了字段配置和行为配置。

- 查询表单字段使用 query.fields
- 列表字段使用 table.fields
- 新增/修改字段使用 edit.fields
- 查询按钮使用 actions.query
- 重置按钮使用 actions.reset
- 创建按钮使用 actions.create
- 更新按钮使用 actions.update
- 删除按钮使用 actions.delete
- 详情按钮使用 actions.view

```ts
// 行为按钮配置
interface Action extends ComponentDesc {
    api?: string; // 接口地址
    reqConfig?: any; // 请求配置
    hidden: boolean; // 隐藏默认按钮 
    before?: (params: Record<string, any>, ...args: any[]) => Record<string, any>; // 请求前回调，修改请求参数
    after?: (params: Record<string, any>) => Record<string, any>; // 请求后回调，修改请求结果
    open?: (params: Record<string, any>) => Record<string, any>; // 打开modal之前回调
}

// curd场景配置
interface CurdConfig {
    name?: string; // 名称，用于modal名称
    query: FormSceneConfig & {
        /** 是否关闭首次自动查询 */
        firstClosed: boolean;
        actionField?: Field | boolean; // 行为按钮域，为false时隐藏按钮域
    };
    table: TableSceneConfig & {
        rowKey?: string; // 列表唯一值的字段，默认id
        selection?: Field | boolean; // 开启列表多选配置
        actionField?: Field | boolean; // 行为按钮域，为false时隐藏整个操作列
    };
    pager?: PagerSceneConfig;
    edit?: FormSceneConfig;
    modal?: ModalSceneConfig;
    actions: {
        query?: Action; // 查询按钮
        reset?: Action; // 重置按钮
        create?: Action; // 新增按钮
        update?: Action; // 更新按钮
        delete?: Action; // 删除按钮
        view?: Action; // 详情按钮
    };
}
```

### 使用技巧

**1. 定义通用字段**

为了使字段的重复使用，可以将共同的属性先定义，然后在传入配置时，再个性化修改。
```js
const name = { name: 'name', label: '姓名', components: { name: ComponentType.Input } };

const { render } = useCurd({
    query: {
        fields: [name]
    },
    table: {
        fields: mapTableFields([
            {...name, format: (model, value) => value }
        ])
    }
})

```
**2. `mapTableFields`辅助函数**
- 移除列表不需要的字段属性`components`、`rules`、`required`
- 有options的字段，添加格式化
- 如果component是日期组件，添加默认的日期转换。
- 第二个参数可以所有项的默认配置

可以这样统一设置table列默认宽度
```js
mapTableFields([name], { props: { width: 200 } })
```

**3. 扩展行为按钮**

查询域的按钮固定有查询、新增、重置，列表操作的按钮有更新、删除、详情，如果需要扩展这个地方的按钮，可以通过下面的slotName

- queryActionsExtend 在重置按钮前扩展查询域按钮

- tableActionsExtend 在最后扩展列表操作按钮

```html
<KoalaRender :render="render">
    <!-- 扩展查询操作 -->
    <template #queryActionsExtend>
        <FButton type="primary" @click="doExport">导出</FButton>
        <FButton type="primary" @click="doBatch">批量</FButton>
    </template>
    <!-- 扩展列表操作 -->
    <template #tableActionsExtend="{ row }">
        <FButton type="link" @click="doPass(row)">审核</FButton>
    </template>
</KoalaRender>
```

**4. 批量操作**

table可以selection配置可以开启列表的勾选框，通过useCurd的结果`selectedRows`可以获取到勾选的行数据。

如果selection为true，使用默认Field，如果传入Filed可以覆盖默认配置

```js
const { selectedRows } = useCurd({
    table: {
        selection: { props: width: 50 } // props是FTableColumn的属性
        // selection: true,
    }
})

// 可清空已选
selectedRows.value = []
```
**4. 请求修改**

修改请求配置
```js
const action = {
    reqConfig: {
        method: 'get'
    }
}
```

适配分页参数,添加/修改参数
```js
const action = {
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
    }
}
```

适配列表数据
```js
const action = {
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
```

**4. 修改默认UI**

可以通过CurdConfig的`Field`和`ComponentDesc`修改默认UI，比如查询按钮、查询域、表单、列表、分页等。

```js
useCurd({
    query: {
        form: { props: { labelWidth: '100px' } }
    },
    pager: {
        pager: { props: { background: false } }
    },
    actions: {
        create: { props: { type: 'success' } }
    }
})

```

覆盖events可以实现自定义处理逻辑
```js
const doMySomeThing = () => {}

useCurd({
    actions: {
        create: { events: {
            onClick: doMySomeThing
        } }
    }
})
```

**5. 上下文提前**

使用`useSceneContext`可以提前定义上下文，但是不要忘记了传给CurdConfig

```js

// 上下文提前
const { ctx: edit } = useSceneContext('edit');

// 联动逻辑提前
const showDegree = computed(() => ['2', '3', '4'].includes(edit.modelRef.value.education));

const { render } = useCurd({
    edit: {
        ctx: edit, // 覆盖默认的上下文，使用当前定义的上下文
        fields: [
            FIELDS.education,
            { ...FIELDS.degree, vIf: showDegree },
        ]
    }
})


```


**6. 列表行按钮联动行数据**

使用`Action.hidden`可以隐藏默认按钮的UI，但是可以使用按钮的逻辑。

这个在控制列表的按钮状态时，常使用。

```html
<template>
    <KoalaRender :render="render">
        <template #tableActionsExtend="{ row }">
            <!-- 在这里可以获取行数据，用于控制按钮的状态 -->
            <FButton type="link" :disabled="row.id === '2'" @click="openModal('update', { row })">更新</FButton>
        </template>
    </KoalaRender>
</template>
```

```js
const { render, openModal } = useCurd({
    actions: {
        update: {
            api: '/error.json'
        }
    }
})


```

另外当`actionField === false`时，可以隐藏整个操作域，比如：
```js
const { render } = useCurd({
    table: {
        fields: [
            ...,
            { label: '操作', slotName: 'tableActions' }, // 自定义操作列
        ],
        actionField: false // 隐藏整个操作列
    }
})
```

# Field

**`Field`** 是用于描述一个字段


## 基础属性

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| name | 字段名称| `string` |
| label | 字段对应的描述 | `string` |
| type  | 字段值类型 | `ValueType` |
| defaultValue | 默认值 | `any` |
| component | 字段渲染的组件名 | `string` |
| props | 字段在表单组件的属性 | `Reactive` |
| required | 字段在表单中是否必填 | `boolean` | false
| rules | 字段在表单中的校验规则 | `Array<ValidateRule>` |
| actionsLayout | 字段行为布局 | `{ component: string, props: Reactive }` |
| actions | 字段行为定义 | `Action` `Action[]` |

```ts
interface Field {
    name: string;
    label: string;
    type: ValueType;
    component: string;
    defaultValue: any;
    props?: Reactive;
    rules?: Array<ValidateRule>;
    required?: boolean;
    actionsLayout?: {
        component: string;
        props?: Reactive;
    };
    actions?: Action | Action[];
    // slotName?: string,
}
```
import { isString } from 'lodash-es';
import { DefineComponent, Ref, Slot, Slots, VNodeChild } from 'vue';
import { EnumOption, Reactive, SceneContext, When } from './base';
import { mergeRefProps, travelTree, turnArray } from './helper';

export interface ComponentDesc {
    name: string;
    props?: Reactive;
    vIf?: Ref<boolean> | When | boolean;
    vShow?: Ref<boolean> | When | boolean;
    vModels?: Record<string, ModelRef>;
    disabled?: Ref<boolean> | When;
    events?: Record<string, (value: any, ...args: any[]) => void>;
    slotName?: string;
    children?: Array<string | ComponentDesc | SceneContext> | string | ComponentDesc | SceneContext;
}
// Field定义相关
export type ValueType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email' | 'any';
export interface ValidateRule {
    required?: boolean;
    type?: ValueType;
    message?: string;
    trigger?: 'blur' | 'change' | ['change', 'blur'];
    validator?(rule: ValidateRule, value: any, callback: Function): void;
    min?: number;
    max?: number;
    enum?: string;
    len?: number;
    pattern?: RegExp;
}
/** 字段描述 slotName > format > components渲染优先级 */
export interface Field {
    type?: ValueType;
    label?: string;
    name?: string;
    vIf?: Ref<boolean> | boolean | When;
    vShow?: Ref<boolean> | boolean | When;
    vModels?: Record<string, ModelRef>;
    options?: Ref<EnumOption[]> | EnumOption[] | ((model: any) => Promise<EnumOption[]>);
    props?: Reactive;
    defaultValue?: any;
    rules?: Array<ValidateRule> | Ref<Array<ValidateRule>>;
    required?: boolean | Ref<boolean>;
    components?: ComponentDesc | ComponentDesc[];
    slotName?: string;
    format?: (model: any, value: any, scheme: Scheme) => VNodeChild | string;
}

export interface Scheme {
    component: string | ComponentDesc;
    props?: Reactive;
    vModels?: Record<string, ModelRef>;
    vShow?: Ref<boolean>;
    vIf?: Ref<boolean>;
    events?: Record<string, (...args: unknown[]) => void>;
    children?: SchemeChildren;
    slots?: Slots;
    __ref?: Ref;
    __node: unknown;
}

// 上下文定义相关
export type ModelRef = { ref: Reactive; name: string };
export type SchemeChildren = Array<Scheme | string | ModelRef | Slot> | string | ModelRef | Slot;

// 常用组件类型
export const ComponentType = {
    Button: 'Button',
    Space: 'Space',
    Form: 'Form',
    FormItem: 'FormItem',
    Input: 'Input',
    InputNumber: 'InputNumber',
    Checkbox: 'Checkbox',
    CheckboxGroup: 'CheckboxGroup',
    Radio: 'Radio',
    RadioGroup: 'RadioGroup',
    Select: 'Select',
    Switch: 'Switch',
    TimePicker: 'TimePicker',
    DatePicker: 'DatePicker',
    Upload: 'Upload',
    SelectTree: 'SelectTree',
    SelectCascader: 'SelectCascader',
    Table: 'Table',
    TableColumn: 'TableColumn',
    Modal: 'Modal',
    Pagination: 'Pagination',
    Tooltip: 'Tooltip',
    Drawer: 'Drawer',
};

export function isComponent(component: DefineComponent): boolean {
    return !!(component && component.install && component.props);
}

export const findScheme = (schemes: Scheme[], node: unknown): Scheme | void => {
    if (!schemes || !node) return;
    for (let index = 0; index < schemes.length; index++) {
        const scheme = schemes[index];
        if (scheme?.__node === node) return scheme;
        const found = findScheme(scheme.children as Scheme[], node);
        if (found) return found;
    }
};

export const createScheme = (node: ComponentDesc | string | Field | SceneContext): Scheme => {
    if (isString(node)) {
        return { __node: node, component: '', children: node };
    } else if ((node as SceneContext).schemes) {
        return { __node: node, component: '', children: (node as SceneContext).schemes };
    } else {
        const scheme = { __node: node, component: node.name || '', props: {} };
        mergeRefProps(scheme, 'props', (node as ComponentDesc).props);
        return scheme;
    }
};

export const compileComponents = (all: Scheme[], components?: ComponentDesc | ComponentDesc[]) => {
    const comps = turnArray(components);
    if (comps.length) {
        const schemes = travelTree<ComponentDesc, Scheme>(comps, (node) => {
            const scheme = findScheme(all, node) || createScheme(node);
            return scheme;
        });
        if (schemes) return schemes;
    }
};

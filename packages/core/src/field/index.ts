import { defineComponent, h, mergeProps, RenderFunction, VNode } from 'vue';
import { Action, Handle, When, whenIf } from '../action';
import { Reactive } from '../base';

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

export interface ComponentDesc {
    name: string;
    props?: Reactive;
    vIf?: Reactive<boolean> | When;
    vShow?: Reactive<boolean> | When;
    disabled?: Reactive<boolean> | When;
    events?: Record<string, Handle | Handle[]>;
    slotName?: string;
    children?: ComponentDesc[];
}

export interface Field {
    name: string;
    label: string;
    type: ValueType;
    vIf?: Reactive<boolean> | When;
    vShow?: Reactive<boolean> | When;
    components?: ComponentDesc | ComponentDesc[];
    defaultValue: any;
    rules?: Array<ValidateRule>;
    required?: boolean;
    actions?: Action | Action[];
    slotName?: string;
}

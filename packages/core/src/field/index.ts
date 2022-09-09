import { defineComponent, h, mergeProps, onUpdated, RenderFunction, VNode } from 'vue';
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
    content?: string | RenderFunction;
    props?: Reactive;
    hidden?: Reactive<'if' | 'show'> | When;
    disabled?: Reactive<boolean> | When;
    events?: Record<string, Handle | Handle[]>;
    slotName?: string;
}

export interface Field {
    name: string;
    label: string;
    type: ValueType;
    hidden?: Reactive<'if' | 'show'> | When;
    components?: ComponentDesc | ComponentDesc[];
    defaultValue: any;
    rules?: Array<ValidateRule>;
    required?: boolean;
    actions?: Action | Action[];
    slotName?: string;
}

const sex: Field = {
    name: 'sex',
    label: '性别',
    hidden: whenIf('age <= 0'),
    components: [
        {
            name: 'Select',
            props: { clearable: true },
            disabled: whenIf('age = 18'),
            events: {
                onChange: (ctx, value) => console.log(value),
            },
        },
        {
            name: 'Button',
            content: '刷新',
            events: {
                onclick: (ctx, value) => console.log(value),
            },
        },
    ],
    actions: {
        when: whenIf('sex === 1'),
        handles: [],
    },
};

interface SchemeStatus {
    component: string;
    props: Reactive;
    vModel: Reactive;
    vShow: Reactive;
    vIf: Reactive;
    events: Record<string, Function>;
    children: SchemeStatus[];
}

interface SceneContext {
    scheme: SchemeStatus[];
}

const render = (schemeList) => {
    return schemeList.map((scheme) => {
        h(scheme.component, mergeProps(props), render(scheme.children));
    });
};

const Test = defineComponent({
    setup() {
        return () => {};
    },
});

onUpdated;

import { Ref } from 'vue';
import { merge, isFunction, mergeWith, isBoolean } from 'lodash-es';

/**
 * 字段状态，
 * - false 不使用
 * - true 使用
 * - hidden 使用，但页面不可见
 * - disabled 使用可见，但页面不能点击
 */
type FIELD_STATUS_TYPE = boolean | 'hidden' | 'disabled';

/** 字段类型 */
type Field_TYPE = 'text' | 'input' | 'number' | 'select' | 'date' | 'dateTime' | 'dates' | 'dateTimes' | 'radio' | 'checkbox' | 'switch' | 'time';

export interface BaseField {
    /** 字段状态 */
    status?: FIELD_STATUS_TYPE;
    /** 字段名 */
    name?: string;
    /** 字段描述 */
    label?: string;
    /** 字段映射的组件类型 */
    type?: Field_TYPE;
    /** 是否必填 */
    required?: boolean;
    /** 校验规则 */
    rules?: Array<Record<string, any>> | Record<string, any> | Function | boolean;
    /** 映射组件的属性 */
    props?: Record<string, any> | Function | boolean;
    /** 用于获取options枚举项的名字 */
    enumsName?: string,
    /** 动态的options */
    options?: Ref<Array<any>> | Array<any> | boolean
    /** 栅格占比 */
    span?: number 
}
 
export interface ModuleIgnore {
    queryIgnore?: (keyof BaseField)[]
    tableIgnore?: (keyof BaseField)[]
    insertIgnore?: (keyof BaseField)[]
    updateIgnore?: (keyof BaseField)[]
    deleteIgnore?: (keyof BaseField)[]
    viewIgnore?: (keyof BaseField)[]
}
export interface ModuleField {
    query?: BaseField | boolean
    table?: BaseField | boolean
    insert?: BaseField | boolean
    update?: BaseField | boolean
    delete?: BaseField | boolean
    view?: BaseField | boolean
}

export interface Field extends BaseField, ModuleField , ModuleIgnore {}

const defaultIgnore: ModuleIgnore = {
    queryIgnore: ['required', 'rules'],
    tableIgnore: ['required', 'rules'],
    insertIgnore: [],
    updateIgnore: [],
    deleteIgnore: ['required', 'rules'],
    viewIgnore: ['required', 'rules'],
}

const defaultAction: ModuleField = {
    query: { status: false, span: 6 },
    insert: { status: false, span: 24 },
    update: { status: false, span: 24 },
    view: { status: false, span: 24 },
    table: {status: false},
    delete: {status: false},
}

const defaultField: Field = {
    name: '',
    required: false,
    ...defaultIgnore,
};

const ignoreKeys = Object.keys(defaultIgnore);
const actionsKeys = Object.keys(defaultAction);

export function mergeField(field: Field, type: keyof ModuleField): BaseField {
    const baseField: Field = { ...(defaultAction[type] as BaseField) };
    const newField = merge({}, defaultField, field);
    // 读取基础属性，并根据忽略规则移除移除属性
    Object.keys(newField).forEach(key => {
        if (newField[`${type}Ignore`]?.includes(key as keyof BaseField)) {
            return
        }
        if (actionsKeys.includes(key) || ignoreKeys.includes(key)) {
            return;
        }
        baseField[key] = newField[key];
    })
    if (isBoolean(newField[type])) {
        baseField.status = newField[type] as boolean;
    } else if (newField[type]) {
        merge(baseField, newField[type])
    }
    console.log(baseField);
    return baseField;
}


export function getFieldProp(prop: any, ...args:any[]) {
    if (isFunction(prop)) {
        return prop(...args)
    }
    if (prop === false) {
        return;
    }
    return prop
}

export function travelFields(fields: Field[], type: keyof ModuleField, cb: (field: BaseField) => void) {
    fields.forEach(field => {
        cb && cb(mergeField(field, type))
    })
}

export function defineFields(fields: Field[]): Field[] {
    return fields.map((item) => merge({}, defaultField, item));
}

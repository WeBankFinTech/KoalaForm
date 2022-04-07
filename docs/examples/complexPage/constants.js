// complexPage/constants.js

export const KOALA_FORM_FIELD_STATUS = {
    FALSE: false, // 不使用
    TRUE: true, // 使用
    HIDDEN: 'hidden', // 使用，但页面不可见
    DISABLED: 'disabled', // 使用可见，但页面不能点击
};

export const KOALA_FORM_FIELD_TYPE = {
    TEXT: 'text',
    INPUT: 'input',
    NUMBER: 'number',
    SELECT: 'select',
    DATE: 'date',
    TIME: 'time',
    DATE_TIME: 'dateTime',
    DATES: 'dates',
    DATE_TIMES: 'dateTimes',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    SWITCH: 'switch',
};

export const KOALA_FORM_ACTION = {
    QUERY: 'query',
    INSERT: 'insert',
    UPDATE: 'update',
    DELETE: 'delete',
    VIEW: 'view',
};

export const KOALA_FORM_PROPS = {
    labelPosition: 'right',
    labelWidth: 100,
};

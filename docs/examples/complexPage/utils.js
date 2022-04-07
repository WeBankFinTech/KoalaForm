// complexPage/utils.js

export function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export const appendAll = (list, value = '', label = '全部') => [{ value, label }].concat(list);



import initialState from '/Users/aring/code/koala-form/examples/demo-with-fes/src/.fes/plugin-model/models/initialState';

export const models = {
    '@@initialState': initialState,
};


const cache = new Map();

export const useModel = (name) => {
    const modelFunc = models[name];
    if (modelFunc === undefined) {
        throw new Error('[plugin-model]: useModel, name is undefined.');
    }
    if (typeof modelFunc !== 'function') {
        throw new Error('[plugin-model]: useModel is not a function.');
    }
    if (!cache.has(name)) {
        cache.set(name, modelFunc());
    }
    return cache.get(name);
};

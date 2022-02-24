module.exports = {
    extends: ['@webank/eslint-config-ts/vue'],
    globals: {
        // 这里填入你的项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        //
        // Vue: false
        __DEV__: false,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/ban-types': 0,
    },
    env: {
        jest: true,
    },
};

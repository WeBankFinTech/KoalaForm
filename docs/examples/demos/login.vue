<template>
    <div style="width: 500px; margin: 0 auto">
        <h3 style="margin: 30px; text-align: center">欢迎使用Koala Form</h3>
        <KoalaRender :render="loginForm.render"></KoalaRender>
        <FButton long type="primary" @click="doLogin">登录</FButton>
        <FSpace justify="space-between">
            <div>没有账号，<FButton type="link" @click="doRegister">去注册</FButton></div>
            <div><FButton type="link" @click="doForget">忘记密码？</FButton></div>
        </FSpace>
    </div>
</template>

<script setup>
import { FButton, FMessage, FModal, FSpace } from '@fesjs/fes-design';
import { UserOutlined, PasswordOutlined } from '@fesjs/fes-design/icon';
import { ComponentType, KoalaRender, doGetFormData, doSubmit, doValidate, useForm, useSceneContext } from '@koala-form/core';
import { h } from 'vue';

const { ctx: loginForm } = useSceneContext('form');

const doLogin = async () => {
    await doValidate(loginForm);
    const data = doGetFormData(loginForm);
    console.log(data);
    FModal.info({
        title: '表单数据',
        content: JSON.stringify(data),
    });
    // do request

    // or doSubmit({ api: '/login', form: loginForm });
};

const doRegister = () => {
    FMessage.success('点击了去注册');
};

const doForget = () => {
    FMessage.success('忘记密码');
};

useForm({
    ctx: loginForm,
    fields: [
        {
            name: 'account',
            required: true,
            components: {
                name: ComponentType.Input,
                props: { placeholder: '请输入登录账号' },
                slots: {
                    prefix: () => h(UserOutlined),
                },
            },
        },
        {
            name: 'password',
            required: true,
            rules: [{ len: 6, message: '请输入6位密码' }],
            components: {
                name: ComponentType.Input,
                props: { type: 'password', placeholder: '请输入6位密码', maxlength: 6, showPassword: true },
                slots: {
                    prefix: () => h(PasswordOutlined),
                },
            },
        },
    ],
});
</script>

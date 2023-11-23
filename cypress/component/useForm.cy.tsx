import { ComponentType, EnumOption, FormSceneContext, composeRender, doInitFields, doValidate, useForm, useSceneContext } from '@koala-form/core';
import { defineComponent, reactive, ref } from 'vue';

const Test = defineComponent({
    setup() {
        const sexOptions: Array<EnumOption> = [
            { value: '0', label: '女' },
            { value: '1', label: '男' },
        ];

        const { ctx } = useSceneContext('form');

        const vIf = ref(true);
        const vShow = ref(true);

        const name = { name: 'name', label: '姓名', props: { id: 'name' }, components: { name: ComponentType.Input } };

        const form = useForm({
            ctx: ctx as FormSceneContext,
            fields: [
                { ...name, required: true },
                { name: 'sex', label: '性别', vIf, vShow, props: { id: 'sex' }, options: sexOptions, components: { name: ComponentType.Select } },
                {
                    label: ' ',
                    components: {
                        name: ComponentType.Space,
                        children: [
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary', id: 'doInit' },
                                children: '初始化',
                                events: {
                                    onClick: () => {
                                        doInitFields(form, { name: 'aring', sex: '0' });
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary', id: 'doValidate' },
                                children: '校验',
                                events: {
                                    onClick: async () => {
                                        try {
                                            await doValidate(form);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary', id: 'doVIf' },
                                children: '不渲染性别',
                                events: {
                                    onClick: () => (vIf.value = false),
                                },
                            },
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary', id: 'doVShow' },
                                children: '性别不可见',
                                events: {
                                    onClick: () => (vShow.value = false),
                                },
                            },
                        ],
                    },
                },
            ],
        });

        const form2 = useForm({
            fields: [{ ...name, label: '姓名2' }],
        });

        return composeRender([form.render, form2.render]);
    },
});

describe('useForm.cy.tsx', () => {
    it('表单场景渲染', () => {
        const app = cy.mount(Test);
        app.get('#name').contains('label', '姓名');
        app.get('#name').find('input');

        app.get('#sex').contains('label', '性别');
        app.get('#sex').find('.fes-select');
    });

    it('表单初始化', () => {
        const app = cy.mount(Test);
        app.get('#doInit').click();
        app.get('#name').find('input').should('have.value', 'aring');
        app.get('#sex').find('.fes-select').should('have.text', '女');
    });

    it('表单校验', () => {
        const app = cy.mount(Test);
        app.get('#doValidate').click();
        app.get('#name').find('.is-error');
        app.get('#doInit').click();
        app.get('#doValidate').click();
        app.get('#name').not('.is-error');
    });

    it('可见联动: vIf/vShow', () => {
        const app = cy.mount(Test);
        app.get('#doVShow').click();
        app.get('#sex').should('be.hidden');
        app.get('#doVIf').click();
        app.not('#sex').should('not.contain');
    });
});

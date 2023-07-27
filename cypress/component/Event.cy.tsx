import { ComponentType, EnumOption, FormSceneContext, TableSceneContext, doInitFields, doValidate, useForm, useSceneContext, useTable } from '@koala-form/core';
import { defineComponent, ref } from 'vue';

const Test = defineComponent({
    setup() {
        const {
            ctxs: [form, table],
        } = useSceneContext(['form', 'table']);

        const formValue = ref();
        const tableValue = ref();

        useForm({
            ctx: form as FormSceneContext,
            fields: [
                {
                    name: 'name',
                    label: '选中',
                    required: true,
                    components: {
                        name: ComponentType.Checkbox,
                        props: { id: 'name' },
                        events: {
                            onChange(val) {
                                formValue.value = val;
                            },
                        },
                    },
                },
                {
                    label: 'formValue',
                    components: {
                        name: 'div',
                        props: { id: 'formValue' },
                        slots: {
                            default: () => formValue.value,
                        },
                    },
                },
                {
                    label: 'tableValue',
                    components: {
                        name: 'div',
                        props: { id: 'tableValue' },
                        slots: {
                            default: () => tableValue.value,
                        },
                    },
                },
            ],
        });

        useTable({
            ctx: table as TableSceneContext,
            table: { name: ComponentType.Table },
            fields: [
                {
                    name: 'name',
                    label: '选中',
                    required: true,
                    components: {
                        name: ComponentType.Checkbox,
                        props: { id: 'colName' },
                        events: {
                            onChange(record, val) {
                                tableValue.value = record.row.name + '' + val;
                            },
                        },
                    },
                },
            ],
        });

        table.modelRef.value = [{ name: true }];

        return () => [form.render(), table.render()];
    },
});

describe('useForm.cy.tsx', () => {
    it('表单场景渲染', () => {
        const app = cy.mount(Test);
        app.get('#name').click();
        app.get('#formValue').contains('true');

        app.get('#name').click();
        app.get('#formValue').contains('false');

        app.get('#colName').click();
        app.get('#tableValue').contains('truetrue');

        app.get('#colName').click();
        app.get('#tableValue').contains('truefalse');
    });
});

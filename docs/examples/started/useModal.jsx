import { FButton, FMessage, FSpace } from '@fesjs/fes-design';
import { useModal, ComponentType, hOpen, useForm } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const form = useForm({
            fields: [
                {
                    label: '名字',
                    name: 'name',
                    components: { name: ComponentType.Input },
                },
                {
                    label: '年龄',
                    name: 'age',
                    components: { name: ComponentType.InputNumber },
                },
            ],
        });

        const modal1 = useModal({
            title: 'Modal',
            modal: {
                events: {
                    onOk() {
                        FMessage.success('点击了OK');
                    },
                    onCancel() {
                        FMessage.success('点击了Cancel');
                    },
                },
                children: form,
            },
        });

        const modal2 = useModal({
            title: 'Drawer',
            modal: {
                name: ComponentType.Drawer,
                props: { footer: true },
                events: {
                    onOk() {
                        FMessage.success('点击了OK');
                    },
                    onCancel() {
                        FMessage.success('点击了Cancel');
                    },
                },
                children: 'Drawer内容',
            },
        });

        return () => (
            <FSpace>
                <FButton onClick={() => hOpen(modal1)}>Open Modal</FButton>
                <FButton onClick={() => hOpen(modal2)}>Open Drawer</FButton>
                {modal1.render()}
                {modal2.render()}
            </FSpace>
        );
    },
});

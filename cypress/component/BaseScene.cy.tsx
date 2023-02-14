import { FButton } from '@fesjs/fes-design';
import { useScene } from '@koala-form/core';
import { defineComponent, reactive, ref } from 'vue';

const Test = defineComponent({
    setup() {
        const p1 = reactive({
            class: 'before',
            id: 'p1',
        });
        const style = ref({});
        const { render } = useScene({
            components: [
                {
                    name: 'div',
                    props: {
                        id: 'baseScene',
                        class: 'base-scene',
                    },
                    children: [
                        { name: 'h3', children: ['基础场景'] },
                        {
                            name: 'p',
                            children: ['我是基础场景的内容', { name: 'br' }, '我是基础场景的内容2'],
                        },
                    ],
                },
                {
                    name: FButton,
                    props: { type: 'primary' },
                    children: ['ClickMe'],
                    events: {
                        onClick: () => {
                            p1.class = 'after';
                            style.value = { color: 'red' };
                        },
                    },
                },
                {
                    name: 'div',
                    props: p1,
                    children: ['响应式属性'],
                },
                {
                    name: 'div',
                    props: { id: 'p2', style: style },
                    children: ['单属性响应式样式'],
                },
            ],
        });
        return render;
    },
});

describe('BaseScene.cy.tsx', () => {
    it('基础场景渲染', () => {
        const app = cy.mount(Test);
        app.get('h3').should('contain.text', '基础场景');
        app.get('p').should('contain.text', '我是基础场景的内容我是基础场景的内容2');
    });

    it('测试静态属性', () => {
        const app = cy.mount(Test);
        // 测试静态属性
        app.get('#baseScene').should('have.class', 'base-scene');
    });

    it('测试传入组件', () => {
        const app = cy.mount(Test);
        // 测试传入组件
        app.get('button').should('contain.text', 'ClickMe');
        app.get('button').should('have.class', 'fes-btn-type-primary');
    });

    it('测试响应式属性', () => {
        const app = cy.mount(Test);
        // 测试响应式属性
        app.get('#p1').should('have.class', 'before');
        app.get('button').click();
        app.get('#p1').should('have.class', 'after');
        app.get('#p2').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
});

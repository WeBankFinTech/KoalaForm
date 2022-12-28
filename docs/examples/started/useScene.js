import { useScene } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { render } = useScene({
            components: [
                {
                    name: 'div',
                    children: [
                        { name: 'h3', children: ['基础场景'] },
                        {
                            name: 'p',
                            children: ['我是基础场景的内容', { name: 'br' }, '我是基础场景的内容2'],
                        },
                    ],
                },
            ],
        });
        return render;
    },
});

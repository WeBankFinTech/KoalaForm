import { useBaseScene } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { render } = useBaseScene({
            components: [
                {
                    name: 'div',
                    children: [
                        { name: 'h3', children: ['useBaseScene'] },
                        {
                            name: 'p',
                            children: [
                                'useBaseScene，另一种写代码的方式。用ComponentDesc描述一段组件树，通过场景上下文返回的render方法，即可将组件树渲染成VNode树。',
                                { name: 'br' },
                                '插件是扩展useBaseScene功能的途径，为了将一些重复的功能更好的复用，通过插件修改场景的上下文（SceneContext）定制出一些特定的场景：useForm、useTable、usePager、useModal',
                            ],
                        },
                    ],
                },
            ],
        });
        return render;
    },
});

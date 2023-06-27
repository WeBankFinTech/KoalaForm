import DefaultTheme from 'vitepress/theme';
import examples from '../../examples';
import ExampleDoc from './components/ExampleDoc.vue'
import '../styles/index.less';
import fesd from '@fesjs/fes-design'

export default {
    ...DefaultTheme,
    enhanceApp({app}) {
        Object.keys(examples).forEach(key => {
            app.component(key, examples[key])
        })
        app.use(fesd);
        app.component('ExampleDoc', ExampleDoc)
    }
}
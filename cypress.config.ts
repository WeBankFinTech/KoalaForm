import { defineConfig } from 'cypress';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: 'vue',
            bundler: 'vite',
            viteConfig: {
                plugins: [vue(), vueJsx({})],
            },
        },
    },
    viewportWidth: 1200,
});

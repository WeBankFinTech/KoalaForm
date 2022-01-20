<template>
    <Repl :store="store"/>
</template>

<script>
import { Repl, ReplStore } from '@vue/repl';
import { version, watchEffect } from 'vue';
import '@vue/repl/style.css'
export default {
    components: { Repl },
    props: {
        abd: String,
    },
    setup() {
        const store = new ReplStore({
            // serializedState: btoa(unescape(encodeURIComponent(JSON.stringify({
            //     'User.vue': example
            // }))))
        });
        // persist state to URL hash
        watchEffect(() => history.replaceState({}, '', store.serialize()))

        store.setVueVersion(version)

        return {
            store
        }
    }
}
</script>
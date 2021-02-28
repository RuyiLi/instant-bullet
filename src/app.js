import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import { createRouter } from './router'

export function createApp () {
    const router = createRouter();

    const app = new Vue({
        router,
        render: h => h(App),
    }).$mount('#app');

    return { app, router };
}

Vue.use(Buefy, {
    defaultIconPack: 'fas',
})
createApp();
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const MainView = () => import('../views/MainView.vue');
const SongView = () => import('../views/SongView.vue');

export function createRouter () {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/songs/custom', name: 'custom-song', component: SongView },
            { path: '/songs/:songName', component: SongView },
            { path: '/', component: MainView }
        ]
    });
}
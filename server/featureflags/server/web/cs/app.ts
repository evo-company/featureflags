import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import iView from 'iview';
import locale from 'iview/dist/locale/en-US';
import 'iview/dist/styles/iview.css';

import Page from './components/Page.vue';
import Root from './components/Root.vue';
import SignIn from "./components/SignIn.vue";
import NotFound from './components/NotFound.vue';
import {createStore} from './store'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView, {locale});

let store = createStore();

const routes = [
    {name: 'home', path: '/', component: Page},
    {name: 'sign-in', path: '/sign-in', component: SignIn},
    {name: 'select', path: '/select/:selectedIds([a-f0-9;]+)', component: Page},
    {path: '*', component: NotFound}
];

let router = new VueRouter({
    routes
});

let app = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(Root)
});

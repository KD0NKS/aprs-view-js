import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/'
            , redirect: '/dashboard'
        }, {
            path: '/about'
            , name: 'about'
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            , component: () => import(/* webpackChunkName: "main" */ './views/About.vue')
        }, {
            path: '/dashboard'
            , name: 'dasbhoard'
            , component: () => import(/* webpackChunkName: "main" */ './views/Dashboard.vue')
        }, {
            path: '/map'
            , name: 'map'
            , component: () => import(/* webpackChunkName: "main" */ './views/Map.vue')
        }, {
            path: '/messages'
            , name: 'messages'
            , component: () => import(/* webpackChunkName: "main" */ './views/Messages.vue')
        }, {
            path: '/output'
            , name: 'Console'
            , component: () => import(/* webpackChunkName: "main" */ './views/Output.vue')
        }, {
            path: '/connectionSettings'
            , name: 'connectionSettings'
            , component: () => import(/* webpackChunkName: "main" */ './views/settings/ConnectionSettings.vue')
        }, {
            path: '/stationSettings'
            , name: 'stationSettings'
            , component: () => import(/* webpackChunkName: "main" */ './views/settings/StationSettings.vue')
        }
    ],
});
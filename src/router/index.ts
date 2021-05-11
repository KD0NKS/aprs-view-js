import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/'
        , redirect: '/stationSettings'
    }, {
        path: '/about'
        , name: 'about'
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        , component: () => import(/* webpackChunkName: "main" */ '../views/About.vue')
    }, {
    //    path: '/dashboard'
    //    , name: 'dasbhoard'
    //    , component: () => import(/* webpackChunkName: "main" */ '../views/Dashboard.vue')
    //}
    //, {
        path: '/map'
        , name: 'map'
        , component: () => import(/* webpackChunkName: "main" */ '../views/Map.vue')
    }, {
        path: '/messages'
        , name: 'messages'
        , component: () => import(/* webpackChunkName: "main" */ '../views/Messages.vue')
    }, {
        path: '/output'
        , name: 'Console'
        , component: () => import(/* webpackChunkName: "main" */ '../views/Output.vue')
    }, {
        path: '/connectionSettings'
        , name: 'connectionSettings'
        , component: () => import(/* webpackChunkName: "main" */ '../views/settings/ConnectionSettings.vue')
    }, {
        path: '/mapSettings'
        , name: 'mapSettings'
        , component: () => import(/* webpackChunkName: "main" */ '../views/settings/MapSettings.vue')
    }, {
        path: '/stationSettings'
        , name: 'stationSettings'
        , component: () => import(/* webpackChunkName: "main" */ '../views/settings/StationSettings.vue')
    }, {
        path: '/applicationSettings'
        , name: 'applicationSettings'
        , component: () => import(/* webpackChunkName: "main" */ '../views/settings/ApplicationSettings.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
        { path: '', component: () => import('pages/Map.vue') }
        , { path: '/map', component: () => import('pages/Map.vue') }
        , { path: '/about', component: () => import('pages/About.vue') }
        , { path: '/output', component: () => import('pages/Output.vue') }
        , { path: '/stationSettings', component: () => import('pages/settings/StationSettings.vue') }
        , { path: '/connectionSettings', component: () => import('pages/settings/ConnectionSettings.vue') }
        , { path: '/applicationSettings', component: () => import('pages/settings/ApplicationSettings.vue') }
        , { path: '/mapSettings', component: () => import('pages/settings/MapSettings.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

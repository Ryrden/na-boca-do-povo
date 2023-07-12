import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/congressperson',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: 'list',
        component: () => import('pages/CongressPersonListPage.vue'),
      },
      {
        path: 'favorites',
        component: () => import('pages/CongressPersonFavoritesListPage.vue'),
      },
    ],
  },
  {
    path: '/settings',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Settings.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

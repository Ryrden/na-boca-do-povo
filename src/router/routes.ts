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
        meta: { title: 'Listar deputados' },
        component: () => import('pages/CongressPersonListPage.vue'),
      },
      {
        path: 'detail/:id',
        name: 'CongressPersonDetail',
        meta: { title: 'Detalhes do deputado' },
        component: () => import('pages/CongressPersonPage.vue'),
      },
      {
        path: 'favorites',
        meta: { title: 'Deputados favoritos' },
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
        meta: { title: 'Configurações' },
        component: () => import('pages/SettingsPage.vue'),
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

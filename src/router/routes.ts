import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', name: 'Home', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', name: 'Register', component: () => import('pages/RegisterPage.vue') }],
  },
  {
    path: '/congressperson',
    name: 'CongressPersonPage',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: 'list',
        name: 'CongressPersonList',
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
        path: 'expenses/:id',
        name: 'CongressPersonExpenses',
        meta: { title: 'Gastos do deputado' },
        component: () => import('pages/CongressPersonExpensesPage.vue'),
      },
      {
        path: 'favorites',
        name: 'CongressPersonFavorites',
        meta: { title: 'Deputados favoritos' },
        component: () => import('pages/CongressPersonFavoritesListPage.vue'),
      },
    ],
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Settings',
        meta: { title: 'Configurações' },
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorNotFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

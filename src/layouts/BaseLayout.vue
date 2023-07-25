<template>
  <q-layout view="hHh LpR fFf" class="navigation">
    <q-header
      elevated
      v-show="router.currentRoute.value.path !== '/'"
      class="navigation"
    >
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="router.go(-1)"
        ></q-btn>
        <q-toolbar-title>{{
          router.currentRoute.value.meta.title
        }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="navigation">
      <q-tabs v-model="activeTab" align="justify">
        <q-tab name="home" icon="home" @click="navigateTo('/')" />
        <q-tab
          name="list congressperson"
          icon="groups"
          @click="navigateTo('/congressperson/list')"
        />
        <q-tab
          name="favorite congressperson"
          icon="favorite"
          @click="navigateTo('/congressperson/favorites')"
        />
        <q-tab
          name="settings"
          icon="manage_accounts"
          @click="navigateTo('/settings')"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { RouteLocationRaw, useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const router = useRouter();

const navigateTo = (route: RouteLocationRaw) => {
  router.push(route);
};

const activeTab = ref('');

const updateActiveTab = (path: RouteLocationRaw) => {
  switch (path) {
    case '/':
      activeTab.value = 'home';
      break;
    case '/congressperson/list':
      activeTab.value = 'list congressperson';
      break;
    case '/congressperson/favorites':
      activeTab.value = 'favorite congressperson';
      break;
    case '/settings':
      activeTab.value = 'settings';
      break;
  }
};

updateActiveTab(router.currentRoute.value.path);

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    updateActiveTab(newPath);
  }
);
</script>

<style>
.navigation {
  margin: auto;
  max-width: 1080px;
}
</style>

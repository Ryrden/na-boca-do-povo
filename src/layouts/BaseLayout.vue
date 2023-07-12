<template>
  <q-layout view="hHh Lpr lfr">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated>
      <q-tabs v-model="activeTab" dense align="justify">
        <q-tab name="home" icon="home" @click="navigateTo('/')" />
        <q-tab
          name="list congressperson"
          icon="people"
          @click="navigateTo('/congressperson/list')"
        />
        <q-tab
          name="favorite congressperson"
          icon="favorite"
          @click="navigateTo('/congressperson/favorites')"
        />
        <!-- TODO: allow change personal config after login (Show just if user is logged) -->
        <q-tab
          name="settings"
          icon="settings"
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

const activeTab = ref('home');

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath === '/') {
      activeTab.value = 'home';
    } else if (newPath === '/congressperson/list') {
      activeTab.value = 'list congressperson';
    } else if (newPath === '/congressperson/favorites') {
      activeTab.value = 'favorite congressperson';
    } else if (newPath === '/settings') {
      activeTab.value = 'settings';
    }
  }
);
</script>

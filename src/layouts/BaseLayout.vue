<template>
  <q-layout view="hHh Lpr lfr">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated>
      <q-tabs v-model="tab" dense align="justify">
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

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const navigateTo = (route) => {
  router.push(route);
};

const tab = ref('home');
</script>

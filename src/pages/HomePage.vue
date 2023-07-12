<template>
  <q-page>
    <div>
      <!-- TODO: Criar logo -->
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="q-pa-md">
          <q-input
            square
            filled
            v-model="username"
            label="Usuário"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor, digite seu nome',
            ]"
          />
          <q-input
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor, digite sua senha',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn icon="login" label="Entrar" type="submit" color="primary" />
        </div>
      </q-form>

      <hr />

      <div class="actions q-pa-md">
        <div class="text-h6 text-bold">Ações</div>
        <router-link to="/congressperson/list">
          <div class="action-card">
            <q-icon name="list" size="2rem" />
            <div class="text-body1 text-thin">Listar Deputados</div>
          </div>
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const isPwd = ref(true);

function onSubmit() {
  console.log(username.value);
  console.log(password.value);
}

function onReset() {
  username.value = '';
  password.value = '';
}
</script>

<style lang="sass" scoped>

.actions
  .action-card
    width: 100%
    max-width: 10rem
    text-align: center
</style>

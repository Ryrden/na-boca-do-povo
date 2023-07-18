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

          <q-btn label="Criar conta" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';

const notify = useNotify()

const username = ref('');
const password = ref('');
const isPwd = ref(true);

async function onSubmit() {
    
  try {
    await useAuthUser().register(username.value, password.value)
    notify.notifySuccess(`Conta ${username.value} criada com sucesso`)
  } catch (error) {
    notify.notifyError('Não foi possível criar uma conta')
  }
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

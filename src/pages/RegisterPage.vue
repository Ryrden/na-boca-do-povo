<template>
  <q-page>
    <div>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="q-pa-md forms">
          <q-input
            square
            filled
            v-model="username"
            type="email"
            label="E-mail"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Este campo é obrigatório!',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Este campo é obrigatório!',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            class="q-field-native"
            v-model="confirmPassword"
            filled
            type="password"
            label="Confirme sua senha"
            lazy-rules
            :rules="[
              (val) => (val && val === password) || 'As senhas não coincidem',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            v-model="dateOfBirth"
            filled
            type="date"
            label="Data de Nascimento"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            filled
            bottom-slots
            v-model="address"
            type="text"
            label="Endereço"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click="address = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:hint> Contador de caracteres </template>
          </q-input>

          <q-btn
            icon="how_to_reg"
            label="Criar conta"
            type="submit"
            color="primary"
            class="main-btn"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';

const notify = useNotify();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const dateOfBirth = ref('');
const address = ref('');
const isPwd = ref(true);

async function onSubmit() {
  try {
    if (password.value !== confirmPassword.value) {
      notify.notifyError('As senhas não coincidem');
      return;
    }

    await useAuthUser().register(username.value, password.value);
    notify.notifySuccess(`Conta ${username.value} criada com sucesso`);
  } catch (error) {
    notify.notifyError('Não foi possível criar uma conta');
  }
}

function onReset() {
  username.value = '';
  password.value = '';
}
</script>

<style lang="scss" scoped>
.forms {
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}
</style>

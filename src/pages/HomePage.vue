<template>
  <q-page>
    <div class="text-center">
      <q-img
        src="src/assets/logo.png"
        alt="Logo oficial Na Boca do Povo"
        no-spinner
        loading="eager"
        width="20rem"
      />

      <q-form @submit="onSubmit" @reset="onReset">
        <div class="q-pa-md forms">
          <q-input
            filled
            v-model="username"
            type="email"
            label="E-mail"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor, digite seu e-mail.',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            class="q-field-native"
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor, digite sua senha',
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

          <q-btn
            icon="login"
            label="Entrar"
            type="submit"
            color="primary"
            class="main-btn"
          />

          <router-link to="/register">
            <q-btn
              outline
              icon="how_to_reg"
              label="Registrar-se"
              type="reset"
              color="primary"
              class="main-btn router-link"
            />
          </router-link>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';
import { useRouter } from 'vue-router';

const notify = useNotify();
const useAuth = useAuthUser();
const router = useRouter();

const username = ref('');
const password = ref('');
const isPwd = ref(true);

async function onSubmit() {
  try {
    await useAuth.login(username.value, password.value);
    notify.notifySuccess('Login bem sucedido!');
    onLoggedIn();
  } catch (error) {
    notify.notifyError(String(error));
  }
}

function onReset() {
  username.value = '';
  password.value = '';
}

function onLoggedIn() {
  router.push('/congressperson/list');
}

onMounted(async () => {
  if (useAuth.isLoggedIn()) {
    const user = useAuth?.user;

    username.value = user?.value?.email || '';
    password.value = 'XXXXXXXXX';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        notify.notifySuccess(
          'Você já está logado, caso quiser deslogar, vá até a tela de configurações'
        );
        onLoggedIn();
        onReset();
        resolve();
      }, 2000);
    });
  }
});
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

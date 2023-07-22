<template>
  <div class="q-pa-md">
    <div v-if="isUserLoggedIn">
      <q-card class="card">
        <img src="src/assets/images/user.jpg" />

        <q-card-section
          class="text-h6 text-center primary-title"
          color="secondary"
        >
          Informações Pessoais
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">E-mail: {{ user?.email }}</div>
          <q-separator class="q-my-md" />
          <div class="text-subtitle2">
            Conta criada em: {{ formatDate(user?.created_at) }}
          </div>
        </q-card-section>

        <q-btn
          filled
          full-width
          label="Logout"
          color="primary main-btn"
          @click="handleLogout"
        />
      </q-card>
    </div>

    <div v-else>
      <h6 class="text-h6 primary-title text-center q-mb-md">
        Você precisa estar logado para visualizar suas configurações e
        informações de usuário
      </h6>

      <q-btn
        filled
        full-width
        label="Fazer Login"
        color="primary main-btn"
        @click="handleLogin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@supabase/supabase-js';
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';
import { Ref, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { dataFormat } from 'src/utils/format';

const authUser = useAuthUser();
const notify = useNotify();
const router = useRouter();

const isUserLoggedIn = ref<boolean>(false);

const user: Ref<User | null> = ref(null);

function formatDate(date: string | undefined) {
  if (!date) {
    return '';
  }

  return dataFormat(date);
}

function handleLogout() {
  authUser
    .logout()
    .then(() => {
      notify.notifySuccess('Você foi deslogado com sucesso!');
      navigateToHome();
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_) => notify.notifyError('Não foi possível finalizar sua sessão.'));
}

function handleLogin() {
  navigateToHome();
}

function navigateToHome() {
  router.push('/');
}

onMounted(async () => {
  isUserLoggedIn.value = authUser.isLoggedIn();

  const loggedUser = authUser?.user;

  user.value = loggedUser.value;
});
</script>

<style lang="scss" scoped>
.card {
  max-width: 400px;
  margin: 0 auto;
  padding: 0.8rem;
}
</style>

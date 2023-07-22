<template>
    <div class="q-pa-md">
        <div v-if="isUserLoggedIn">
            <p>Logado com o email: {{ user?.email }}!</p>
            <q-separator />
            <p class="q-pt-md">Conta criada e ativa desde: {{ user?.created_at }}!</p>
        </div>
        <q-btn v-if="isUserLoggedIn" label="Logout" color="primary" @click="handleLogout" />
        <div v-else>
            <p>Você precisa estar logado para visualizar suas configurações e informações de usuário</p>
            <q-btn label="Login" color="primary" @click="handleLogin" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { User } from '@supabase/supabase-js';
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';
import { Ref, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const authUser = useAuthUser();
const notify = useNotify();
const router = useRouter();

const isUserLoggedIn = ref<boolean>(false);

const user: Ref<User | null> = ref(null);

function handleLogout() {
    authUser.logout()
        .then(() => {
            notify.notifySuccess('Deslogado com sucesso!')
            navigateToHome()
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_) => notify.notifyError('Por algum motivo, não foi possível finalizar sua sessão'))
}

function handleLogin() {
    navigateToHome()
}

function navigateToHome() {
    router.push('/')
} 

onMounted(async () => {
  isUserLoggedIn.value = authUser.isLoggedIn();

  const loggedUser = authUser?.user;

  user.value = loggedUser.value
});

</script>

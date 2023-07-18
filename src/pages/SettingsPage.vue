<template>
    <q-btn label="Logout" color="primary" @click="handleLogout" />
</template>

<script setup lang="ts">
import { useAuthUser } from 'src/composables/useAuthUser';
import { useNotify } from 'src/composables/useNotify';

const authUser = useAuthUser();
const notify = useNotify();

function handleLogout() {
    authUser.logout()
        .then(() => notify.notifySuccess('Deslogado com sucesso!'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_) => notify.notifyError('Por algum motivo, não foi possível finalizar sua sessão'))
}

</script>

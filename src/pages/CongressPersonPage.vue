<template>
  <q-page>
    <!-- <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-img
            :src="congressPersonId.value.ultimoStatus.urlFoto"
            spinner-color="blue"
            fit="contain"
            width="3.5rem"
            style="border-radius: 5%"
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-body1">{{
          congressPersonId.value.nomeCivil
        }}</q-item-label>
        <q-item-label caption class="text-caption">{{
          congressPersonId.value.ultimoStatus.siglaPartido
        }}</q-item-label>
      </q-item-section>
    </q-item> -->
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const router = useRouter();

const congressPersonId = ref();

onMounted(async () => {
  congressPersonId.value = router.currentRoute.value.params.id;

  try {
    const response = await api.get(`/deputados/${congressPersonId.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    // TODO: Armazenar dados no pinia com um timestamp de expiração de 1 hora e usar os dados do pinia ao invés de fazer uma nova requisição
    congressPersonId.value = response.data.dados;
    console.log(congressPersonId.value);
  } catch (error) {
    console.error(error);
  }
});
</script>

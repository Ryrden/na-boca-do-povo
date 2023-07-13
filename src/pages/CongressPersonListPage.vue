<template>
  <q-page>
    <q-virtual-scroll :items="congressPersonList" separator v-slot="{ item }">
      <q-item :key="item.id" class="row items-center justify-between">
        <router-link
          :to="`/congressperson/detail/${item.id}`"
          class="row"
          clickable
        >
          <q-img
            :src="item.urlFoto"
            spinner-color="blue"
            fit="contain"
            width="3.5rem"
            style="border-radius: 5%"
          />
          <q-item-section class="q-px-md">
            <q-item-label class="text-body1">{{ item.nome }}</q-item-label>
            <q-item-label caption class="text-caption">{{
              item.siglaPartido
            }}</q-item-label>
          </q-item-section>
        </router-link>
        <q-icon
          name="favorite_border"
          color="primary"
          size="24px"
          @click="toggleFavorite(item)"
        />
      </q-item>
    </q-virtual-scroll>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const congressPersonList = ref([]);

// TODO: alterar tipo do item baseado no tipo correto
function toggleFavorite(item: unknown) {
  console.log(item);
}

onMounted(async () => {
  try {
    const response = await api.get('/deputados', {
      params: {
        ordem: 'ASC',
        ordenarPor: 'nome',
      },
    });
    // TODO: Armazenar dados no pinia com um timestamp de expiração de 1 hora e usar os dados do pinia ao invés de fazer uma nova requisição
    congressPersonList.value = response.data.dados.splice(0, 20);
  } catch (error) {
    console.error(error);
  }
});
</script>

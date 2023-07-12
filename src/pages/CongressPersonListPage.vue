<template>
  <q-page>
    Congress Person List
    <q-virtual-scroll
      :items="congressPersonList"
      separator
      v-slot="{ item, index }"
    >
      <q-item :key="index" class="row items-center justify-between">
        {{ item.nome }}
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

// TODO: alterar tipo do item baseado no tipo correto
function seeCongressPersonDetail(item: unknown) {
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
    congressPersonList.value = response.data.dados;
  } catch (error) {
    console.error(error);
  }
});
</script>

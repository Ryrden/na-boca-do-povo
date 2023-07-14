<template>
  <q-page>
    <!-- Fixar no topo -->
    <div class="q-pa-md row justify-between">
      <!-- TODO: Fazer o q-input ocupar 100% do espaço (width) -->
      <q-input
        dense
        filled
        clearable
        v-model="search"
        label="Pesquisar"
        debounce="500"
        :loading="loadingSearchState"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn round dense flat icon="filter_alt" @click="showModal = true" />
    </div>

    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Olá mundo
          <!-- TODO: Filtro da API -->
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- TODO: Criar Skeleton -->
    <q-virtual-scroll
      :items="
        congressPersonListFiltered.length
          ? congressPersonListFiltered
          : congressPersonList
      "
      separator
      virtual-scroll-slice-size="10"
      v-slot="{ item }"
    >
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
import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';

const showModal = ref(false);

const congressPersonList = ref([]);
const congressPersonListFiltered = ref([]);

// TODO: alterar tipo do item baseado no tipo correto
function toggleFavorite(item: unknown) {
  console.log(item);
}

const search = ref('');
const loadingSearchState = ref(false);

async function getFilteredCongressPersonList() {
  console.log(search.value);
  try {
    loadingSearchState.value = true;
    const response = await api.get('/deputados', {
      params: {
        ordem: 'ASC',
        ordenarPor: 'nome',
        nome: search.value,
      },
    });
    if (!response.data.dados) {
      throw new Error('Dados não encontrados');
    }
    congressPersonListFiltered.value = response.data.dados;
    loadingSearchState.value = false;
  } catch (error) {
    console.error(error);
  }
}

watch(search, getFilteredCongressPersonList);

onMounted(async () => {
  try {
    loadingSearchState.value = true;
    const response = await api.get('/deputados', {
      params: {
        ordem: 'ASC',
        ordenarPor: 'nome',
      },
    });
    if (!response.data.dados) {
      throw new Error('Dados não encontrados');
    }
    // TODO: Armazenar dados no pinia com um timestamp de expiração de 1 hora e usar os dados do pinia ao invés de fazer uma nova requisição
    congressPersonList.value = await response.data.dados;
    loadingSearchState.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

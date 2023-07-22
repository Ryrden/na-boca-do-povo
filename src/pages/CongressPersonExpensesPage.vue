<template>
  <q-virtual-scroll
    v-if="CongressPersonExpensesData.dados"
    :items="CongressPersonExpensesData.dados"
    separator
    virtual-scroll-slice-size="10"
    v-slot="{ item, index }"
  >
    <q-item
      :key="item.codDocumento + Math.random() + index"
      class="row items-center justify-between"
    >
      <!-- Adicione aqui os campos que deseja exibir do objeto "RegistroCota" -->
      <q-item-section class="q-px-md">
        <q-item-label class="text-body1"
          >Data: Mês: {{ item.mes }} - Ano: {{ item.ano }}</q-item-label
        >
        <q-item-label class="text-body1"
          >Tipo: {{ item.tipoDespesa }}</q-item-label
        >
        <q-item-label class="text-body1"
          >Valor: R$ {{ item.valorLiquido }}</q-item-label
        >
        <!-- Adicione outros campos aqui conforme necessário -->
      </q-item-section>
    </q-item>
  </q-virtual-scroll>
  <q-item v-else>
    <q-item-section>
      <q-item-label class="text-h6">Nenhum resultado encontrado</q-item-label>
    </q-item-section>
  </q-item>
  <!-- Paginação, voltar, avançar e ultima página -->
  <q-item v-if="CongressPersonExpensesData.links">
    <!-- FIXME: Melhorar a navegação e tirar warning do typescript -->
    <q-item-section>
      <q-btn
        @click="
          refreshData(
            CongressPersonExpensesData.links.find(
              (link) => link.rel === 'first'
            )?.href || ''
          )
        "
        color="primary"
        icon="first_page"
        :disable="loadingData"
      />
    </q-item-section>
    <q-item-section>
      <q-btn
        @click="
          refreshData(
            CongressPersonExpensesData.links.find(
              (link) => link.rel === 'previous'
            )?.href || ''
          )
        "
        color="primary"
        icon="arrow_back"
        :disable="loadingData"
      />
    </q-item-section>
    <q-item-section>
      <q-btn
        @click="
          refreshData(
            CongressPersonExpensesData.links.find((link) => link.rel === 'next')
              ?.href || ''
          )
        "
        color="primary"
        icon-right="arrow_forward"
        :disable="loadingData"
      />
    </q-item-section>
    <q-item-section class="q-ma">
      <q-btn
        @click="
          refreshData(
            CongressPersonExpensesData.links.find((link) => link.rel === 'last')
              ?.href || ''
          )
        "
        color="primary"
        icon-right="last_page"
        :disable="loadingData"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { CongressPersonExpenses } from '../models/congressPersonExpenses';

const CongressPersonExpensesData = ref<Partial<CongressPersonExpenses>>({});

const router = useRouter();

const loadingData = ref(false);

async function refreshData(url: string) {
  try {
    loadingData.value = true;
    if (url === '') throw new Error('Não há mais registros');

    const response = await api.get(url);
    CongressPersonExpensesData.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loadingData.value = false;
  }
}

onMounted(async () => {
  try {
    const congressPersonDataId = router.currentRoute.value.params.id;
    //TODO: tratar vulnerabilidades de segurança
    loadingData.value = true;
    const response = await api.get(
      `/deputados/${congressPersonDataId}/despesas`,
      {
        params: {
          ordem: 'ASC',
          ordenarPor: 'ano',
        },
      }
    );
    CongressPersonExpensesData.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loadingData.value = false;
  }
});
</script>

<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
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
        :disable="loadingSearchState"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn round dense flat icon="filter_alt" @click="showModal = true" />
    </div>

    <q-dialog v-model="showModal" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <!-- TODO: Listar as opções com Nome completo + Sigla -->
        <!-- FIXME: Nome da opção selecionada não aparece  -->
        <q-card-section>
          <q-select
            v-model="specificFilter.siglaPartido"
            :options="entourageOptions"
            label="Sigla Partido"
            clearable
            :disable="loadingSearchState"
          />
          <q-select
            v-model="specificFilter.siglaUf"
            :options="ufOptions"
            label="Sigla UF"
            clearable
            :disable="loadingSearchState"
          />
          <q-select
            v-model="specificFilter.sexo"
            :options="genderOptions"
            label="Sigla Sexo"
            clearable
            :disable="loadingSearchState"
          />
        </q-card-section>
        <q-card-section style="display: flex; justify-content: center">
          <q-btn
            label="Filtrar"
            color="primary"
            class="full-width"
            @click="getFilteredCongressPersonList"
            dense
          />
          <!-- Cancelar - Limpar filtros -->
          <q-btn
            dense
            label="Cancelar"
            color="primary"
            class="full-width"
            flat
            @click="clearFiltersAndCloseModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- TODO: Criar Skeleton -->
    <q-virtual-scroll
      v-if="congressPersonListFiltered.length"
      :items="congressPersonListFiltered"
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
            alt="Foto do deputado"
            no-spinner
            loading="eager"
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
    <q-item v-else>
      <q-item-section>
        <q-item-label class="text-h6">Nenhum resultado encontrado</q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { useNotify } from 'src/composables/useNotify';
import { useFavorites } from 'src/composables/useFavorites';
import { useAuthUser } from 'src/composables/useAuthUser';
import { CongressPerson } from 'src/core/CongressPersonInterface';

const notify = useNotify()
const favorites = useFavorites()
const authUser = useAuthUser()

const showModal = ref(false);

const congressPersonListFiltered = ref([]);

// Filtros
const entourageOptions = ref([]);
const ufOptions = [
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MG',
  'MS',
  'MT',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SE',
  'SP',
  'TO',
];

const genderOptions = ['F', 'M'];

// TODO: alterar tipo do item baseado no tipo correto
async function toggleFavorite(congressPerson: CongressPerson & { favorite: boolean }) {

  if (authUser.isUnauthenticated()) {
    notify.notifyError('Você precisa estar logado para favoritar esse deputado')
    return
  }

  try {
    const userId: string | undefined = authUser?.user?.value?.id

    if (congressPerson.favorite) {
      await favorites.addFavorite(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId!,
        congressPerson.id,
        congressPerson.urlFoto,
        congressPerson.nome,
        congressPerson.siglaPartido,
      );
      notify.notifySuccess(`Deputado ${congressPerson.nome} favoritado com sucesso!`)
      
    } else {
      await favorites.deleteFavorite(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId!,
        congressPerson.id,
      );
      notify.notifySuccess(`Deputado ${congressPerson.nome} desfavoritado com sucesso!`);
    }
  } catch (_) {
    notify.notifyError('Não foi possível realizar essa ação')
  }
}
const loadingSearchState = ref(false);

interface CongressPersonFilter {
  siglaPartido: string;
  siglaUf: string;
  sexo: string;
}

const search = ref('');
const specificFilter: Partial<CongressPersonFilter> = {};

async function fetchCongressPersonList(params: Record<string, string | undefined>): Promise<void> {
  try {
    loadingSearchState.value = true;
    const response = await api.get('/deputados', { params });
    if (!response.data.dados) {
      throw new Error('Dados não encontrados');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    congressPersonListFiltered.value = response.data.dados.map((item: CongressPerson) => {
      return {
        ...item, favorite: false
      }
    });
    loadingSearchState.value = false;
    showModal.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function fetchEntourageList() {
  try {
    const response = await api.get('/partidos', {
      params: {
        itens: 100,
      },
    });
    if (!response.data.dados) {
      throw new Error('Dados não encontrados');
    }
    entourageOptions.value = response.data.dados.map(({ sigla }: { sigla: string }) => sigla);
  } catch (error) {
    console.error(error);
  }
}

async function getFilteredCongressPersonList() {
  const params = {
    ordem: 'ASC',
    ordenarPor: 'nome',
    nome: search.value,
    siglaPartido: specificFilter.siglaPartido ?? '',
    siglaUf: specificFilter.siglaUf ?? '',
    siglaSexo: specificFilter.sexo ?? '',
  };
  await fetchCongressPersonList(params);
}

async function clearFiltersAndCloseModal() {
  specificFilter.siglaPartido = '';
  specificFilter.siglaUf = '';
  specificFilter.sexo = '';
  await fetchCongressPersonList(params);
}

const params = {
  ordem: 'ASC',
  ordenarPor: 'nome',
  nome: search.value,
  siglaPartido: specificFilter.siglaPartido ?? '',
  siglaUf: specificFilter.siglaUf ?? '',
  siglaSexo: specificFilter.sexo ?? '',
};

watch(search, getFilteredCongressPersonList);

onMounted(async () => {
    await fetchCongressPersonList(params);
    await fetchEntourageList();
    // TODO: Armazenar dados no pinia com um timestamp de expiração de 1 hora e usar os dados do pinia ao invés de fazer uma nova requisição
});
</script>
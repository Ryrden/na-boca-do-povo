<template>
  <q-page>
    <div class="q-pa-md row justify-between w-90">
      <q-input
        dense
        filled
        clearable
        v-model="search"
        label="Pesquisar"
        debounce="1000"
        style="width: 80%"
        :loading="loadingSearchState"
        :disable="loadingSearchState"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        filled
        color="secondary"
        icon="filter_alt"
        style="width: 15%"
        @click="showModal = true"
      />
    </div>
    <q-dialog v-model="showModal" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Fechar Filtros</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="siglaPartido"
            :options="entourageOptions"
            label="Sigla Partido"
            clearable
            :disable="loadingSearchState"
          />
          <q-select
            v-model="siglaUf"
            :options="ufOptions"
            label="Sigla UF"
            clearable
            :disable="loadingSearchState"
          />
          <q-select
            v-model="siglaSexo"
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

    <div class="w-90">
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
            class="row router-link"
            clickable
          >
            <q-img
              :src="item.urlFoto"
              alt="Foto do deputado"
              no-spinner
              loading="eager"
              fit="contain"
              width="3.5rem"
              style="border-radius: 10%"
            />
            <q-item-section class="q-px-sm">
              <q-item-label class="text-h6 primary-title"
                >{{ item.nome }}
                <!-- TODO: Informar se está em exercicio da profissão aqui também -->
              </q-item-label>
              <q-item-label caption class="text-caption">
                <q-chip class="chip">{{ item.siglaPartido }}</q-chip>
              </q-item-label>
            </q-item-section>
          </router-link>
          <q-icon
            :name="item.favorite ? 'favorite' : 'favorite_border'"
            color="primary"
            size="24px"
            @click="toggleFavorite(item)"
          />
        </q-item>
      </q-virtual-scroll>

      <q-item v-else class="text-center">
        <q-item-section>
          <q-item-label class="text-h6"
            >Nenhum resultado encontrado</q-item-label
          >
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { useNotify } from 'src/composables/useNotify';
import { useFavorites, Favorite } from 'src/composables/useFavorites';
import { useAuthUser } from 'src/composables/useAuthUser';
import { CongressPerson } from 'src/core/CongressPersonInterface';

const notify = useNotify();
const favorites = useFavorites();
const authUser = useAuthUser();

const showModal = ref(false);

const loadingSearchState = ref(false);

const search = ref('');
const siglaPartido = ref('');
const siglaUf = ref('');
const siglaSexo = ref('');

const congressPersonListFiltered = ref<CongressPerson[]>([]);

// Filtros
/* 
TODO: 
Passar todos os filtros para um componente, usar "Emit" 
para passar os valores para o componente pai e usar o "watch" 
para atualizar a lista de deputados 
*/
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

async function toggleFavorite(
  congressPerson: CongressPerson & { favorite: boolean }
) {
  if (authUser.isUnauthenticated()) {
    notify.notifyError(
      'Você precisa estar logado para favoritar esse deputado'
    );
    return;
  }

  try {
    const userId: string | undefined = authUser?.user?.value?.id;

    if (congressPerson.favorite) {
      await favorites.deleteFavorite(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId!,
        congressPerson.id
      );
      notify.notifySuccess(
        `Deputado ${congressPerson.nome} desfavoritado com sucesso!`
      );
    } else {
      await favorites.addFavorite(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId!,
        congressPerson.id,
        congressPerson.urlFoto,
        congressPerson.nome,
        congressPerson.siglaPartido
      );
      notify.notifySuccess(
        `Deputado ${congressPerson.nome} favoritado com sucesso!`
      );
    }

    congressPerson.favorite = !congressPerson.favorite;
  } catch (_) {
    notify.notifyError('Não foi possível realizar essa ação');
  }
}

async function fetchCongressPersonList(
  params: Record<string, string | undefined>
): Promise<void> {
  const userId: string = authUser?.user?.value?.id || '';
  let favoritesList: Favorite[] = [];

  try {
    favoritesList = userId
      ? await favorites.fetchFavorites(userId)
      : favoritesList;
  } catch (e) {
    console.log(e);
  }
  try {
    loadingSearchState.value = true;
    const response = await api.get('/deputados', { params });
    if (!response.data.dados) {
      throw new Error('Dados não encontrados');
    }
    const favoritesSet = new Set(
      favoritesList.map((favorite) => favorite.favorite_congress_person_id)
    );
    congressPersonListFiltered.value = response.data.dados.map(
      (item: CongressPerson) => {
        return {
          ...item,
          favorite: favoritesSet.has(item.id),
        };
      }
    );
  } catch (error) {
    console.error(error);
  } finally {
    loadingSearchState.value = false;
    showModal.value = false;
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

    entourageOptions.value = response.data.dados.map(
      ({ sigla }: { sigla: string }) => sigla
    );
  } catch (error) {
    console.error(error);
  }
}

async function getFilteredCongressPersonList() {
  const params = {
    ordem: 'ASC',
    ordenarPor: 'nome',
    nome: search.value,
    siglaPartido: siglaPartido.value ?? '',
    siglaUf: siglaUf.value ?? '',
    siglaSexo: siglaSexo.value ?? '',
  };
  await fetchCongressPersonList(params);
}

async function clearFiltersAndCloseModal() {
  siglaPartido.value = '';
  siglaUf.value = '';
  siglaSexo.value = '';
  await fetchCongressPersonList(params);
}

const params = {
  ordem: 'ASC',
  ordenarPor: 'nome',
  nome: search.value,
  siglaPartido: siglaPartido.value ?? '',
  siglaUf: siglaUf.value ?? '',
  siglaSexo: siglaSexo.value ?? '',
};

watch(search, getFilteredCongressPersonList);

onMounted(async () => {
  await fetchCongressPersonList(params);
  await fetchEntourageList();
});
</script>

<style lang="scss" scoped>
.w-90 {
  padding: 1rem 2rem;
  margin: auto;
}
</style>

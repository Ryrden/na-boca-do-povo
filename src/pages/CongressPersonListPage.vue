<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
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
        <!-- FIXME: Nome da opção selecionada não aparece  -->
        <q-card-section>
          <q-select
            v-model="specificFilter.siglaPartido"
            :options="entourageOptions"
            label="Sigla Partido"
            :disable="loadingSearchState"
          />
          <q-select
            v-model="specificFilter.siglaUf"
            :options="ufOptions"
            label="Sigla UF"
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
              <q-item-label class="text-h6 primary-title">{{
                item.nome
              }}</q-item-label>
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

      <q-item v-else>
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

const congressPersonListFiltered = ref([]);

// Filtros
const entourageOptions = ref([]);
const ufOptions = [
  'AC - Acre',
  'AL - Alagoas',
  'AM - Amazonas',
  'AP - Amapá',
  'BA - Bahia',
  'CE - Ceará',
  'DF - Distrito Federal',
  'ES - Espírito Santo',
  'GO - Goiás',
  'MA - Maranhão',
  'MG - Minas Gerais',
  'MS - Mato Grosso do Sul',
  'MT - Mato Grosso',
  'PA - Pará',
  'PB - Paraíba',
  'PE - Pernambuco',
  'PI - Piauí',
  'PR - Paraná',
  'RJ - Rio de Janeiro',
  'RN - Rio Grande do Norte',
  'RO - Rondônia',
  'RR - Roraima',
  'RS - Rio Grande do Sul',
  'SC - Santa Catarina',
  'SE - Sergipe',
  'SP - São Paulo',
  'TO - Tocantins',
];

const genderOptions = ['F - Feminino', 'M - Masculino'];

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
const loadingSearchState = ref(false);

interface CongressPersonFilter {
  siglaPartido: string;
  siglaUf: string;
  sexo: string;
}

const search = ref('');
const specificFilter: Partial<CongressPersonFilter> = {};

async function fetchCongressPersonList(
  params: Record<string, string | undefined>
): Promise<void> {
  const userId: string | undefined = authUser?.user?.value?.id;

  let favoritesList: Favorite[] = [];

  // O fetchFavorites não é feito no try só pra ter mais resiliência, pois se caso o usuário não estivesse logado, o mesmo não seria capaz nem de visualizar a listagem dos deputados
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  favorites
    .fetchFavorites(userId!)
    .then((result) => (favoritesList = result))
    .catch((e) => {
      console.log(e);
    })
    .finally(async () => {
      try {
        loadingSearchState.value = true;
        const response = await api.get('/deputados', { params });
        if (!response.data.dados) {
          throw new Error('Dados não encontrados');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        congressPersonListFiltered.value = response.data.dados.map(
          (item: CongressPerson) => {
            // Melhora a complexidade disso aqui
            return {
              ...item,
              favorite: favoritesList.some(
                (favorite) => item.id === favorite.favorite_congress_person_id
              ),
            };
          }
        );
        loadingSearchState.value = false;
        showModal.value = false;
      } catch (error) {
        console.error(error);
      }
    });
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
      ({ sigla, nome }: { sigla: string; nome: string }) => sigla + ' - ' + nome
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

<style lang="scss" scoped>
.w-90 {
  padding: 1rem 2rem;
  margin: auto;
}

.input-field {
  width: 80%;
}

.filter-btn {
  width: 15%;
}
</style>

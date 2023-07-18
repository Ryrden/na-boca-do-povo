<template>
    <q-page>
        <q-virtual-scroll
      v-if="congressPersonFavoritesList.length"
      :items="congressPersonFavoritesList"
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
            @click="removeFavorite(item)"
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
import { useNotify } from 'src/composables/useNotify';
import { useFavorites } from 'src/composables/useFavorites';
import { useAuthUser } from 'src/composables/useAuthUser';
import { CongressPerson } from 'src/core/CongressPersonInterface';
import { Ref, onMounted, ref } from 'vue';

const notify = useNotify();
const favorites = useFavorites();
const authUser = useAuthUser();

const congressPersonFavoritesList: Ref<CongressPerson[]> = ref([]);

async function removeFavorite(congressPerson: CongressPerson) {
  console.log(congressPerson);
  console.log(authUser.user.value);

  try {
    const userId: string | undefined = authUser?.user?.value?.id;

    await favorites.deleteFavorite(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId!,
      congressPerson.id,
    );
    notify.notifySuccess(`Deputado ${congressPerson.nome} desfavoritado com sucesso!`);
  } catch (_) {
    notify.notifyError('Não foi possível desfavoritar esse deputado');
  }
}

onMounted(async () => {

  if (authUser.isUnauthenticated()) {
    notify.notifyError('Você precisa estar logado para visualizar seus deputados favoritados!');
    return;
  }

  try {
    const userId: string | undefined = authUser?.user?.value?.id;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const favoritesList = await favorites.fetchFavorites(userId!);

    const mapped = favoritesList.map((favorite) => <CongressPerson>{
      id: favorite.favorite_congress_person_id,
      uri: '',
      nome: favorite.favorite_congress_person_name,
      siglaPartido: favorite.favorite_congress_person_party,
      uriPartido: '',
      siglaUf: '',
      idLegislatura: 0,
      urlFoto: favorite.favorite_congress_person_image_url,
      email: '',
    })

    congressPersonFavoritesList.value = mapped;
  } catch (_) {
    notify.notifyError('Por algum motivo não foi possível buscar seus deputados favoritados, tente novamente mais tarde');
  }
});
</script>
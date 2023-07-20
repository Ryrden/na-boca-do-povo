<template>
  <q-page v-if="congressPersonData">
    <q-item class="row">
      <q-img
        v-if="congressPersonData.ultimoStatus?.urlFoto"
        :key="congressPersonData.id"
        :src="congressPersonData.ultimoStatus?.urlFoto"
        spinner-color="blue"
        fit="contain"
        width="5rem"
        class="q-mr-md"
        style="border-radius: 5%"
      />
      <q-icon v-else name="person" size="10rem" />
      <q-item-section>
        <div class="text-h5">{{ congressPersonData.ultimoStatus?.nome }}</div>
        <div caption class="text-subtitle1">
          {{ congressPersonData.ultimoStatus?.siglaPartido }}
        </div>
        <!-- Titular em exercicion -->
        <div caption class="text-subtitle1">
          <q-icon
            :name="
              congressPersonData.ultimoStatus?.situacao === 'Exercício'
                ? 'check_circle'
                : 'cancel'
            "
            :color="
              congressPersonData.ultimoStatus?.situacao === 'Exercício'
                ? 'green'
                : 'red'
            "
          />
          {{
            congressPersonData.ultimoStatus?.situacao === 'Exercício'
              ? 'Titular em exercício'
              : `Fora do exercício do mandato: ${congressPersonData.ultimoStatus?.situacao}`
          }}
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section class="row">
        <div class="text-h6">Dados Pessoais</div>
        <!-- icone Telefone  -->
        <q-item-label class="text-subtitle1">
          <q-icon name="phone" size="2rem" color="primary" alt="Telefone" />
          <!-- TODO: Adicionar DDD (XX) XXXX-XXXX -->
          {{
            congressPersonData.ultimoStatus?.gabinete.telefone ||
            'Não informado'
          }}
        </q-item-label>
        <!-- Email -->
        <q-item-label class="text-subtitle1">
          <q-icon name="email" size="2rem" color="primary" alt="Email" />
          {{ congressPersonData.ultimoStatus?.email || 'Não informado' }}
        </q-item-label>
        <!-- Gabinete (endereço) -->
        <q-item-label class="text-subtitle1">
          <q-icon
            name="location_on"
            size="2rem"
            color="primary"
            alt="Informações do gabinete"
          />
          Gabinete:
          {{
            congressPersonData.ultimoStatus?.gabinete.predio || 'Não informado'
          }}
          - Anexo:
          {{
            congressPersonData.ultimoStatus?.gabinete.sala || 'Não informado'
          }}
        </q-item-label>
        <!-- Data de nascimento -->
        <q-item-label class="text-subtitle1">
          <q-icon
            name="cake"
            size="2rem"
            color="primary"
            alt="Data de nascimento"
          />
          <!-- TODO: Mudar formato para DD/MM/AAAA -->
          {{ congressPersonData.dataNascimento || 'Não informado' }}
        </q-item-label>
        <!-- Escolaridade -->
        <q-item-label class="text-subtitle1">
          <q-icon
            name="school"
            size="2rem"
            color="primary"
            alt="Nível de Escolaridade"
          />
          {{ congressPersonData.escolaridade || 'Não informado' }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-if="congressPersonData.redeSocial?.length">
      <q-item-section class="row">
        <div class="text-h6">Redes Sociais</div>
        <!-- https://<redesocialNome>.com.br/<algumacoisa[Opcional]>/<arroba> -->
        <!-- create a clickable link -->
        <q-item-label
          v-for="social in congressPersonData.redeSocial"
          @click="openURL(social)"
          clickable
          :key="social"
          class="text-subtitle1"
        >
          <q-icon
            :name="`mdi-${socialMedias.find((socialMedia) =>
              social.includes(socialMedia)
            )}`"
            size="2rem"
            color="primary"
            alt="Rede Social"
          />
          <!-- TODO: add underline to know that this is clickable -->
          Link: {{ social }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- FIXME: justify-center é apenas no mobile, breakpoint n ta workando (justify-md-center)-->
    <q-item class="justify-center">
      <q-btn
        @click="openURL(`${camaraURL}/${congressPersonData.id}`)"
        color="primary"
        >Ver mais no site oficial da Câmara</q-btn
      >
    </q-item>
    <q-item class="justify-center">
      <q-btn
        @click="$router.push(`/congressperson/expenses/${congressPersonData.id}`)"
        color="primary"
        >visualizar cotas parlamentares</q-btn
      >
    </q-item>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { Dados } from 'models/congressPerson';
import { openURL } from 'quasar';

const router = useRouter();

const socialMedias = [
  'facebook',
  'twitter',
  'instagram',
  'youtube',
  'linkedin',
];

const congressPersonData = ref<Partial<Dados>>({});
const camaraURL = 'https://www.camara.leg.br/deputados';

onMounted(async () => {
  const congressPersonDataId = router.currentRoute.value.params.id;
  try {
    const response = await api.get(`/deputados/${congressPersonDataId}`);
    congressPersonData.value = response.data.dados;
  } catch (error) {
    console.error(error);
  }
});
</script>

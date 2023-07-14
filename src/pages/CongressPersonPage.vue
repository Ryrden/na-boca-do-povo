<template>
  <q-page v-if="congressPerson">
    <q-item class="row">
      <q-img
        v-if="congressPerson.ultimoStatus.urlFoto"
        :key="congressPerson.id"
        :src="congressPerson.ultimoStatus.urlFoto"
        spinner-color="blue"
        fit="contain"
        width="5rem"
        class="q-mr-md"
        style="border-radius: 5%"
      />
      <q-icon v-else name="person" size="10rem" />
      <q-item-section>
        <div class="text-h5">{{ congressPerson.ultimoStatus.nome }}</div>
        <div caption class="text-subtitle1">
          {{ congressPerson.ultimoStatus.siglaPartido }}
        </div>
        <!-- Titular em exercicion -->
        <div caption class="text-subtitle1">
          <q-icon
            :name="
              congressPerson.ultimoStatus.situacao === 'Exercício'
                ? 'check_circle'
                : 'cancel'
            "
            :color="
              congressPerson.ultimoStatus.situacao === 'Exercício'
                ? 'green'
                : 'red'
            "
          />
          {{
            congressPerson.ultimoStatus.situacao === 'Exercício'
              ? 'Titular em exercício'
              : `Fora do exercício do mandato: ${congressPerson.ultimoStatus.situacao}`
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
          {{ congressPerson.ultimoStatus.gabinete.telefone || 'Não informado' }}
        </q-item-label>
        <!-- Email -->
        <q-item-label class="text-subtitle1">
          <q-icon name="email" size="2rem" color="primary" alt="Email" />
          {{ congressPerson.ultimoStatus.email || 'Não informado' }}
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
          {{ congressPerson.ultimoStatus.gabinete.predio || 'Não informado' }}
          - Anexo:
          {{ congressPerson.ultimoStatus.gabinete.sala || 'Não informado' }}
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
          {{ congressPerson.dataNascimento || 'Não informado' }}
        </q-item-label>
        <!-- Escolaridade -->
        <q-item-label class="text-subtitle1">
          <q-icon
            name="school"
            size="2rem"
            color="primary"
            alt="Nível de Escolaridade"
          />
          {{ congressPerson.escolaridade || 'Não informado' }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const router = useRouter();

const congressPerson = ref<any>(null);

onMounted(async () => {
  const congressPersonId = router.currentRoute.value.params.id;
  try {
    const response = await api.get(`/deputados/${congressPersonId}`);
    congressPerson.value = response.data.dados;
  } catch (error) {
    console.error(error);
  }
});
</script>

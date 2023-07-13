<template>
  <q-page v-if="congressPerson">
    <q-item class="row">
      <q-img
        :key="congressPerson.id"
        :src="congressPerson.ultimoStatus.urlFoto"
        spinner-color="blue"
        fit="contain"
        width="40%"
        style="border-radius: 5%"
      />
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
                : 'close_circle'
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
              : 'Suplente'
          }}
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <div class="text-h6">Dados Pessoais</div>
      <q-item-section class="column">
        <q-item-label class="text-subtitle1">
          <strong>CPF:</strong> {{ congressPerson.cpf }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- <div class="congress-person-info">
      <div class="congress-person-details">
        <p>
          <strong>Partido:</strong>
        </p>
        <p>
          <strong>Estado:</strong> {{ congressPerson.ultimoStatus.siglaUf }}
        </p>
        <p>
          <strong>Gabinete:</strong>
          {{ congressPerson.ultimoStatus.gabinete.nome }}
        </p>
        <p><strong>Email:</strong> {{ congressPerson.ultimoStatus.email }}</p>
        <p>
          <strong>Data de Nascimento:</strong>
          {{ congressPerson.dataNascimento }}
        </p>
        <p><strong>Escolaridade:</strong> {{ congressPerson.escolaridade }}</p>
      </div>
    </div>
    <div class="congress-person-social">
      <h3>Redes Sociais:</h3>
      <ul>
        <li v-for="socialLink in congressPerson.redeSocial" :key="socialLink">
          <a :href="socialLink">
            {{ socialLink }}
          </a>
        </li>
      </ul>
    </div> -->
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

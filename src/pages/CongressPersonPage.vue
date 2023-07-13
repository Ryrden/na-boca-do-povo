<template>
  <q-page v-if="congressPerson">
    <div class="congress-person-info">
      <div class="congress-person-photo">
        <q-img
          :key="congressPerson.id"
          :src="congressPerson.ultimoStatus.urlFoto"
          spinner-color="blue"
          fit="contain"
          width="3.5rem"
          style="border-radius: 5%"
        />
      </div>
      <div class="congress-person-details">
        <h2>{{ congressPerson.ultimoStatus.nome }}</h2>
        <p>
          <strong>Partido:</strong>
          {{ congressPerson.ultimoStatus.siglaPartido }}
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
    </div>
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

<style scoped lang="scss">
.congress-person-info {
  display: flex;
  align-items: center;
}

.congress-person-photo {
  margin-right: 1rem;
}

.congress-person-details h2 {
  margin: 0;
}

.congress-person-details p {
  margin: 0.5rem 0;
}

.congress-person-social ul {
  padding: 0;
  list-style-type: none;
}

.congress-person-social ul li {
  margin-bottom: 0.5rem;
}
</style>

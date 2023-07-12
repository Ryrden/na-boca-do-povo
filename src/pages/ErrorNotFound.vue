<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        Oops. Parece que você se perdeu, o endereço que você está procurando não
        existe.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Voltar para a página inicial"
        icon="sentiment_very_dissatisfied"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <q-input
            v-model="data.sourceText"
            outlined
            type="textarea"
          />
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
            <q-input
              v-model="translation"
              outlined
              type="textarea"
            />
        </q-card-section>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" @click="predict()">
          Translate!
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { ref, reactive } from 'vue'

const data = reactive({
  sourceText: 'Şimdi bunı yapam' // 'Men bala ekende, qartanamnıñ küçük teneke sandıçığı olğanını hatırlayım. Şu mavı-zumrut renklerge boyalanğan qutuçıqnıñ üstü tıpqı balaban sandıqlarda kibi, dögme köşeçiklerinen yaraştırılğan edi.',
})
const translation = ref('')

const predict = async function () {
  const translationResponse = await api.translator.predict({ text: data.sourceText })
  if (translationResponse.error) {
    translationResponse.value = ''
    return
  }
  translation.value = translationResponse.text
}

</script>

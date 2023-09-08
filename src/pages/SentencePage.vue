<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="my-card">
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
              v-model="data.targetText"
              outlined
              type="textarea"
            />
        </q-card-section>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" @click="analyze()">
          Analyze
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { useRoute } from 'vue-router'
import { ref, reactive, onActivated, onMounted } from 'vue'

const route = useRoute()
const wordform = ref({})
const data = reactive({
  sourceText: 'Men bala ekende, qartanamnıñ küçük teneke sandıçığı olğanını hatırlayım. Şu mavı-zumrut renklerge boyalanğan qutuçıqnıñ üstü tıpqı balaban sandıqlarda kibi, dögme köşeçiklerinen yaraştırılğan edi.',
  targetText: 'Когда я была ребенком, у моей бабушки был небольшой жестяной сундучок, выкрашенный синe-изумрудными полосками, c декоративными выпуклостями, изображающими уголки-ковки, как у больших деревянных сундуков.'
})
const sentenceAnalysis = ref({})
const analyze = async function () {
  const sentenceAnalysisResponse = await api.sentence.analyze({ source: data.sourceText, target: data.targetText })
  if (sentenceAnalysisResponse.error) {
    sentenceAnalysis.value = {}
    return
  }
  sentenceAnalysis.value = sentenceAnalysisResponse
}
</script>

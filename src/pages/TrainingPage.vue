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
    <q-card flat bordered class="q-my-sm" v-if="trainingAnalysis.map">
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <div v-if="trainingAnalysis?.tokens?.source">
            <q-chip
              v-for="(sourceSentenceToken, sourceSentenceTokenIndex) in trainingAnalysis.tokens.source" :key="sourceSentenceTokenIndex"
              clickable
              @click="activeToken = sourceSentenceTokenIndex"
              :color="(activeToken == sourceSentenceTokenIndex) ? 'primary' : 'transparent'"
              :text-color="(activeToken == sourceSentenceTokenIndex) ? 'white' : ''"
            >
              {{ sourceSentenceToken }}
              <q-badge :color="(trainingAnalysis.map[sourceSentenceTokenIndex].length > 0) ? 'positive' : 'negative'" floating transparent>
                {{ trainingAnalysis.map[sourceSentenceTokenIndex].length }}
              </q-badge>
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
            <div v-if="trainingAnalysis?.tokens?.target">
              <q-chip
                v-for="(targetSentenceToken, targetSentenceTokenIndex) in trainingAnalysis.tokens.target" :key="targetSentenceTokenIndex"
                clickable
                @click="relate(targetSentenceTokenIndex)"
                :color="(trainingAnalysis.map[activeToken]?.indexOf(targetSentenceTokenIndex) > -1) ? 'positive' : ''"
                :text-color="(trainingAnalysis.map[activeToken]?.indexOf(targetSentenceTokenIndex) > -1) ? 'white' : ''"
              >
                {{ targetSentenceToken }}
              </q-chip>
            </div>
        </q-card-section>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" @click="train()">
          Train
        </q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { ref, reactive } from 'vue'

const data = reactive({
  sourceText: 'Şimdi bunı yapam', // 'Men bala ekende, qartanamnıñ küçük teneke sandıçığı olğanını hatırlayım. Şu mavı-zumrut renklerge boyalanğan qutuçıqnıñ üstü tıpqı balaban sandıqlarda kibi, dögme köşeçiklerinen yaraştırılğan edi.',
  targetText: 'Я сейчас это делаю' // 'Когда я была ребенком, у моей бабушки был небольшой жестяной сундучок, выкрашенный синe-изумрудными полосками, c декоративными выпуклостями, изображающими уголки-ковки, как у больших деревянных сундуков.'
})
const trainingAnalysis = ref({})
const activeToken = ref(null)

const analyze = async function () {
  const trainingAnalysisResponse = await api.translator.analyze({ source: data.sourceText, target: data.targetText })
  if (trainingAnalysisResponse.error) {
    trainingAnalysis.value = {}
    return
  }
  trainingAnalysis.value = trainingAnalysisResponse
}
const relate = function (targetIndex) {
  if (targetIndex === null || activeToken.value == null) return
  if (trainingAnalysis.value.map[activeToken.value].indexOf(targetIndex) == -1) {
    // ADD MATCHED
    trainingAnalysis.value.map[activeToken.value].push(targetIndex)
  } else {
    // REMOVE MATCHED
    const matches = []
    console.log(trainingAnalysis.value.map)
    console.log(activeToken.value)
    for (const i in trainingAnalysis.value.map[activeToken.value]) {
      if (trainingAnalysis.value.map[activeToken.value][i] !== targetIndex) {
        matches.push(trainingAnalysis.value.map[activeToken.value][i])
      }
    }
    trainingAnalysis.value.map[activeToken.value] = matches
  }
}
const train = async function () {
  const trainingAnalysisSaveResponse = await api.sentence.train(trainingAnalysis.value)
  if (trainingAnalysisSaveResponse.error) {
    trainingAnalysis.value = {}
  }
}

</script>

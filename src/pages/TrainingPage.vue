<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <q-select
            filled
            v-model="data.source.language_id"
            :options="options"
            emit-value
            map-options
            label="Language"
          />
          <q-input
            v-model="data.source.text"
            outlined
            type="textarea"
          />
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
          <q-select
            filled
            v-model="data.target.language_id"
            :options="options"
            label="Language"
            emit-value
            map-options
          />
            <q-input
              v-model="data.target.text"
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
import { ref, reactive, watch } from 'vue'
const options = [
  {
    label: 'Qirimtatar',
    value: 1
  },
  {
    label: 'Русский',
    value: 2
  }
]
const data = reactive({
  source: {
    text: 'Şimdi bunı yapam', // 'Men bala ekende, qartanamnıñ küçük teneke sandıçığı olğanını hatırlayım. Şu mavı-zumrut renklerge boyalanğan qutuçıqnıñ üstü tıpqı balaban sandıqlarda kibi, dögme köşeçiklerinen yaraştırılğan edi.',
    language_id: 1
  },
  target: {
    text: 'Я сейчас это делаю', // 'Когда я была ребенком, у моей бабушки был небольшой жестяной сундучок, выкрашенный синe-изумрудными полосками, c декоративными выпуклостями, изображающими уголки-ковки, как у больших деревянных сундуков.'
    language_id: 2
  }
})
const trainingAnalysis = ref({})
const activeToken = ref(null)

const analyze = async function () {
  const trainingAnalysisResponse = await api.translator.analyze(data)
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
  const trainingAnalysisSaveResponse = await api.translator.train(trainingAnalysis.value)
  if (trainingAnalysisSaveResponse.error) {
    trainingAnalysis.value = {}
  }
}

watch(() => data.source.language_id, async (currentValue, oldValue) => {
  if (data.source.language_id === data.target.language_id) {
    data.target.language_id = oldValue
  }
})

</script>

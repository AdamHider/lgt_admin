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
    <q-card flat bordered class="q-my-sm">
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <div v-if="sentenceAnalysis?.sentences?.source">
            <q-chip
              v-for="(sourceSentenceToken, sourceSentenceTokenIndex) in sentenceAnalysis.tokenData" :key="sourceSentenceTokenIndex"
              clickable
              @click="activeToken = sourceSentenceToken"
              :color="(activeToken.position == sourceSentenceTokenIndex) ? 'primary' : 'transparent'"
              :text-color="(activeToken.position == sourceSentenceToken.position) ? 'white' : ''"
            >
              {{ sourceSentenceToken.text }}
              <q-badge :color="(sourceSentenceToken.matches.length > 0) ? 'positive' : 'negative'" floating transparent>
                {{ sourceSentenceToken.matches.length }}
              </q-badge>
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
            <div v-if="sentenceAnalysis?.sentences?.target">
              <q-chip
                v-for="(targetSentenceToken, targetSentenceTokenIndex) in sentenceAnalysis.sentences.target" :key="targetSentenceTokenIndex"
                clickable
                @click="relate(targetSentenceTokenIndex)"
                :color="(activeToken?.matches?.indexOf(targetSentenceTokenIndex) > -1) ? 'positive' : ''"
                :text-color="(activeToken?.matches?.indexOf(targetSentenceTokenIndex) > -1) ? 'white' : ''"
              >
                {{ targetSentenceToken }}
              </q-chip>
            </div>
        </q-card-section>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" @click="save()">
          Save
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
const data = reactive({
  sourceText: 'Şimdi bunı yapam', // 'Men bala ekende, qartanamnıñ küçük teneke sandıçığı olğanını hatırlayım. Şu mavı-zumrut renklerge boyalanğan qutuçıqnıñ üstü tıpqı balaban sandıqlarda kibi, dögme köşeçiklerinen yaraştırılğan edi.',
  targetText: 'Я сейчас это делаю' // 'Когда я была ребенком, у моей бабушки был небольшой жестяной сундучок, выкрашенный синe-изумрудными полосками, c декоративными выпуклостями, изображающими уголки-ковки, как у больших деревянных сундуков.'
})
const sentenceAnalysis = ref({})
const activeToken = ref({})
const analyze = async function () {
  const sentenceAnalysisResponse = await api.sentence.analyze({ source: data.sourceText, target: data.targetText })
  if (sentenceAnalysisResponse.error) {
    sentenceAnalysis.value = {}
    return
  }
  sentenceAnalysis.value = sentenceAnalysisResponse
}
const relate = function (targetIndex) {
  if (targetIndex === null) return
  if (sentenceAnalysis.value.tokenData[activeToken.value.position].matches.indexOf(targetIndex) == -1) {
    // ADD MATCHED
    sentenceAnalysis.value.tokenData[activeToken.value.position].matches.push(targetIndex)
  } else {
    // REMOVE MATCHED
    const matches = []
    for (const i in sentenceAnalysis.value.tokenData[activeToken.value.position].matches) {
      if (sentenceAnalysis.value.tokenData[activeToken.value.position].matches[i] !== targetIndex) {
        matches.push(sentenceAnalysis.value.tokenData[activeToken.value.position].matches[i])
      }
    }
    sentenceAnalysis.value.tokenData[activeToken.value.position].matches = matches
    activeToken.value = sentenceAnalysis.value.tokenData[activeToken.value.position]
  }
}
const save = async function () {
  const sentenceAnalysisSaveResponse = await api.sentence.save(sentenceAnalysis.value)
  if (sentenceAnalysisSaveResponse.error) {
    sentenceAnalysis.value = {}
  }
}

</script>

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

    <q-list bordered class="rounded-borders">
      <q-expansion-item
        v-for="(sentenceAnalysisItem, sentenceAnalysisIndex) in sentenceAnalysis" :key="sentenceAnalysisIndex"
        expand-separator
        caption="John Doe"
      >
       <template v-slot:header>
          <q-item-section avatar >
            <q-icon v-if="sentenceAnalysisItem.matches.length !== 1" name="info" color="amber" />
            <q-icon v-else name="check_circle" color="positive" />
          </q-item-section>
          <q-item-section>
            {{ sentenceAnalysisItem.word }}
          </q-item-section>
          <q-item-section side>
            <q-badge rounded :color="(sentenceAnalysisItem.matches.length !== 1) ? 'red' : 'primary'" :label="sentenceAnalysisItem.matches.length" />
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-list bordered class="rounded-borders">
              <q-item clickable v-ripple v-for="(match, matchIndex) in sentenceAnalysisItem.matches" :key="matchIndex">
                <q-item-section>{{ match.target_wordform }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { useRoute } from 'vue-router'
import { ref, reactive, onActivated, onMounted } from 'vue'

const route = useRoute()
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

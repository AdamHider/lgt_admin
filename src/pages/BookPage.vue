<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section>
        <div class="q-gutter-md q-my-sm  row items-start">
          <q-select v-if="chapters.length > 0"
            outlined q-select v-model="data.heading.chapter"
            option-value="id"
            option-label="number"
            :options="chapters"
            label="Chapter"
            style="min-width: 300px"
            >
          </q-select>
          <q-btn outline color="primary" label="New chapter" @click="addChapter()"/>

        </div>
      </q-card-section>
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <q-select
            filled
            v-model="data.body.source.language_id"
            :options="options.source"
            emit-value
            map-options
            label="Language"
          />

          <NotepadTextarea :value="data.body.source.text"/>
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
          <q-select
            filled
            v-model="data.body.target.language_id"
            :options="options.target"
            label="Language"
            emit-value
            map-options
          />
          <NotepadTextarea :value="data.body.target.text"/>
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
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import NotepadTextarea from '../components/NotepadTextarea.vue'

const chapters = ref([])
const options = {
  source: [
    {
      label: 'Qirimtatar',
      value: 1
    }
  ],
  target: [
    {
      label: 'Русский',
      value: 2
    },
    {
      label: 'Украинська',
      value: 3
    },
    {
      label: 'English',
      value: 4
    }
  ]
}
const data = ref({
  heading: {
    chapter: 0
  },
  body: {
    source: {
      text: '',
      totalLines: 0,
      language_id: 1
    },
    target: {
      text: 'Известно, что все народы велики и у каждого народа есть такие гениальные творцы, произведения которых становятся достоянием всего человечества. Одним из таких гениев является А.С. Пушкин.',
      totalLines: 0,
      language_id: 2
    }
  }
})

const saveData = async function () {
  const sentencePairResponse = await api.sentence.getPair()
  if (sentencePairResponse.error) {
    data.value = {}
    return
  }
  data.value = sentencePairResponse
}
async function loadChapters () {
  const chapterListResponse = await api.chapter.getList({ book_id: route.params.book_id })
  if (chapterListResponse.error) {
    chapters.value = []
    return []
  }
  chapters.value = chapterListResponse
}
const addChapter = async function () {
  const chapterAddResponse = await api.chapter.createItem({ book_id: route.params.book_id, number: chapters.value.length + 1 })
  if (chapterAddResponse.error) {
    chapterAddResponse.value = []
  }
  return await loadChapters()
}

onMounted(async () => {
  // get initial data from server (1st page)
  await loadChapters()
})
</script>

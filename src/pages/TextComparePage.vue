<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section>
        <q-select
          filled
          v-model="data.heading"
          :options="bookOptions"
          use-input
          input-debounce="0"
          @filter="filterBooks"
          option-value="id"
          option-label="title"
          label="Standard"
          color="teal"
          clearable
          options-selected-class="text-deep-orange"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.title }}</q-item-label>
                <q-item-label caption>{{ scope.opt.author }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="q-gutter-md">
          <q-input outlined v-model="data.heading.title" label="Title" />
          <q-input outlined v-model="data.heading.author" label="Author" />
          <q-input outlined v-model="data.heading.year" label="Year" />
          <q-input outlined v-model="data.heading.chapter" label="Chapter" />
        </div>
      </q-card-section>
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <q-select
            filled
            v-model="data.body.source.language_id"
            :options="options"
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
            :options="options"
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

import NotepadTextarea from '../components/NotepadTextarea.vue'

const formData = reactive({
  bookTitle: ''
})

const bookOptions = ref([])
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
const data = ref({
  heading: {
    code: '',
    title: '',
    author: '',
    year: '',
    chapter: 1
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
const trainingAnalysis = ref({})
const activeMatchGroup = ref(null)

const loadData = async function () {
  const sentencePairResponse = await api.sentence.getPair()
  if (sentencePairResponse.error) {
    data.value = {}
    return
  }
  data.value = sentencePairResponse
}

const filterBooks = function (val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow
  loadBooks(val, update)
}
const loadBooks = async function (val, update) {
  const bookListResponse = await api.book.getList({ filter: val })
  if (bookListResponse.error) {
    bookOptions.value = {}
  }
  update(() => {
    bookOptions.value = bookListResponse
  })
}

</script>

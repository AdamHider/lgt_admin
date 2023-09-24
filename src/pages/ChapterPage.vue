<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section class="q-pt-xs" v-if="book">
        <div class="text-overline">{{ book.author }}</div>
        <div class="text-h5 q-mt-sm q-mb-xs">{{ book.title }}</div>
        <div class="text-h6 q-mt-sm q-mb-xs">Chapter {{ book.chapter }}</div>
        <div class="text-caption text-grey">{{ book.year }}</div>

      <q-btn color="primary" icon="add" label="Open editor" @click="textModal = !textModal"></q-btn>
      </q-card-section>
    </q-card>
    <q-dialog v-model="textModal"
      persistent
      maximized>
        <q-card class="my-card">
          <q-toolbar>
            <q-select
              filled
              v-model="data.source.language_id"
              :options="options.source"
              emit-value
              map-options
              label="Source Language"
            />
            <q-select
              filled
              v-model="data.target.language_id"
              :options="options.target"
              label="Target Language"
              emit-value
              map-options
            />

            <q-toolbar-title>

            </q-toolbar-title>

            <q-btn flat color="primary" @click="saveTexts()">
              Save
            </q-btn>
            <q-spinner
              v-if="saving"
              color="primary"
            />
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section horizontal>
            <q-card-section class="full-width q-pa-none">
              <NotepadTextarea :value="data.source.text" @update-value="data.source.text = $event;"/>
            </q-card-section>
            <q-card-section  class="full-width q-pa-none">
              <NotepadTextarea :value="data.target.text" @update-value="data.target.text = $event;"/>
            </q-card-section>
          </q-card-section>
          <q-inner-loading :showing="!loaded">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>

        </q-card>
      </q-dialog>

  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { ref, reactive, watch, onMounted, onActivated } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import NotepadTextarea from '../components/NotepadTextarea.vue'

const options = {
  source: [
    {
      label: 'Qirimtatar',
      value: '1'
    }
  ],
  target: [
    {
      label: 'Русский',
      value: '2'
    },
    {
      label: 'Украинська',
      value: '3'
    },
    {
      label: 'English',
      value: '4'
    }
  ]
}

const error = ref(false)
const loaded = ref(false)
const saving = ref(false)
const textModal = ref(false)
const maximizedToggle = ref(false)

const saveInterval = ref(false)

const book = ref({})
const data = reactive({

  source: {
    text: '',
    language_id: '1'
  },
  target: {
    text: '',
    language_id: '2'
  }
})

async function loadText (scope) {
  const textListResponse = await api.text.getItem({
    chapter_id: route.params.chapter_id,
    language_id: data[scope].language_id
  })
  if (textListResponse.error) {
    data[scope] = {
      text: '',
      language_id: data[scope].language_id
    }
    return []
  }
  data[scope] = textListResponse
}
async function loadBook () {
  const bookItemResponse = await api.book.getItem({ filter: { chapter_id: route.params.chapter_id } })
  if (bookItemResponse.error) {
    error.value = bookItemResponse
    return []
  }
  book.value = bookItemResponse
}
const saveTexts = async function () {
  saving.value = true
  await saveText('source')
  await saveText('target')
  saving.value = false
}
const saveText = async function (scope) {
  await api.text.saveItem({
    chapter_id: route.params.chapter_id,
    language_id: data[scope].language_id,
    text: data[scope].text
  })
}
const saveCounter = function () {
  saveInterval.value = setInterval(function () {
    saveTexts()
  }, 60000)
}

onActivated(async () => {
  loadBook()
  loaded.value = false
  await loadText('source')
  await loadText('target')
  loaded.value = true
  clearInterval(saveInterval.value)
  saveCounter()
})

onMounted(async () => {
  loadBook()
  loaded.value = false
  await loadText('source')
  await loadText('target')
  loaded.value = true
  clearInterval(saveInterval.value)
  saveCounter()
})

watch(() => data.source.language_id, async (currentValue, oldValue) => {
  await loadText('source')
})
watch(() => data.target.language_id, async (currentValue, oldValue) => {
  await loadText('target')
})
</script>

<style>
.text-underline:hover{
  text-decoration: underline;
}
</style>
<template>
  <q-card class="q-pa-sm">
    <q-card-section>
      <q-btn color="primary" icon="add" label="New book" @click="addModal = !addModal"></q-btn>
    </q-card-section>
  </q-card>
  <q-card class="q-pa-sm">
    <q-card-section>
      <q-input borderless dense v-model="filterSet.filter" label="Search book ..." >
          <template v-slot:append>
            <q-icon v-if="filterSet.filter !== ''" name="close" @click="filterSet.filter = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
  </q-card>
  <q-dialog v-model="addModal">
        <q-card class="my-card">
          <q-card-section>
            <q-input outlined v-model="formData.title" label="Title" />
            <q-input outlined v-model="formData.author" label="Author" />
            <q-input outlined v-model="formData.year" label="Year" />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn v-close-popup flat color="gray" label="Cancel" />
            <q-btn v-close-popup flat color="primary" label="Save" @click="addBook()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  <div>
    <q-list bordered dense padding class="rounded-borders" v-for="(book, bookIndex) in books" :key="bookIndex">
      <q-item >
        <q-item-section avatar top>
          <q-icon name="import_contacts" color="black" size="34px" />
        </q-item-section>
        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{book.title}}</span>
          </q-item-label>
          <q-item-label lines="1">
            <span class="text-grey-8">{{book.author}} ({{book.year}})</span>
          </q-item-label>
          <q-item-label caption lines="1">
            Chapters: {{ book.chapters }}
          </q-item-label>
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" :to="`/book-${book.id}`"  />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

  </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, watch, onMounted, reactive } from 'vue'

const error = ref({})
const books = ref([])
const addModal = ref(false)
const formData = reactive({
  title: '',
  author: '',
  year: ''
})
const filterSet = ref({
  language_id: 1,
  filter: ''
})

async function loadData () {
  const bookListResponse = await api.book.getList({ filter: filterSet.value.filter })
  if (bookListResponse.error) {
    error.value = bookListResponse
    return []
  }
  books.value = bookListResponse
}
const addBook = async function () {
  const bookAddResponse = await api.book.createItem({
    title: formData.title,
    author: formData.author,
    year: formData.year
  })
  if (bookAddResponse.error) {
    bookAddResponse.value = []
  }
  return true
}

onMounted(async () => {
  // get initial data from server (1st page)
  await loadData()
})

watch(() => filterSet.value.filter, async (currentValue, oldValue) => {
  loadData()
})
</script>

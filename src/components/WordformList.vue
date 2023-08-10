<template>
    <q-table
      flat bordered
      ref="tableRef"
      title="Wordforms"
      :rows="rows"
      :columns="columns"
      row-key="wordform_id"
      :loading="loading"
      :filter="filter"
      v-model:pagination="pagination"
      hide-pagination
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-selection="scope">
        <q-toggle v-model="scope.selected" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
          <q-td key="wordform" :props="props">
            {{ props.row.wordform }}
          </q-td>
          <q-td key="word" :props="props">
            <q-badge color="green">
              {{ props.row.word }}
            </q-badge>
          </q-td>
          <q-td key="template" :props="props">
            <q-badge color="purple">
              {{ props.row.template }}
            </q-badge>
          </q-td>
          <q-td key="is_disabled" :props="props">
            <q-toggle
              v-model="props.row.is_disabled"
              :true-value="null"
              false-value="1"
              />
          </q-td>
        </q-tr>
      </template>

    </q-table>
    <div class="q-pa-lg flex flex-center">
      <q-select dense v-model="pagination.rowsPerPage" @update:model-value="onRequest()"  :options="[5, 10, 20]"  />
      <q-pagination
        v-model="pagination.page"  @update:model-value="onRequest()"
        :max="totalPages"
        :max-pages="6"
        :boundary-numbers="false"
        direction-links
      />
    </div>
</template>

<script setup>
import { api } from '../services/index'
import { ref, computed, onMounted } from 'vue'

const error = ref({})
const tableRef = ref()
const rows = ref([])
const filter = ref('')
const loading = ref(false)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10000
})

const totalPages = computed(() => pagination.value.rowsNumber ? pagination.value.rowsNumber / pagination.value.rowsPerPage : 5000)
const filterSet = ref({
  language_id: 1
})

const columns = [
  { name: 'wordform', align: 'left', label: 'Wordform', field: 'wordform', sortable: true },
  { name: 'word', align: 'left', label: 'Word', field: 'word', sortable: true },
  { name: 'template', label: 'Set', field: 'template', sortable: true },
  { name: 'is_disabled', label: 'Active', field: 'is_disabled', sortable: true }
]

async function getTotalRows () {
  const wordformTotalRowsResponse = await api.wordform.getTotalRows()
  if (wordformTotalRowsResponse.error) {
    error.value = wordformTotalRowsResponse
    return []
  }
  pagination.value.rowsNumber = wordformTotalRowsResponse
}

async function onRequest () {
  loading.value = true
  const offset = (pagination.value.page - 1) * pagination.value.rowsPerPage
  // fetch data from "server"
  const returnedData = await getWordforms({
    offset,
    limit: pagination.value.rowsPerPage,
    filter,
    sortBy: pagination.value.sortBy,
    descending: pagination.value.descending
  })

  // clear out existing data and add new
  rows.value = returnedData
  console.log(rows.value)
  loading.value = false
}

const getWordforms = async function (filter) {
  const wordformListResponse = await api.wordform.getList({ ...filter, ...filterSet.value })
  if (wordformListResponse.error) {
    error.value = wordformListResponse
    return []
  }
  return wordformListResponse
}
onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
  getTotalRows()
})
</script>

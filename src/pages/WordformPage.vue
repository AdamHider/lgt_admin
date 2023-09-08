<template>
  <q-page class="bg-white q-pa-sm">

  </q-page>
</template>

<script setup >
import { api } from '../services/index'
import { useRoute } from 'vue-router'
import { ref, onActivated, onMounted } from 'vue'

const route = useRoute()
const quest = ref({})

const load = async function () {
  const wordformResponse = await api.wordform.getItem({ wordform_id: route.params.wordform_id })
  if (wordformResponse.error) {
    quest.value = {}
    return
  }
  quest.value = wordformResponse
}
onMounted(async () => {
  await load()
})
onActivated(async () => {
  await load()
})
</script>

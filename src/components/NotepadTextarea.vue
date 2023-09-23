<template>
    <div class="row full-width notepad q-my-sm">
        <div class="col-1 lines-container">
            <div v-for="line in formData.totalLines" :key="line">
            {{ line }}
            </div>
        </div>
        <div class="col-11">
            <q-input
              borderless
              v-model="formData.text"
              type="textarea"
              autogrow
              input-style="white-space: pre; min-height: 300px"
            />
        </div>
    </div>
</template>

<script setup >
import { onActivated, onMounted, reactive, watch } from 'vue'

const emits = defineEmits(['update-value'])

const props = defineProps({
  value: String
})
const formData = reactive({
  text: '',
  totalLines: 1
})
onMounted(() => {
  if (props.value) formData.text = props.value
})
onActivated(() => {
  if (props.value) formData.text = props.value
})

const countLines = function () {
  formData.totalLines = formData.text.split(/\r\n|\r|\n/).length
}

watch(() => formData.text, async (currentValue, oldValue) => {
  countLines()
  emits('update-value', formData.text)
})
</script>
<style scoped>
.notepad{
  font-family: Consolas;
  border-radius: 4px;
  border: 1px solid lightgray;
}
.notepad .lines-container{
  text-align: right;
  padding-top: 19px;
  padding-right: 10px;
  min-height: 52px;
  line-height: 18px;
  color: gray;
  font-size: 13px;
  border-right: 1px solid #f2f2f2;
}
.notepad .q-field {
  padding-left: 10px !important;
}
</style>

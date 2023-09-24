<template>
    <div class="row  notepad">
        <div class="lines-container">
            <div v-for="line in formData.totalLines" :key="line">
            {{ line }}
            </div>
        </div>
        <div class="textbox-container">
            <q-input
              borderless
              v-model="formData.text"
              @update:model-value="countLines(); emits('update-value', formData.text)"
              type="textarea"
              autogrow
              input-style="white-space: pre; min-height: 300px; font-size: 12px; overflow: hidden;"
            />
        </div>
        <div class="shadow-text" style="color: white">{{ formData.text }}</div>
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
  countLines()
})
onActivated(() => {
  if (props.value) formData.text = props.value
  countLines()
})

const countLines = function () {
  formData.totalLines = formData.text.split(/\r\n|\r|\n/).length
}

watch(() => props.value, async (currentValue, oldValue) => {
  formData.text = currentValue
  countLines()
})
</script>
<style scoped>
.notepad{
  font-family: Consolas;
  border-radius: 4px;
  border: 1px solid lightgray;
  position: relative;
  height: calc(-56px + 100vh);
  overflow: auto;
  width: 50vw;
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
  width: 50px;
  min-height: 300px;
  position: absolute;
}
.notepad .q-field {
  padding-left: 10px !important;
}
.notepad .textbox-container{
  padding-left: 50px;
  width: 100%;
}
.notepad .shadow-text{
  padding-left: 50px;
  white-space: pre; min-height: 300px; font-size: 12px;
}
</style>

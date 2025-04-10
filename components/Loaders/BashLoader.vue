<template>
  <div class="terminal-loader">
    <span>{{ spinnerChar }}</span> {{ text }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['text'])
const spinnerChar = ref('/')
const sequence = ['/', '-', '\\', '|']
let index = 0

onMounted(() => {
  setInterval(() => {
    index = (index + 1) % sequence.length
    spinnerChar.value = sequence[index]
  }, 100) // Vitesse de rotation
})
</script>

<style lang="scss" scoped>
.terminal-loader {
  color: $green;
  background-color: black;
  padding: 1rem;
  display: inline-block;
  border: 1px solid $green;
  border-radius: 4px;
}
</style>

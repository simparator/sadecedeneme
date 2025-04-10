<template>
  <span class="typing-indicator">{{ dots }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dots = ref('')
let interval = null

onMounted(() => {
  let count = 0
  interval = setInterval(() => {
    count = (count + 1) % 4
    dots.value = '.'.repeat(count)
  }, 500)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>

</style>

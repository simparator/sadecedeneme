<template>
  <div class="tw-mt-4">
    <p>{{ username }}</p>
  </div>
</template>

<script setup>
import { useTerminalStore } from '~/stores/app.js'

const terminal = useTerminalStore()

const username = computed(() => {
  return terminal.userData?.userName || 'unknown'
})
</script>

<style scoped>
</style>

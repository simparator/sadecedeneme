<template>
  <div>

    <NuxtPage/>

  </div>
</template>

<script setup>
import {setupGlobalClickSound , setupGlobalKeySound} from '~/composables/soundEffects.js'
onMounted(() => {
  setupGlobalClickSound()
  setupGlobalKeySound()
})
</script>


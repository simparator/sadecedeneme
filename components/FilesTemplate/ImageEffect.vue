<template>
  <div class="image-wrapper">
    <img
        :src="imagePath"
        :alt="alt"
        class="retro-image"
        :width="width"
        :height="height"
    />
  </div>
</template>

<script setup>
import { useTerminalStore } from "~/stores/app.ts"

const terminal = useTerminalStore()

const props = defineProps({
  filename: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: "terminal image"
  },
  width: {
    type: [String, Number]
  },
  height: {
    type: [String, Number]
  }
})

const serverAddress = computed(() => terminal.serverAddressData)
const imagePath = computed(() => `/config/network/${serverAddress.value}/images/${props.filename}`)
</script>

<style scoped lang="scss">
//.image-wrapper {
//  display: inline-block;
//  padding: 0.5rem;
//  background: black;
//  border: 1px solid $green;
//  box-shadow: 0 0 8px $green;
//  margin-top: 0.5rem;
//}

.retro-image {
  object-fit: contain;
  image-rendering: pixelated;
  filter: contrast(1.2) brightness(0.9) saturate(0.8) grayscale(0.3);
  mix-blend-mode: lighten;
  display: block;
  margin: 0 auto;
}
</style>

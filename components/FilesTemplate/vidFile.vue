<template>
  <div
      class="tw-mt-4 tw-relative video-player"
      ref="container"
      @click="toggleZoom"
      @mousemove="handleMouseMove"
      :class="[{ zoomed } , { zoomAnimation }]"
  >
    <video
        v-if="isVideo"
        :src="sourcePath"
        autoplay
        loop
        class="tw-w-full"
        :class="{ 'pixelated-zoom': zoomEffect }"
        :style="mediaStyle"
    />
    <img
        v-else
        :src="sourcePath"
        :class="{ 'pixelated-zoom': zoomEffect }"
        :style="mediaStyle"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTerminalStore } from '~/stores/app.ts'

const props = defineProps(['file'])
const terminal = useTerminalStore()

const serverAddress = computed(() => terminal.serverAddressData)

const sourcePath = computed(() =>
    `/config/network/${serverAddress.value}/videos/${props.file.content}`
)

const isVideo = computed(() =>
    /\.(mp4|webm|ogg)$/i.test(props.file.content)
)

const container = ref(null)
const zoomed = ref(false)
const zoomEffect = ref(false)
const zoomAnimation = ref(false)
const mediaStyle = ref({})
const originX = ref(50)
const originY = ref(50)

// Handles zoom and unzoom with pixelated transition
function toggleZoom(event) {
  zoomed.value = !zoomed.value
  triggerZoomAnimation()
  if (zoomed.value) {
    zoomEffect.value = true
    handleMouseMove(event)
    setTimeout(() => {
      zoomEffect.value = false
    }, 500)

    updateZoomStyle()
  } else {
    mediaStyle.value = {
      transform: 'scale(1)',
      transformOrigin: 'center center',
      transition: 'transform 0.05s ease-in-out',
    }
  }
}

function triggerZoomAnimation() {
  zoomAnimation.value = false; // resets no matter what
  zoomAnimation.value = true;
  setTimeout(() => {
    zoomAnimation.value = false; // reset after animation
  }, 400)
}

// Update transformOrigin on mouse move if zoomed
function handleMouseMove(event) {
  if (!zoomed.value || !container.value) return

  const rect = container.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  originX.value = (x / rect.width) * 100
  originY.value = (y / rect.height) * 100

  updateZoomStyle()
}

function updateZoomStyle() {
  mediaStyle.value = {
    transform: 'scale(3)',
    transformOrigin: `${originX.value}% ${originY.value}%`,
    transition: 'transform 0.05s ease-out',
  }
}
</script>

<style scoped lang="scss">
.video-player {
  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: zoom-in;
  &.zoomed {
    cursor: zoom-out;
  }
  > * {
    image-rendering: pixelated;
    filter: contrast(1.2) brightness(0.9) saturate(0.8) grayscale(0.3);
  }
}

.video-player.zoomAnimation {
  animation: glitch-zoom .4s ease-in-out;
}
</style>

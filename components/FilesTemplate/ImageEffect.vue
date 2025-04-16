<template>
  <div
      v-if="zoom"
      class="image-container"
      :class="[[zoomed ? 'zoomed' : 'zoom'] , { zoomAnimation } ]"
      @click="toggleZoom"
      @mousemove="zoomed && handleMouseMove($event)"
      ref="imageContainer"
  >
    <img
        :src="imagePath"
        :alt="alt"
        class="retro-image"
        :class="{cover}"
        :width="width"
        :height="height"
        :style="imgStyle"
    />

  </div>

  <div
      v-else
      class="image-container"
      ref="imageContainer"
  >
    <img
        :src="imagePath"
        :alt="alt"
        class="retro-image"
        :class="{'cover' : cover}"
        :width="width"
        :height="height"
        :style="imgStyle"
    />
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useTerminalStore } from '~/stores/app.ts'

const terminal = useTerminalStore()

const props = defineProps({
  filename: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'terminal image'
  },
  cover : {
    type: Boolean,
    default: false
  },
  zoom : {
    type: Boolean,
    default: true
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

const zoomed = ref(false)
const zoomAnimation = ref(false)
const imgStyle = ref({})
const imageContainer = ref(null)


function toggleZoom(event) {
  zoomed.value = !zoomed.value
  triggerZoomAnimation()
  if (!zoomed.value) {
    // Reset style if zoom is disabled
    imgStyle.value = {
      transform: 'scale(1)',
      transformOrigin: 'center center',
      transition: 'transform 0.05s ease-in-out'
    }
  } else {
    handleMouseMove(event) // apply initial zoom at click position
  }
}

function triggerZoomAnimation() {
  zoomAnimation.value = false; // resets no matter what
  zoomAnimation.value = true;
  setTimeout(() => {
    zoomAnimation.value = false; // reset after animation
  }, 400)
}


function handleMouseMove(event) {
  const rect = imageContainer.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  const originX = (offsetX / rect.width) * 100
  const originY = (offsetY / rect.height) * 100

  imgStyle.value = {
    transform: 'scale(3)',
    transformOrigin: `${originX}% ${originY}%`,
    transition: 'transform 0.05s ease-out'
  }
}
</script>

<style scoped lang="scss">
.image-container {
  display: block;
  overflow: hidden;
}

.zoom {
  cursor: zoom-in;
}

.zoomed {
  cursor: zoom-out;
}

.image-container.zoomAnimation {
  animation: glitch-zoom .4s ease-in-out;
}

.agent-portrait {
  .retro-image {
    aspect-ratio: 3/3.5;
  }
}

.retro-image {
  object-fit: contain;
  image-rendering: pixelated;
  filter: contrast(1.2) brightness(0.9) saturate(0.8) grayscale(0.3);
  mix-blend-mode: lighten;
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.3s ease-in-out;

  &.cover {
    object-fit: cover;
    object-position: center;
  }
}
</style>

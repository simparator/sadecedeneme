<template>
  <div>

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
          class="tw-w-full"
          :class="{ 'pixelated-zoom': zoomEffect }"
          :style="mediaStyle"
          ref="videoElement"
      />
      <img
          v-else
          :src="sourcePath"
          :class="{ 'pixelated-zoom': zoomEffect }"
          :style="mediaStyle"
      />


    </div>

    <div v-if="isVideo" class="progress-bar" @click="seekVideo($event)">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      <div class="timer">{{ formattedTime }}</div>

    </div>

    <div v-if="isVideo" class="controls">
      <button @click.stop="rewind"><img class="invert" src="~/assets/images/fast-forward.svg"/></button>
      <button @click.stop="stepBackward"><img class="invert" src="~/assets/images/frame.svg"/></button>
      <button @click.stop="togglePlay">
        <img v-if="isPlaying" src="~/assets/images/pause.svg"/>
        <img v-else src="~/assets/images/play.svg"/>
      </button>
      <button @click.stop="stepForward"><img src="~/assets/images/frame.svg"/></button>
      <button @click.stop="fastForward"><img src="~/assets/images/fast-forward.svg"/></button>

    </div>
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

const currentTime = ref(0)
const duration = ref(0)


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

// video controls
const videoElement = ref(null)
const isPlaying = ref(true)

function togglePlay() {
  const video = videoElement.value
  if (!video) return

  if (video.paused) {
    video.play()
    isPlaying.value = true
  } else {
    video.pause()
    isPlaying.value = false
  }
}

function rewind() {
  const video = videoElement.value
  if (video) video.currentTime -= 5
}

function fastForward() {
  const video = videoElement.value
  if (video) video.currentTime += 5
}

const frameTime = 1 / 15 // 30 FPS fallback

function stepForward() {
  const video = videoElement.value
  video.pause()
  isPlaying.value = false

  if (video && video.paused) {
    video.currentTime += frameTime
  }
}

function stepBackward() {
  const video = videoElement.value
  video.pause()
  isPlaying.value = false
  if (video && video.paused) {
    video.currentTime -= frameTime
  }
}

const progress = ref(0)

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.addEventListener('timeupdate', updateProgress)
  }
})

function updateProgress() {
  const video = videoElement.value
  if (video && video.duration) {
    currentTime.value = video.currentTime
    duration.value = video.duration
    progress.value = (video.currentTime / video.duration) * 100
  }
}

function seekVideo(event) {
  const video = videoElement.value
  if (!video || !video.duration) return

  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width

  video.currentTime = percentage * video.duration
  progress.value = percentage * 100
}



const formattedTime = computed(() => {
  return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
})

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

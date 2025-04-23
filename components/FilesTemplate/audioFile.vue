<template>
  <div class="audio-player">


    <client-only>
      <audio ref="audioElement" :src="sourcePath" autoplay  @timeupdate="updateProgress"  />
      <AudioVisualizer v-if="audioElement" :audioElement="audioElement" />
    </client-only>

    <div class="progress-bar" @click="seekAudio($event)">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      <div class="timer">{{ formattedTime }}</div>
    </div>

    <div class="controls">
      <button @click="rewind"><img class="invert" src="~/assets/images/fast-forward.svg" /></button>
      <button @click="togglePlay">
        <img v-if="isPlaying" src="~/assets/images/pause.svg" />
        <img v-else src="~/assets/images/play.svg" />
      </button>
      <button @click="fastForward"><img src="~/assets/images/fast-forward.svg" /></button>
    </div>

  </div>
</template>

<script setup>
import { useTerminalStore } from '~/stores/app.ts'

const props = defineProps(['file'])
const terminal = useTerminalStore()

const serverAddress = computed(() => terminal.serverAddressData)
const sourcePath = computed(() =>
    `/config/network/${serverAddress.value}/audios/${props.file.content}`
)

const audioElement = ref(null)
const isPlaying = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

function togglePlay() {
  const audio = audioElement.value
  if (!audio) return

  if (audio.paused) {
    audio.play()
    isPlaying.value = true
  } else {
    audio.pause()
    isPlaying.value = false
  }
}

function rewind() {
  const audio = audioElement.value
  if (audio) audio.currentTime -= 5
}

function fastForward() {
  const audio = audioElement.value
  if (audio) audio.currentTime += 5
}

function updateProgress() {
  const audio = audioElement.value
  if (audio && audio.duration) {
    currentTime.value = audio.currentTime
    duration.value = audio.duration
    progress.value = (audio.currentTime / audio.duration) * 100
  }
}

function seekAudio(event) {
  const audio = audioElement.value
  if (!audio || !audio.duration) return

  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width

  audio.currentTime = percentage * audio.duration
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
.audio-player {
  position: relative;
  height: 100%;
  //background-color: blue;
}


</style>

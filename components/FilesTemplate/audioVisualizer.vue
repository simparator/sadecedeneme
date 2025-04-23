<template>
  <div class="audio-visualizer">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>

const props = defineProps({
  audioElement: Object, // HTMLAudioElement
})

const canvas = ref(null)
let ctx
let analyser
let dataArray
let animationId

onMounted(() => {
  if (!props.audioElement) return

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const source = audioCtx.createMediaElementSource(props.audioElement)
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 256
  const bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)

  source.connect(analyser)
  analyser.connect(audioCtx.destination)

  ctx = canvas.value.getContext('2d')
  draw()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})

function draw() {
  animationId = requestAnimationFrame(draw)

  analyser.getByteTimeDomainData(dataArray)

  const width = canvas.value.width
  const height = canvas.value.height
  ctx.clearRect(0, 0, width, height)

  ctx.lineWidth = 2
  ctx.strokeStyle = '#fff'
  ctx.beginPath()

  const sliceWidth = width * 1.0 / dataArray.length
  let x = 0

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0
    const y = v * height / 2

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    x += sliceWidth
  }

  ctx.lineTo(canvas.value.width, canvas.value.height / 2)
  ctx.stroke()
}
</script>

<style scoped>
.audio-visualizer {
  width: 100%;
  height: 100%;
  background-color: #000;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>

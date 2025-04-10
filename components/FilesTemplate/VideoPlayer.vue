<template>
  <div class="tw-mt-4 tw-relative video-player">
    <video class="tw-w-full" v-if="isVideo" :src="source" autoplay loop></video>
    <img v-else :src="source"/>
  </div>
</template>


<script setup>
const props = defineProps(['source'])


const isVideo = computed(() => {
  return /\.(mp4|webm|ogg)$/i.test(props.source)
})

</script>

<style lang="scss" scoped>
.video-player {
  width: 50vw;
}

</style>

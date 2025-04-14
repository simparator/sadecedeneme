<template>
  <div>
      <ImageEffect class="image-preview" :filename="file.content" />
  </div>

</template>

<script setup>

const props = defineProps(['file']);

</script>

<style lang="scss" scoped>
.image-preview {
  width: 100%;
  object-fit: contain;
  min-width: 300px;

  img {
    width: 100%;
  }
}
</style>

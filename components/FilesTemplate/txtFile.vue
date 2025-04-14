<template>
  <div class="tw-mt-4">
    <pre>{{ file.content }}</pre>
  </div>
</template>

<script setup>

const props = defineProps(['file']);

</script>

<style scoped lang="scss">
h3 {
  color: #00ff00;
  font-weight: bold;
}
pre {
  padding: 2rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

<template>
  <div class="tw-w-6/12 suggestions">
    <p class="label">Available commands:</p>
    <ul class="list">
      <li v-for="(cmd, i) in content" :key="i">{{ cmd }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.suggestions {
  color            : $green;
  padding          : 1rem;
  border           : 1px solid $green;
  margin-top       : 0.5rem;
  white-space      : pre;
  line-height      : 1.4;
  box-shadow       : 0 0 4px $green;
}

.label {
  font-weight     : bold;
  margin-bottom   : 0.5rem;
  text-decoration : underline;
}

.list {
  list-style   : none;
  padding-left : 1ch;
}

.list li::before {
  content : "➜ ";
  color   : $green;
}
</style>

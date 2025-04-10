<template>
  <div class="tw-w-1/2 unknown-command">
    <p>Command not recognized. Type <span class="cmd">help</span> for a list of available commands.</p>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.unknown-command {
  color: $red;
  background-color: #000;
  padding: 0.5rem 1rem;
  border-left: 2px solid $red;
  margin-top: 0.5rem;
  box-shadow: inset 0 0 5px $red;
}

.cmd {
  color: $green;
  font-weight: bold;
}
</style>

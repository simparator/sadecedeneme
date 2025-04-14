<template>
  <div v-if="manifest" class="tw-mb-12 tw-flex tw-items-center tw-justify-start tw-gap-8">

    <ImageEffect :filename="manifest.iconName" class="tw-w-60" width="100" height="100" :zoom="false" />

    <div>
      <h2 class="tw-mb-2"> {{ terminal.serverName }}</h2>
      <p>ACCESS TO THIS NETWORK IS RESTRICTED.</p>
      <p>All activity is monitored. Failure to comply will result in immediate review.</p>
      <p v-if="loggedUser">Enter "help" for more information.</p>
    </div>

  </div>

</template>

<script setup>
import {useTerminalStore} from "~/stores/app.ts";

const terminal = useTerminalStore()

const serverAddress = computed(() => {
  return terminal.serverAddressData
})

const manifest = computed(() => {
  return terminal.manifestData
})

const loggedUser = computed(() => {
  return terminal.user
})

</script>

<style lang="scss" scoped>
h2 {
  font-size: 32pt;
  letter-spacing: 4px;
  color: $green;
}
</style>

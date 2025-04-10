<template>
  <div class="tw-w-6/12 tw-mt-4">

    <p class="tw-mb-4">You can read the help of a specific command by entering as follows: 'help commandName'</p>

    <p class="tw-mb-4">You can navigate in the commands usage history using the UP & DOWN arrow keys.</p>

    <p class="tw-mb-4">The TAB key will provide command auto-completion.</p>

    <div class="tw-flex tw-gap-x-16 tw-gap-y-2 tw-flex-wrap">
      <div v-for="command in commandList" :key="command">
        {{ command }}
      </div>
    </div>

  </div>
</template>

<script setup>
import {useTerminalStore} from "~/stores/app.js";

const terminal = useTerminalStore()

const commandList = computed(() => {
  return terminal.manifestData.commands
})

</script>

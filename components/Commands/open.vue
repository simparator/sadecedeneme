<template>
  <div class="tw-mt-4" v-if="!content">
    <p class="tw-text-red tw-italic">ERROR: Please provide file to open. Usage: open &lt;fileName&gt; </p>
  </div>
  <div class="tw-mt-4" v-else-if="file">
    <p v-if="!accessGranted">Access Denied: You do not have permission to view this file.</p>
    <div v-else>
      <Window :name="command" :result-component="resultComponent" :file="file" :lock-ration="lockRatio" @destroy="removeWindow"/>
    </div>
  </div>
  <div class="tw-mt-4" v-else-if="loading">
    <p>Searching file {{ command }}<TypingIndicators/> </p>
  </div>
  <div class="tw-mt-4" v-else>
    <p>This file does not exist.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTerminalStore } from '~/stores/app.ts';

const props = defineProps({
  content: String,
});

const command = props.content
const terminal = useTerminalStore();
const serverAddress = computed(() => {
  return terminal.serverAddressData
})
const file = ref(null); // File to show
const serverFiles = ref(''); // json of available files
const accessGranted = ref(false); // check if user has access
const resultComponent = ref(null)
const lockRatio = ref(false)
const loading = ref(true)

const extension = command.split('.').pop()

serverFiles.value = extension+'files'

if(command.includes(".vid") || command.includes(".audio") || command.includes('.pic')) {
  lockRatio.value = true
}

if (command.includes(".exe")) {
  const baseName = command.replace(".exe", "")
  resultComponent.value = baseName + "Exe"
} else {
  resultComponent.value = extension+'File'
}

const loadFile = async () => {
  try {
    const files = await $fetch(`/config/network/${serverAddress.value}/${serverFiles.value}.json`);
    const foundFile = files.find(f => f.name === command);  // searching for file
    if (foundFile) {
      // Checking rights
      const userId = terminal.user?.userId;
      // Filtering based on file's hidden parameter
      const isAuthorized = foundFile.authorizedUsers.some(user => user.userId === userId);
      if (isAuthorized) {
        file.value = foundFile;
        accessGranted.value = true;
      } else {
        file.value = true;
        accessGranted.value = false;
      }
    } else {
      console.log("File not found:", command);
    }

  } catch (e) {
    console.error(`Failed to load ${serverFiles.value}.json`, e);
  }

  loading.value = false

};

const emit = defineEmits(["destroy"])
function removeWindow() {
  emit("destroy")
}


onMounted(() => {
  loadFile();
});
</script>

<style scoped lang="scss">

</style>

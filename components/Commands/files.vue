<template>
  <div class="tw-w-6/12 tw-mt-4">

    <!-- Affichage des fichiers texte auxquels l'utilisateur a accès -->
    <div v-if="accessibleFiles.length > 0">
      <p class="tw-font-bold">Accessible Files:</p>
      <div class="tw-flex tw-gap-x-16 tw-gap-y-2 tw-flex-wrap">
        <div v-for="file in accessibleFiles" :key="file.name" class="tw-mt-2">
          {{ file.name }}
        </div>
      </div>
    </div>

    <p v-else>
      No files available for user {{ terminal.user.userName }}
    </p>


  </div>
</template>

<script setup>
import {useTerminalStore} from "~/stores/app.js";

const terminal = useTerminalStore()

const serverAddress = computed(() => {
  return terminal.serverAddressData
})

const fileTypes = ['txtfiles', 'picfiles', 'vidfiles', 'audiofiles', 'reportfiles', 'exefiles'];
const filesData = reactive({
  txtfiles: [],
  imagefiles: [],
  videofiles: [],
  audiofiles: [],
  reportfiles: [],
  exefiles: [],
});

const typeToKey = {
  txtfiles: 'txtfiles',
  picfiles: 'imagefiles',
  vidfiles: 'videofiles',
  audiofiles: 'audiofiles',
  reportfiles: 'reportfiles',
  exefiles: 'exefiles',
};

await Promise.all(
    fileTypes.map(async (type) => {
      try {
        const data = await $fetch(`/config/network/${serverAddress.value}/${type}.json`);
        filesData[typeToKey[type]] = data;
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(`Error loading ${type}:`, error);
        } else {
          console.warn(`${type}.json not found (404)`);
        }
        filesData[typeToKey[type]] = []; // default empty array if no json file
      }
    })
);

const userId = terminal.user?.userId;

function checkIfAuth(file) {
  return file.authorizedUsers?.some(user => user.userId === userId);
}

const accessibleFiles = computed(() => {
  return Object.values(filesData)
      .flat()
      .filter(file => checkIfAuth(file))
      .filter(file =>
          file.authorizedUsers.some(user => user.userId === userId && !user.hidden)
      )
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
});

</script>

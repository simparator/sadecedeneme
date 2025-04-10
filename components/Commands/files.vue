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

const txtfiles = ref([])
const videofiles = ref([])
const imagefiles = ref([])
const exefiles = ref([])

txtfiles.value = await $fetch(`/config/network/${serverAddress.value}/txtfiles.json`);
imagefiles.value = await $fetch(`/config/network/${serverAddress.value}/imagefiles.json`);
videofiles.value = await $fetch(`/config/network/${serverAddress.value}/videofiles.json`);
exefiles.value = await $fetch(`/config/network/${serverAddress.value}/exefiles.json`);

const userId = terminal.user?.userId;


// Liste des fichiers txt accessibles
const accessibleFiles = computed(() => {

  let filesToAccess = [];

  filesToAccess = txtfiles.value.filter(file => checkIfAuth(file));

  filesToAccess = [...filesToAccess , ...imagefiles.value.filter(file => checkIfAuth(file))];

  filesToAccess = [...filesToAccess , ...videofiles.value.filter(file => checkIfAuth(file))];

  filesToAccess = [...filesToAccess , ...exefiles.value.filter(file => checkIfAuth(file))];

  filesToAccess = filesToAccess.filter(file =>
      file.authorizedUsers.some(user => user.userId === userId && !user.hidden)
  )

  filesToAccess.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  // Filtrer les fichiers txt selon les utilisateurs autorisés
  return filesToAccess
});

function checkIfAuth(file) {
  return file.authorizedUsers.some(user => user.userId === userId);
}
</script>

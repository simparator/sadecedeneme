<template>
  <div class="tw-mt-4" v-if="file">
    <BashLoader v-if="loading" text="Loading File..."/>
    <p v-if="!accessGranted">Access Denied: You do not have permission to view this file.</p>
    <div v-else>
      <ImageEffect class="image-preview" :filename="file.source" />
    </div>
  </div>
  <div class="tw-mt-4" v-else>
    <p>This file does not exist.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTerminalStore } from '~/stores/app.ts';

const props = defineProps({
  content: String,  // Le nom du fichier sans l'extension (ex : 'a')
});

const terminal = useTerminalStore();
const serverAddress = computed(() => {
  return terminal.serverAddressData
})
const loading = ref(true);
const file = ref(null); // Fichier à afficher
const accessGranted = ref(false); // Vérifie si l'utilisateur a accès au fichier

// Fonction pour charger les fichiers et vérifier les droits d'accès
const loadFile = async () => {
  try {
    const files = await $fetch(`/config/network/${serverAddress.value}/imagefiles.json`);
    const foundFile = files.find(f => f.name === props.content);  // On cherche le fichier
    if (foundFile) {
      // Vérification des droits d'accès
      const userId = terminal.user?.userId;
      loading.value = false

      // On filtre pour vérifier si l'utilisateur a un accès et que 'hidden' est false
      const isAuthorized = foundFile.authorizedUsers.some(user => user.userId === userId);

      if (isAuthorized) {
        file.value = foundFile;
        accessGranted.value = true;
      } else {
        file.value = true;
        accessGranted.value = false;
      }
    } else {
      console.log("File not found:", props.filename);
      loading.value = false
    }
  } catch (e) {
    loading.value = false
    console.error("Failed to load imagefiles.json", e);
  }
};

onMounted(() => {
  loadFile();
});
</script>

<style lang="scss" scoped>
.image-preview {
  max-width: 50vw;
  object-fit: contain;
  border: 1px solid $green;
  box-shadow: 0 0 3px $green;

  img {
    width: 50vw;
  }
}
</style>

<template>
  <div class="tw-mt-4 VideoFile" v-if="file">
    <p v-if="!accessGranted">Access Denied: You do not have permission to view this file.</p>
    <div v-else>
      <VideoPlayer :source="`/config/network/${serverAddress}/videos/${file.source}`"/>
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
const file = ref(null); // Fichier à afficher
const accessGranted = ref(false); // Vérifie si l'utilisateur a accès au fichier

// Fonction pour charger les fichiers et vérifier les droits d'accès
const loadFile = async () => {
  try {
    const files = await $fetch(`/config/network/${serverAddress.value}/videofiles.json`);
    const foundFile = files.find(f => f.name === props.content);  // On cherche le fichier
    if (foundFile) {
      // Vérification des droits d'accès
      // On filtre pour vérifier si l'utilisateur a un accès et que 'hidden' est false
      const userId = terminal.user?.userId;

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
    }
  } catch (e) {
    console.error("Failed to load videofiles.json", e);
  }
};

onMounted(() => {
  loadFile();
});
</script>

<style scoped>
h3 {
  color: #00ff00;
  font-weight: bold;
}
pre {
  background-color: rgba(0, 0, 0, 0.7);
  color: #00ff00;
  padding: 1rem;
  border: 1px solid #00ff00;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

<template>
  <div class="tw-mt-4 decrypt">
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="!finished">{{ animationText }}</p>
    <p v-else>{{ result }}</p>
  </div>
</template>

<script setup>
import { useTerminalStore } from '~/stores/app.ts'

const props = defineProps({
  content: {
    type: String,
    required: false,
    default: ''
  }
})

const terminal = useTerminalStore()
const serverAddress = computed(() => terminal.serverAddressData)

const error = ref(null)
const result = ref('')
const animationText = ref('')
const finished = ref(false)

let animationInterval

onMounted(async () => {
  if (!props.content) {
    error.value = "ERROR: Please provide text to decrypt. Usage: decrypt <encryptedString>"
    return
  }

  try {
    const entries = await $fetch(`/config/network/${serverAddress.value}/decryption.json`)
    const entry = entries.find(e => e.encrypted === props.content)

    // Checking user rights
    const userId = terminal.user?.userId;
    if (entry && !entry.authorizedUsers.includes(userId)) {
      error.value = "ERROR: You do not have access to this decrypted data."
      return
    }


    // Animation
    let animationSteps = 15
    let currentStep = 0
    animationInterval = setInterval(() => {
      animationText.value = Array.from({ length: props.content.length }, () =>
          String.fromCharCode(33 + Math.floor(Math.random() * 94))
      ).join('')

      currentStep++
      if (currentStep >= animationSteps) {
        clearInterval(animationInterval)
        finished.value = true
        result.value = entry ? entry.decrypted : generateFailureOutput()
      }
    }, 100)
  } catch (e) {
    error.value = "ERROR: Failed to fetch decryption data."
  }
})

onBeforeUnmount(() => {
  if (animationInterval) clearInterval(animationInterval)
})

function generateFailureOutput() {
  const randomLength = 12 + Math.floor(Math.random() * 8)
  return Array.from({ length: randomLength }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('') + '... DECRYPTION FAILED'
}
</script>

<style scoped lang="scss">
.decrypt {
  color: $green;

  .error {
    color: $red;
    font-style: italic;
  }
}
</style>

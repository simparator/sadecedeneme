<template>
  <div class="tw-mt-4">
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="connecting === 'locating'">Locating server {{ connectionData.address }}<TypingIndicators /></p>
    <p v-else-if="connecting === 'verifying'">Verifying credentials for {{ connectionData.username }}<TypingIndicators /></p>
    <p v-else-if="connecting === 'connecting'">Connecting to server {{ connectionData.address }}<TypingIndicators /></p>

  </div>
</template>

<script setup>
import { useTerminalStore } from "~/stores/app.js"

const props = defineProps({
  content: {
    type: String,
    required: false,
    default: ''
  }
})

const error = ref(null)
const connecting = ref(false)
const terminal = useTerminalStore()
const emit = defineEmits(["changeServer"])

// Parses content string like: server@username:password
const parseConnectionString = (input) => {
  const [addressPart, credentials] = input.split('@')
  const [username, password] = credentials?.split(':') || []
  return {
    address: addressPart,
    username,
    password
  }
}

const connectionData = parseConnectionString(props.content)

const checkCredentials = async ({ address, username, password }) => {
  try {
    const userList = await $fetch(`/config/network/${address}/userlist.json`)
    return userList.find(user => user.userId === username && user.password === password)
  } catch (e) {
    return false
  }
}

onMounted(() => {
  const connectToServer = async () => {
    if (!connectionData.address || !connectionData.username || !connectionData.password) {
      error.value = "ERROR: Please provide server address. Usage: telnet <serverAddress>@<username>:<password>"
      return
    }

    try {
      connecting.value = "locating"

      await nextTick()
      await new Promise((r) => setTimeout(r, 2000)) // petit délai

      const res = await $fetch(`/config/network/${connectionData.address}/manifest.json`)

      const users = await $fetch(`/config/network/${connectionData.address}/userlist.json`)

      connecting.value = "verifying"
      await nextTick()
      await new Promise((r) => setTimeout(r, 2000)) // petit délai

      // Check credentials
      const validCredentials = await checkCredentials(connectionData)
      if (!validCredentials) {
        connecting.value = "verifying"
        error.value = "ERROR: Invalid username or password."
        return
      }

      connecting.value = "connecting"

      setTimeout(async () => {
        connecting.value = false
        terminal.setServerAddress(connectionData.address)
        terminal.loadManifest(connectionData.address)
        // changement d'état dans le store, etc.
        terminal.setUser(await checkCredentials(connectionData))
        emit("changeServer")
      }, 1500)

    } catch (e) {
      setTimeout(() => {
        connecting.value = false
        error.value = `Error: Server ${connectionData.address} not found or unreachable.`
      } , 2000)

    }
  }

  connectToServer()
})
</script>

<style scoped lang="scss">
.error {
  color: $red;
  font-style: italic;
}
</style>

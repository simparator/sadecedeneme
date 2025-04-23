<template>
  <div class="tw-mt-4 mail">
    <h2 class="tw-mb-2">Incoming messages</h2>

    <div v-if="userMails.length === 0" class="no-mail">
      <p>No messages found for this user.</p>
    </div>

    <div v-for="(mail, index) in userMails" :key="index" class="mail-item">
      <p class="from"><strong>Recieved :</strong> {{ mail.date }}</p>
      <h3 class="title">{{ mail.title }}</h3>
      <p class="from"><strong>From:</strong> {{ mail.from }}</p>
      <p class="body tw-mt-4">{{ mail.body }}</p>

      <div v-if="mail.image" class="attachments">
        <h4 class="attachments-title">Attachments:</h4>
        <div class="image-container">

          <ImageEffect class="image-preview" :filename="mail.image" width="300" height="300" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTerminalStore } from "~/stores/app.ts"

const terminal = useTerminalStore()

const userId = computed(() => terminal.user?.userId)

const mails = ref([])
const userMails = computed(() => {
  if (!userId.value) return []
  return mails.value.filter(mail => mail.to.includes(userId.value))
})

onMounted(async () => {
  try {
    mails.value = await $fetch(`/config/network/${serverAddress.value}/mailserver.json`)
  } catch (e) {
    console.error("Failed to load mailserver.json", e)
  }
})

const serverAddress = computed(() => {
  return terminal.serverAddressData
})
</script>

<style lang="scss" scoped>
.mail {
  color: $green;
  padding: 1rem;
  border: 1px solid $green;
  box-shadow: 0 0 5px $green;

  .no-mail {
    font-style: italic;
    color: $red;
  }

  .mail-item {
    padding: 1rem;
    border-top: 1px dashed $green;
    background-color: rgba(0, 0, 0, 0.5);

    .title {
      font-weight: bold;
      color: $green;
      margin-bottom: 0.25rem;
    }

    .from {
      font-style: italic;
    }

    .body {
      white-space: pre-wrap;
    }

    .attachments {
      margin-top: 1rem;
      border-top: 1px solid $green;
      padding-top: 1rem;

      .attachments-title {
        font-weight: bold;
        color: $green;
        margin-bottom: 0.5rem;
      }

      .image-container {
        display: flex;
        gap: 1rem;
        justify-content: flex-start;
        flex-wrap: wrap;

        .image-preview {
          max-width: 300px;
          object-fit: contain;
          border: 1px solid $green;
          box-shadow: 0 0 3px $green;
        }
      }
    }
  }
}
</style>

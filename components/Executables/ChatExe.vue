<template>
  <div class="chat-window">

    <div class="tw-flex tw-justify-between tw-items-center tw-bg-green tw-px-8 tw-py-4">
      Chat.exe

      <div class="tw-text-right">
        X
      </div>

    </div>

    <div class="tw-p-8">

      <div class="chat">
        <div v-for="(msg, index) in chatHistory" :key="index">
          <p class="tw-text-white"><strong class="tw-text-green">{{ messageWithName(msg.role) }}:</strong> {{ msg.content }}</p>
        </div>

        <p v-if="isTyping"><strong>Nyx:</strong> <TypingIndicators/></p>
      </div>

      <div id="input-line" class="tw-mt-4 input-line">
        <div class="prompt">[{{loggedUser.userName}}@{{ serverName }}] #</div>
        <div><input class="tw-mt-4 cmdline" v-model="userInput"  autofocus ref="lineInput"
                    @keydown.enter="handleSubmit"
                    @keydown.esc="selfDestruct"
        /></div>
      </div>

    </div>
  </div>
</template>

<script setup>

import {useTerminalStore} from "~/stores/app.js";

const isTyping = ref(false)
const userInput = ref('')
const lineInput = ref(null)

const terminal = useTerminalStore()
onMounted(() => {
  terminal.setChat(true)
  autoFocus()
})

const serverName = 'localhost'

const loggedUser = computed(() => {
  return terminal.user
})

function autoFocus() {
  lineInput.value.focus()
}

const emit = defineEmits(["destroy"])

function selfDestruct() {
  terminal.setChat(false)
  emit("destroy")
}

const messages = [
  { role: 'assistant', content: "Hey, Agent Darcy, je vais aller droit au but, tu es en danger" }
]

const sendMessageToAI = async (messages) => {
  const response = await $fetch('/api/chat', {
    method: 'POST',
    body: { messages }
  })

  return response.choices[0].message.content
}

function messageWithName(role) {
  if(role === "assistant") {
    return "Nyx"
  }
  return loggedUser.value.userName
}

const chatHistory = ref([...messages]) // Démarre avec les messages initiaux
const handleSubmit = async () => {
  if (!userInput.value.trim()) return

  isTyping.value = true

  // add message to history
  chatHistory.value.push({ role: 'user', content: userInput.value })

  const reply = await sendMessageToAI(chatHistory.value)

  isTyping.value = false

  chatHistory.value.push({ role: 'assistant', content: reply })
  userInput.value = ''
  autoFocus();
  setTimeout(() => {
    window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
  } , 300)
}


</script>

<style scoped lang="scss">

.chat-window {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 50vw;
  height: 70dvh;
  border: solid 1px $green;
  background-color: #000;
  transform: translate(-50% , -50%);
  overflow: auto;
}

.chat {
  padding: 1rem;
}

</style>

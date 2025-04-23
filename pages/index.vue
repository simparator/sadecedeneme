<template>



  <div @click="handleClick" id="terminal-container">

    <div class="tw-p-24">

      <BashLoader v-if="!manifest || firstLoading" text="Booting System..."/>

      <div v-if="manifest && !firstLoading">
        <Manifest />

        <Login v-if="!loggedUser" />
      </div>

      <div v-if="loggedUser">
        <p >Access granted. Welcome {{loggedUser.userName }} </p>

        <!-- Output section -->
        <output >
          <div v-for="(item, index) in commandHistory" :key="index">
            <div class="tw-mt-4 input-line">
              <div class="prompt">[{{loggedUser.userName}}@{{ serverName }}] #</div>
              <p>{{ item.command }}</p>

            </div>
            <component v-if="item.show" :is="item.result" :content="item.props" @destroy="removeWindow(index)" @changeServer="changeServer" />
          </div>

        </output>


        <div id="input-line" class="tw-mt-4 input-line">
          <div class="prompt">[{{loggedUser.userName}}@{{ serverName }}] #</div>
          <div><input class="cmdline" autofocus ref="cmdline"
                      @keydown.enter="handleCommand"
                      @keydown.up.prevent="handleKeyUpDown"
                      @keydown.down.prevent="handleKeyUpDown"
                      @keydown.tab.prevent="handleAutoComplete"
          /></div>
        </div>

      </div>



    </div>
  </div>


</template>

<script setup>

import Manifest from "~/components/Manifest/Manifest.vue";
import {useTerminalStore} from "~/stores/app.ts";
import BashLoader from "~/components/Loaders/BashLoader.vue";
import {computed} from "vue";

const terminal = useTerminalStore()

const serverName = computed(() => terminal.serverAddressData)

const historyIndex = ref(-1)
const commandHistory = ref([])
const firstLoading = ref(true)

const manifest = computed(() => {
  return terminal.manifestData
})

const commandList = computed(() => {
  return manifest.value.commands
})

const loggedUser = computed(() => {
  return terminal.userData
})

onMounted(() => {
  terminal.loadManifest(serverName.value)
  setTimeout(() => {
    firstLoading.value = false
  } , 3000)
})

// auto focus cmdline on login
watch(loggedUser, async (newVal) => {
  if (newVal) {
    await nextTick();
    cmdline.value?.focus();
  }
});

const cmdline = ref(null)
function autoFocus() {

  if(cmdline.value) {
    cmdline.value.focus()
  }
}

function handleClick(event) { // prevent autofocus if click is from inside a window
  if (event.target.closest('.drv')) return

  autoFocus()
}

function changeServer() {
  commandHistory.value = []; // Clear history
  cmdline.value.value = '' // Clear input
}

function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
  } , 300)
}

function addToHistory(command, result , props) {
  commandHistory.value.push({ command, result , props , show : true })
  scrollToBottom() // scroll to bottom of screen after each command
}

function removeWindow(index) {
  commandHistory.value[index].show = false
}

function handleCommand() {
  const command = cmdline.value.value.trim()

  if (!command) return

  let resultComponent = null
  let props = null

  if(command === "logout") {
    commandHistory.value = []; // Clear history
    cmdline.value.value = '' // Clear input
    terminal.setUser(null) // Logout
    return;
  }

  if(command === "clear") {
    commandHistory.value = []; //  Clear history
    cmdline.value.value = '' // Clear input
    autoFocus()
    return;
  }

  if (command.startsWith("open")) {
    const args = command.split(" ").slice(1).join(" ")
    resultComponent = "open"
    props = args
  }
  else if (command.startsWith("telnet")) {
    const args = command.split(" ")[1]
    resultComponent = "telnet"
    props = args
  }
  else if (command.startsWith("decrypt")) {
    const args = command.split(" ").slice(1).join(" ")
    resultComponent = "Decrypt"
    props = args
  }
  else if (command.startsWith("help")) {
    const args = command.split(" ").slice(1).join(" ")
    resultComponent = "Help"
    props = args
  }
  else if(!commandList.value.includes(command)) {
    resultComponent = 'UnknownCommand'
  } else {
    resultComponent = command
    props = command
  }

  // add command and component to history
  addToHistory(command, resultComponent , props)

  cmdline.value.value = '' // clear input
  autoFocus()
}

function handleKeyUpDown(e) {
  if (commandHistory.value.length === 0) return

  if (e.key === 'ArrowUp') {
    if (historyIndex.value > 0) {
      historyIndex.value--
    } else {
      historyIndex.value = 0
    }
  } else if (e.key === 'ArrowDown') {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
    } else {
      historyIndex.value = commandHistory.value.length
      cmdline.value.value = ''
      return
    }
  }

  const command = commandHistory.value[historyIndex.value]?.command
  if (command) {
    cmdline.value.value = command
  }
}

function handleAutoComplete(e) {
  if (e.key !== 'Tab') return

  e.preventDefault()

  const currentInput = cmdline.value.value.trim()
  const matches = commandList.value.filter(cmd => cmd.startsWith(currentInput))

  if (matches.length === 1) {
    cmdline.value.value = matches[0]
  } else if (matches.length > 1) {
    addToHistory(currentInput, "CommandSuggestions" , matches)
  }
}
</script>

<style lang="scss" scoped>



</style>

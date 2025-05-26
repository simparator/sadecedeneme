<template>
  <div>
    <p>AUTH REQUIRED — Input: username:password</p>
    <div class="tw-flex">
      <div class="prompt">
        [anonymous] #
      </div>

      <div>
        <input class="cmdline" autofocus ref="loginline" @keydown.enter="handleLogin"/>
      </div>
    </div>

    <p> {{ loginMessage }}</p>


  </div>
</template>

<script setup>
import {useTerminalStore} from "~/stores/app.js";

const loginline = ref(null)
const loginMessage = ref('')
function autoFocus() {
  loginline.value.focus()
}



onMounted(() => {
  autoFocus()

  const handleClick = (event) => {
    autoFocus();
  };

  window.addEventListener("click", handleClick);

  onBeforeUnmount(() => {
    window.removeEventListener("click", handleClick);
  });
})



const terminal = useTerminalStore()


const serverName = computed(() => {
  return terminal.serverAddressData
})

const userList = ref([])
// Charger la liste des utilisateurs
userList.value = await $fetch(`/config/network/${serverName.value}/userlist.json`)

// Fonction de login
function handleLogin() {
  const input = loginline.value.value.trim()
  const [username, password] = input.split(':')

  if (!username || !password) {
    loginMessage.value = 'Syntax error. Expected format: username:password'
    loginline.value.value = '' // reset input
    return
  }

  const user = userList.value.find(
      (u) => u.userId === username && u.password === password
  )

  if (user) {
    terminal.setUser(user)
  } else {
    loginMessage.value = 'Access denied. Invalid credentials.'
  }

  loginline.value.value = '' // reset input
  autoFocus()
}

</script>

<style scoped>

</style>

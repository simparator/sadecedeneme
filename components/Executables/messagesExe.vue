<template>
  <div class="tw-p-8">
    <p>Executables are more advanced scripts, for instance someone is typing something to you right now !</p>

    <p v-for="(message , i) in sentMessages" :key="i">
      {{ message }}
    </p>

    <p v-if="typing" class="tw-text-green">
      Agent Deloria is typing
      <TypingIndicators/>
    </p>


  </div>
</template>

<script setup>
import TypingIndicators from "~/components/Loaders/TypingIndicators.vue";

const typing = ref(false)

const messages = ref([
  "Hey, wanna buy some poison ? :)",
  "Just kidding it's some totally legit and legal medicine haha",
  "Don't tell the cops ;)",
  "Please ? :'("
])

const sentMessages = ref([])

onMounted(() => {
  typeMessage()
})
function typeMessage() {
  let index = 0
  typing.value = true

  function typeNext() {
    const message = messages.value[index]
    const delay = Math.floor(700 + Math.random() * 700 * (message.length / 10))

    setTimeout(() => {
      sentMessages.value.push(message)
      index++

      if (index >= messages.value.length) {
        typing.value = false
        window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
        return
      }

      window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);


      typeNext() // continuer avec le message suivant
    }, delay)
  }

  // Ajout d’un délai avant d’écrire le premier message
  setTimeout(() => {
    typeNext()
  }, 1000 + Math.random() * 500) // petite pause avant d’écrire (entre 500ms et 1s)
}
</script>

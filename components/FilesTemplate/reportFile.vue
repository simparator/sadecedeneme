<template>
  <div class="tw-p-8">

    <h2> {{ file.title }} </h2>

    <ImageEffect class="tw-my-8" :filename="file.image"/>

    <p>{{ file.content }}</p>

    <div v-if="file.agents && file.agents.length > 0" class="tw-mt-8">
      <div v-for="agent in file.agents" class="tw-flex tw-justify-between tw-items-start tw-gap-12 agent">

        <div>

          <h3>
            Agent ID : <span class="tw-text-white">{{ agent.number }}</span>
          </h3>

          <h3>
            Agent name : <span class="tw-text-white">{{ agent.name }}</span>
          </h3>

          <h3>
            Member since : <span class="tw-text-white">{{ agent.since }}</span>
          </h3>

          <h3>
            Height : <span class="tw-text-white">{{ agent.height }}</span>
          </h3>

          <h3>
            Weight : <span class="tw-text-white">{{ agent.weight }}</span>
          </h3>

          <h3>
            Status : <span class="tw-text-red">{{ agent.status }}</span>
          </h3>

          <p class="tw-mt-4">{{ agent.information }}</p>

        </div>

        <ImageEffect class="agent-portrait" :cover="true" :filename="agent.photo"/>

      </div>
    </div>


  </div>
</template>

<script setup>

const props = defineProps(['file']);

</script>

<style scoped lang="scss">
h2 {
  color: $green;
  font-weight: bold;
  font-size: 24pt;
}

h3 {
  color: $green;
}
p {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.agent {
  padding: 2rem 0;
  border-top: 1px dashed $green;
}

.agent-portrait {
  flex-shrink: 0;
  width: 25%;
  aspect-ratio: 3/3.5;
  border: 2px solid $green;
  box-shadow: 0 0 8px $green;
}
</style>

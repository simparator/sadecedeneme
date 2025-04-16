<template>

  <DraggableResizableVue
      v-model:x="element.x"
      v-model:y="element.y"
      v-model:w="element.w"
      v-model:h="element.h"
      :min-height="300"
      :min-width="300"
      v-model:active="element.isActive"
      :resizable="true"
      drag-handle=".window-header"
      handles-type="borders"
      :style="{zIndex : windowZ}"
      :lock-aspect-ratio="lockRation"
  >

    <div class="window-container" @click="setZ">

      <div class="tw-shrink-0 tw-flex tw-justify-between tw-items-center tw-bg-green tw-gap-12 tw-pl-8 window-header">

        {{ name }}

        <div class="close" @click="selfDestruct">
          X
        </div>

      </div>

      <div class="tw-grow tw-bg-black window-content">
        <component :is="resultComponent" :file="file" />
      </div>
    </div>

  </DraggableResizableVue >
</template>

<script setup>
import {useTerminalStore} from "~/stores/app.js";

const props = defineProps(['name' , 'resultComponent', 'file' , 'lockRation'])

const terminal = useTerminalStore()

const windowZ = ref(null)

const element = ref({
  x: 20,
  y: 20,
  w: 600,
  h: 450,
  isActive: false,
})

onMounted(() => {
  setZ()
})

function setZ() {
  terminal.setWindowZ()
  windowZ.value = terminal.windowZ
}

const emit = defineEmits(["destroy"])

function selfDestruct() {
  emit("destroy")
}

</script>

<style scoped lang="scss">

.close {
  flex-shrink: 0;
  cursor : pointer;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  aspect-ratio: 1/1;
  background-color: $red;
  &:hover {
    background-color: rgba($red , .8);
  }
}
</style>

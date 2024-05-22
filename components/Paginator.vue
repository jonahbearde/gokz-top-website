<script setup lang="ts">
const offset = defineModel<number>("offset", { required: true })
const limit = defineModel<number>("limit", { required: true })

function firstPage() {
  offset.value = 0
}

function prevPage() {
  if (offset.value > 0) {
    offset.value -= limit.value
  }
}

function nextPage() {
  offset.value += limit.value
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div @click="firstPage" class="cursor-pointer hover:bg-gray-200 px-2 py-1">
      TOP30
    </div>
    <div @click="prevPage" class="cursor-pointer hover:bg-gray-200 px-2 py-1">
      Prev
    </div>
    <div @click="nextPage" class="cursor-pointer hover:bg-gray-200 px-2 py-1">
      Next
    </div>
  </div>
</template>

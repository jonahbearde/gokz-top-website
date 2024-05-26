<script setup lang="ts">
import type { SearchItem } from "~/types/common"
defineProps<{
  items: SearchItem[]
}>()

const emits = defineEmits(["clickPlayer"])
</script>

<template>
  <div
    class="absolute top-9 left-0 p-1 z-30 bg-gray-200 border border-gray-400"
  >
    <div
      v-for="item in items"
      :key="item.steamid"
      class="mt-1 flex items-center hover:bg-gray-300 cursor-pointer"
      @click="emits('clickPlayer', item.steamid)"
    >
      <VImage
        class="w-10 h-10"
        :src="`https://avatars.cloudflare.steamstatic.com/${item.avatar_hash}_medium.jpg`"
        placeholder="/placeholder.jpeg"
      />
      <p class="px-2 truncate text-ellipsis">{{ item.name }}</p>
    </div>
  </div>
</template>

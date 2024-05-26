<script setup lang="ts">
import type { Mode, SearchItem } from "../types/common"
import type { Player } from "~/types/player"
import { debounce } from "radash"
import { useStorage } from "@vueuse/core"

const props = defineProps<{
  mode: Mode
  limit: number
}>()

const loading = defineModel<boolean>("loading")
const me = defineModel<Player | null>("me")
const offset = defineModel<number>("offset")

const apiBase = useRuntimeConfig().public.apiBase

const inputContainer = ref()

const searchResults = ref<SearchItem[]>([])
const searchQuery = ref("")
const search = debounce({ delay: 300 }, searchPlayer)
const searchHistory = useStorage<SearchItem[]>("searchHistory", () => [])

const showHistory = ref(false)
const history = computed(() => {
  return searchHistory.value.filter((item) => item.mode === props.mode)
})

watch(searchQuery, (searchQuery) => {
  search(searchQuery)
})

onMounted(() => {
  document.addEventListener("click", onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside)
})

function onClickOutside(event: Event) {
  if (inputContainer.value && !inputContainer.value.contains(event.target)) {
    showHistory.value = false
  }
}

async function onClickPlayer(steamId: string) {
  loading.value = true

  searchQuery.value = ""
  searchResults.value = []

  showHistory.value = false
  try {
    if (steamId) {
      const response = await fetch(
        `${apiBase}/leaderboard/${steamId}?mode=${props.mode}`
      )

      me.value = await response.json()

      nextTick(() => {
        addToHistory(me.value as Player)

        if (me.value) {
          offset.value =
            Math.floor((me.value.rank - 1) / props.limit) * props.limit
        }
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function addToHistory(player: Player) {
  if (searchHistory.value.length > 10) {
    searchHistory.value.shift()
  }

  const index = searchHistory.value.findIndex(
    (item) => item.steamid === player.steamid
  )

  if (index >= 0) {
    searchHistory.value.splice(index, 1)
  }

  searchHistory.value.unshift({
    mode: props.mode,
    name: player.name,
    steamid: player.steamid,
    avatar_hash: player.avatar_hash,
  })
}

async function searchPlayer(searchQuery: string) {
  try {
    if (searchQuery === "") {
      searchResults.value = []
    } else {
      const response = await fetch(
        `${apiBase}/leaderboard/search/${searchQuery}`
      )
      searchResults.value = await response.json()
    }
  } catch (error) {
    searchResults.value = []
    console.log(error)
  }
}
</script>

<template>
  <!-- search -->
  <div class="flex items-center gap-2">
    <p class="text-lg">Search</p>
    <div ref="inputContainer" class="relative">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Name, Steam ID"
        @focus="showHistory = true"
        @input="showHistory = false"
        class="border border-gray-400 p-1"
      />

      <Suggestions
        v-if="searchResults.length > 0"
        :items="searchResults"
        @click-player="onClickPlayer"
      />

      <Suggestions
        v-if="showHistory && history.length > 0"
        :items="history"
        @click-player="onClickPlayer"
      />
    </div>
  </div>
</template>

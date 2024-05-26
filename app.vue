<script setup lang="ts">
import type { Player } from "./types/player"
import type { Mode, SearchItem } from "./types/common"
import { debounce } from "radash"
import { useStorage } from "@vueuse/core"

useHead({
  title: "GOKZ TOP",
})

const apiBase = useRuntimeConfig().public.apiBase

const mode = ref<Mode>("kz_timer")
const offset = ref(0)
const limit = ref(30)

const loading = ref(false)

const showHistory = ref(false)

const players = ref<Player[]>([])
const me = ref<Player | null>(null)

const dialog = ref()

const searchQuery = ref("")
const searchResults = ref<SearchItem[]>([])
const search = debounce({ delay: 300 }, searchPlayer)

const searchHistory = useStorage<SearchItem[]>("searchHistory", () => [])

getRanking()

watch([mode, offset], async ([oldMode, oldOffset], [newMode, newOffset]) => {
  if (oldMode !== newMode || oldOffset !== newOffset) {
    getRanking()
  }
})

watch(searchQuery, (searchQuery) => {
  search(searchQuery)
})

async function getRanking() {
  loading.value = true
  try {
    const response = await fetch(
      `${apiBase}/leaderboard?mode=${mode.value}&offset=${offset.value}&limit=${limit.value}`
    )

    players.value = await response.json()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function onClickPlayer(steamId: string) {
  loading.value = true
  searchQuery.value = ""
  searchResults.value = []
  try {
    if (steamId) {
      const response = await fetch(
        `${apiBase}/leaderboard/${steamId}?mode=${mode.value}`
      )

      me.value = (await response.json()) as Player

      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }

      searchHistory.value.push({
        name: me.value.name,
        steamid: me.value.steamid,
        avatar_hash: me.value.avatar_hash,
      })

      if (me.value) {
        offset.value =
          Math.floor((me.value.rank - 1) / limit.value) * limit.value
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
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

function onOpenModal() {
  dialog.value.showModal()
}

function closeModal() {
  dialog.value.close()
}

function changeMode(newMode: Mode) {
  offset.value = 0
  mode.value = newMode
}
</script>

<template>
  <div class="app p-2 bg-gray-100">
    <div
      class="flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-16 lg:items-center"
    >
      <!-- logo -->
      <div class="flex items-center gap-2">
        <img src="/logo.png" class="w-12 h-auto" />
        <p class="title text-2xl font-bold">GOKZ.TOP</p>
      </div>

      <!-- modes -->
      <div class="flex items-center gap-4 text-lg font-medium">
        <div
          :class="mode === 'kz_timer' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="changeMode('kz_timer')"
        >
          KZT
        </div>
        <div
          :class="mode === 'kz_simple' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="changeMode('kz_simple')"
        >
          SKZ
        </div>
        <div
          :class="mode === 'kz_vanilla' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="changeMode('kz_vanilla')"
        >
          VNL
        </div>
      </div>

      <!-- search -->
      <div class="flex items-center gap-2">
        <p class="text-lg">Search</p>
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Name, Steam ID"
            @focus="showHistory = true"
            @input="showHistory = false"
            @blur="showHistory = false"
            class="border border-gray-400 p-1"
          />

          <Suggestions
            v-if="searchResults.length > 0"
            :items="searchResults"
            @click-player="onClickPlayer"
          />

          <Suggestions
            v-if="showHistory && searchHistory.length > 0"
            :items="searchHistory"
            @click-player="onClickPlayer"
          />
        </div>
      </div>

      <!-- paginator -->
      <Paginator v-model:offset="offset" v-model:limit="limit" />
    </div>

    <div class="overflow-x-auto lg:overflow-visible">
      <Loading v-if="loading" class="mx-auto" />
      <Table
        v-else
        :players="players"
        :me="me"
        :mode="mode"
        @open-modal="onOpenModal"
        class="mt-2"
      />
    </div>

    <Paginator v-model:offset="offset" v-model:limit="limit" class="mt-2" />

    <dialog ref="dialog" class="p-2">
      <div
        @click="closeModal"
        class="w-max px-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
      >
        Close
      </div>
      <p class="mb-2">
        Thanks to
        <a
          href="https://steamcommunity.com/id/zuoE"
          target="_blank"
          class="text-blue-400 underline"
          >1</a
        >, the ratings are calculated using the following algorithm:
      </p>
      <Formula />
    </dialog>
  </div>
</template>

<style>
.app {
  font-family: "Chivo", sans-serif;
}

.title {
  font-family: "Signika", sans-serif;
}
</style>

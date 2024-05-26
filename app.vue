<script setup lang="ts">
import type { Player } from "./types/player"
import type { Mode } from "./types/common"

useHead({
  title: "GOKZ TOP",
})

const apiBase = useRuntimeConfig().public.apiBase

const mode = ref<Mode>("kz_timer")
const offset = ref(0)
const limit = ref(30)

const loading = ref(false)

const players = ref<Player[]>([])
const me = ref<Player | null>(null)

const dialog = ref()

getRanking()

watch([mode, offset], async ([oldMode, oldOffset], [newMode, newOffset]) => {
  if (oldMode !== newMode || oldOffset !== newOffset) {
    getRanking()
  }
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

      <Search
        :mode="mode"
        :limit="limit"
        v-model:loading="loading"
        v-model:me="me"
        v-model:offset="offset"
      />

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

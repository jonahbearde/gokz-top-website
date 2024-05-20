<script setup lang="ts">
import type { Player } from "./types/player"
import { useStorage } from "@vueuse/core"
import { debounce } from "radash"

type Mode = "kz_timer" | "kz_simple" | "kz_vanilla"

interface SearchResult {
  name: string
  steamid: string
  avatar_hash: string
}

useHead({
  title: "GOKZ TOP",
})

const apiBase = useRuntimeConfig().public.apiBase

const mode = ref<Mode>("kz_timer")
const offset = ref(0)
const limit = ref(50)

const loading = ref(false)

const players = ref<Player[]>([])
const me = ref<Player>()

const searchQuery = useStorage("search", () => "")
const searchResults = ref<SearchResult[]>([])
const search = debounce({ delay: 300 }, searchPlayer)

getRanking()

watch([mode, offset, limit], async () => {
  await getRanking()
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

async function goToPlayer(steamId: string) {
  loading.value = true
  searchQuery.value = ''
  searchResults.value = []
  try {
    if (steamId) {
      const response = await fetch(
        `${apiBase}/leaderboard/${steamId}?mode=${mode.value}`
      )

      me.value = await response.json()

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

function goToSteam(steamid: string) {
  navigateTo(`https://steamcommunity.com/profiles/${steamid}`, {
    external: true,
  })
}

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
  <div class="app p-4 bg-gray-100">
    <div class="flex flex-wrap gap-2 items-center lg:justify-around">
      <div class="flex items-center gap-4 text-lg font-medium">
        <div
          :class="mode === 'kz_timer' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="mode = 'kz_timer'"
        >
          KZT
        </div>
        <div
          :class="mode === 'kz_simple' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="mode = 'kz_simple'"
        >
          SKZ
        </div>
        <div
          :class="mode === 'kz_vanilla' ? 'bg-gray-200' : ''"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
          @click="mode = 'kz_vanilla'"
        >
          VNL
        </div>
      </div>

      <div class="relative flex items-center gap-2">
        <p class="text-lg">Search</p>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Name, Steam ID"
          class="border border-gray-400 p-1"
        />

        <div
          v-if="searchResults.length > 0"
          class="absolute top-10 p-1 z-20 bg-gray-200 border border-gray-400"
        >
          <div
            v-for="result in searchResults"
            :key="result.steamid"
            class="mt-1 flex items-center hover:bg-gray-300 cursor-pointer"
            @click="goToPlayer(result.steamid)"
          >
            <img
              :src="`https://avatars.cloudflare.steamstatic.com/${result.avatar_hash}_medium.jpg`"
              class="w-8 h-auto rounded-sm"
            />
            <p class="px-2 truncate text-ellipsis">{{ result.name }}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          @click="firstPage"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
        >
          TOP50
        </div>
        <div
          @click="prevPage"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
        >
          Prev
        </div>
        <div
          @click="nextPage"
          class="cursor-pointer hover:bg-gray-200 px-2 py-1"
        >
          Next
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="mt-4 w-full border border-gray-300 text-center">
        <thead class="sticky top-0">
          <tr>
            <th rowspan="2" class="bg-gray-200">Rank</th>

            <th rowspan="2" class="bg-gray-300">Player</th>

            <th rowspan="2" class="bg-gray-200">Rating</th>

            <th rowspan="2" class="bg-gray-300">Top%</th>

            <th rowspan="2" class="bg-gray-200">Level</th>

            <th rowspan="2" class="bg-gray-300">Points</th>

            <th rowspan="2" class="bg-gray-200 whitespace-nowrap">
              Maps Finished
            </th>

            <th colspan="2" class="text-center bg-gray-300">WRs</th>

            <th colspan="2" class="bg-gray-200">Records</th>

            <th colspan="3" class="bg-gray-300 whitespace-nowrap">
              Hard Maps Finished
            </th>

            <th colspan="3" class="bg-gray-200">Avg Points</th>

            <th rowspan="2" class="bg-gray-300 whitespace-nowrap">
              Most Played Server
            </th>

            <th rowspan="2" class="bg-gray-200 whitespace-nowrap">
              Updated On
            </th>
          </tr>
          <tr>
            <th class="bg-gray-300">PRO</th>
            <th class="bg-gray-300">TP</th>

            <th class="bg-gray-200">900+</th>
            <th class="bg-gray-200">800+</th>

            <th class="bg-gray-300">T5</th>
            <th class="bg-gray-300">T6</th>
            <th class="bg-gray-300">T7</th>

            <th class="bg-gray-200">TP+PRO</th>
            <th class="bg-gray-200">PRO</th>
            <th class="bg-gray-200">TP</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="22" class="py-2"><Loading class="inline" /></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            v-for="player in players"
            :key="player.steamid"
            :class="player.steamid === me?.steamid ? 'bg-gray-300 me' : ''"
            class="border-y hover:bg-gray-200"
          >
            <td>{{ player.rank }}</td>

            <td class="py-1 cursor-pointer">
              <div
                class="flex items-center gap-2"
                @click="goToSteam(player.steamid64)"
              >
                <img
                  :src="`https://avatars.cloudflare.steamstatic.com/${player.avatar_hash}_medium.jpg`"
                  class="w-10 h-auto rounded-sm"
                />
                <p class="max-w-32 truncate text-ellipsis">
                  {{ player.name }}
                </p>
              </div>
            </td>

            <td>{{ player.pts_skill }}</td>

            <td>{{ player.percentage }}</td>

            <td>
              <img
                :src="`/ranks/${player.rank_name.toLowerCase()}.png`"
                class="w-20 h-auto inline"
              />
            </td>

            <td>{{ player.total_points.toLocaleString() }}</td>

            <td>{{ player.count }}</td>

            <td>{{ player.count_p1000_pro }}</td>
            <td>{{ player.count_p1000_tp }}</td>

            <td>{{ player.count_p900 }}</td>
            <td>{{ player.count_p800 }}</td>

            <td>{{ player.count_t5 }}</td>
            <td>{{ player.count_t6 }}</td>
            <td>{{ player.count_t7 }}</td>

            <td>{{ player.pts_avg }}</td>
            <td>{{ player.pts_avg_pro }}</td>
            <td>{{ player.pts_avg_tp }}</td>

            <td class="max-w-32 truncate text-ellipsis whitespace-nowrap">
              {{ player.most_played_server }}
            </td>

            <td class="max-w-32 truncate text-ellipsis whitespace-nowrap">
              {{ toLocal(player.updated_on) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-center gap-3">
      <div
        @click="firstPage"
        class="cursor-pointer hover:bg-gray-200 px-2 py-1"
      >
        TOP50
      </div>
      <div @click="prevPage" class="cursor-pointer hover:bg-gray-200 px-2 py-1">
        Prev
      </div>
      <div @click="nextPage" class="cursor-pointer hover:bg-gray-200 px-2 py-1">
        Next
      </div>
    </div>
  </div>
</template>

<style>
.app {
  font-family: "Chivo", sans-serif;
}
</style>

<script setup lang="ts">
import type { Player } from "~/types/player"
import type { Mode } from "~/types/common"

const props = defineProps<{
  players: Player[]
  me: Player | null
  mode: Mode
}>()

const emits = defineEmits(["openModal"])

const rowRefs = ref([])

onMounted(() => {
  if (props.me) {
    const meIndex = props.players.findIndex(
      (player) => player.steamid === props.me?.steamid
    )

    if (meIndex > 0) {
      const rowOfMe = rowRefs.value[meIndex] as HTMLElement
      rowOfMe.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }
})

function getModeAbbr(mode: Mode) {
  if (mode === "kz_timer") return "kzt"
  if (mode === "kz_simple") return "skz"
  if (mode === "kz_vanilla") return "vnl"
}
</script>

<template>
  <table class="w-full text-center">
    <thead class="sticky top-0 z-20">
      <tr>
        <th rowspan="2" class="bg-gray-200">Rank</th>

        <th rowspan="2" class="bg-gray-300">Player</th>

        <th rowspan="2" class="bg-gray-200">
          <div class="inline-flex items-center gap-1">
            <p>Rating</p>
            <IconQuestion class="cursor-pointer" @click="emits('openModal')" />
          </div>
        </th>

        <th rowspan="2" class="bg-gray-300">Top%</th>

        <th rowspan="2" class="bg-gray-200">Level</th>

        <th rowspan="2" class="bg-gray-300">Points</th>

        <th rowspan="2" class="bg-gray-200 whitespace-nowrap">Maps Finished</th>

        <th colspan="2" class="text-center bg-gray-300">WRs</th>

        <th colspan="2" class="bg-gray-200">Records</th>

        <th colspan="3" class="bg-gray-300 whitespace-nowrap">
          Hard Maps Finished
        </th>

        <th colspan="3" class="bg-gray-200">Avg Points</th>

        <th rowspan="2" class="bg-gray-300 whitespace-nowrap">
          Most Played Server
        </th>

        <th rowspan="2" class="bg-gray-200 whitespace-nowrap">Updated On</th>
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
    <tbody>
      <tr
        v-for="player in players"
        :key="player.steamid"
        ref="rowRefs"
        :class="player.steamid === me?.steamid ? 'bg-gray-300' : ''"
        class="border-b border-gray-400 hover:bg-gray-200"
      >
        <td>{{ player.rank }}</td>

        <td class="py-1">
          <div class="flex items-center gap-2">
            <VImage
              :src="`https://avatars.cloudflare.steamstatic.com/${player.avatar_hash}_medium.jpg`"
              placeholder="/placeholder.jpeg"
              :width="40"
              :height="40"
            />
            <div class="has-tooltip">
              <span class="whitespace-nowrap">
                {{ player.name }}
              </span>
              <div
                class="tooltip p-1 flex flex-col text-sm text-gray-700 bg-gray-300 border border-gray-400"
              >
                <NuxtLink
                  target="_blank"
                  :to="`https://steamcommunity.com/profiles/${player.steamid64}`"
                  class="hover:bg-gray-200 whitespace-nowrap"
                  >Steam Profile</NuxtLink
                >
                <NuxtLink
                  target="_blank"
                  :to="`https://kzgo.eu/players/${player.steamid}?${getModeAbbr(
                    mode
                  )}`"
                  class="hover:bg-gray-200"
                  >KZGO Profile</NuxtLink
                >
                <NuxtLink
                  target="_blank"
                  :to="`https://dash.gokz.top/player/${player.steamid}?gmt=p8:00`"
                  class="hover:bg-gray-200"
                  >KZ Statistics</NuxtLink
                >
              </div>
            </div>
          </div>
        </td>

        <td>{{ player.pts_skill.toFixed(2) }}</td>

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

        <td class="max-w-32 text-left truncate text-ellipsis whitespace-nowrap">
          {{ player.most_played_server }}
        </td>

        <td class="max-w-32 truncate text-ellipsis whitespace-nowrap">
          {{ toLocal(player.updated_on) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

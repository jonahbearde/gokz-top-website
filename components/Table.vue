<script setup lang="ts">
import type { Player } from "~/types/player"

const props = defineProps<{
  players: Player[]
  me: Player | null
}>()

const rowRefs = ref([])

onMounted(() => {
  if (props.me) {
    const meIndex = props.players.findIndex(
      (player) => player.steamid === props.me?.steamid
    )

    const rowOfMe = rowRefs.value[meIndex] as HTMLElement

    rowOfMe.scrollIntoView({ behavior: "smooth", block: "center" })
  }
})

function goToSteam(steamid: string) {
  navigateTo(`https://steamcommunity.com/profiles/${steamid}`, {
    external: true,
  })
}
</script>

<template>
  <table class="w-full text-center">
    <thead class="sticky top-0">
      <tr class="">
        <th rowspan="2" class="bg-gray-200">Rank</th>

        <th rowspan="2" class="bg-gray-300 w-60">Player</th>

        <th rowspan="2" class="bg-gray-200">Rating</th>

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

        <td class="py-1 cursor-pointer">
          <div
            class="flex items-center gap-2"
            @click="goToSteam(player.steamid64)"
          >
            <img
              :src="`https://avatars.cloudflare.steamstatic.com/${player.avatar_hash}_medium.jpg`"
              class="w-10 h-auto rounded-sm"
            />
            <span class="truncate text-ellipsis">
              {{ player.name }}
            </span>
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

<template>
  <pre class="bg-gray-200 w-max p-2">
    <b>Rating</b> = 
      (wrs_tp / maps_total) ^ (1 / 3.5) * <b>1.1</b> +
      (wrs_pro / maps_total) ^ (1 / 2.4) * <b>6</b> +
      (record_p900 / maps_total) ^(1 / 2) * <b>0.14</b> +
      (record_p800 / maps_total) ^(1 / 2) * <b>0.04</b> +
      points_avg / 1000 * <b>0.07</b> +
      points_avg_t3 / 1000 * <b>0.01</b> +
      points_avg_t4 / 1000 * <b>0.02</b> +
      points_avg_t5 / 1000 * <b>0.1</b> +
      points_avg_t6 / 1000 * <b>0.12</b> +
      points_avg_t7 / 1000 * <b>0.17</b> +
      maps_finished / maps_total * <b>0.01</b> +
      (maps_finished_t5 / maps_total_t5) ^ (1 / 1.5) * <b>0.05</b> +
      (maps_finished_t6 / maps_total_t6) ^ (1 / 1.5) * <b>0.15</b> +
      (maps_finished_t7 / maps_total_t7) ^ (1 / 1.5) * <b>0.24</b> +
      points_total / 1000 / maps_total * <b>0.01</b> +
      maps_finished_t567_p900 / maps_total_t567 * <b>0.06</b> +
      maps_finished_t567_p800 / maps_total_t567 * <b>0.03</b> +
      maps_finished_t567_pro / maps_total_t567 * <b>0.06</b>
  </pre>
</template>

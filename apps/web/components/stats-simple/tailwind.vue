<script setup lang="ts">
import ResponsiveColumn from '../_components/responsive-column.vue';
import ResponsiveRow from '../_components/responsive-row.vue';
</script>

<template>
  <ResponsiveRow>
    <ResponsiveColumn>
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        42
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        The Answer
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        10M
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        Days for Earth Mark II
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        2^276,709:1
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        Improbability Drive odds
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>
</template>

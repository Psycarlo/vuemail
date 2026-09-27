<script setup lang="ts">
import { Section } from 'vuemail';

const responsiveRow = { textAlign: 'center', fontSize: '0' } as const;

const responsiveColumn = {
  maxWidth: '200px',
  display: 'inline-block',
  verticalAlign: 'top',
  fontSize: '16px',
  boxSizing: 'border-box',
} as const;
</script>

<template>
  <Section :style="responsiveRow">
    <Section :style="responsiveColumn">
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        42
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        The Answer
      </p>
    </Section>
    <Section :style="responsiveColumn">
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        10M
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        Days for Earth Mark II
      </p>
    </Section>
    <Section :style="responsiveColumn">
      <p
        class="m-0 text-left text-[18px] leading-[24px] font-bold tracking-tight text-gray-900 tabular-nums"
      >
        2^276,709:1
      </p>
      <p class="m-0 text-left text-[12px] leading-[18px] text-gray-500">
        Improbability Drive odds
      </p>
    </Section>
  </Section>
</template>

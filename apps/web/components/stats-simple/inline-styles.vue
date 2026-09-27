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
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }"
      >
        42
      </p>
      <p
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }"
      >
        The Answer
      </p>
    </Section>
    <Section :style="responsiveColumn">
      <p
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }"
      >
        10M
      </p>
      <p
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }"
      >
        Days for Earth Mark II
      </p>
    </Section>
    <Section :style="responsiveColumn">
      <p
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }"
      >
        2^276,709:1
      </p>
      <p
        :style="{
          margin: '0',
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }"
      >
        Improbability Drive odds
      </p>
    </Section>
  </Section>
</template>

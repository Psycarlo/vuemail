<script setup lang="ts">
// Used by product-update.vue. Upstream it's defined in that same file,
// but in Vue each component needs a file of its own.
import { Column, Row, Section, Text } from 'vuemail';

const { n, title, body, last } = defineProps<{
  n: string;
  title: string;
  body: string;
  last?: boolean;
}>();
</script>

<template>
  <Row :class="last ? undefined : 'mb-9'">
    <Column class="pr-3 w-10 align-top">
      <Section
        class="border-stroke-strong py-1 border border-solid rounded-[10px] w-7 text-center"
      >
        <Text class="m-0 font-sans font-normal text-fg text-sm leading-5">
          {{ n }}
        </Text>
      </Section>
    </Column>
    <Column class="pr-8 align-top">
      <Text
        class="mt-0 mb-1 font-sans font-semibold text-fg text-base text-left"
      >
        {{ title }}
      </Text>
      <Text class="m-0 font-16 font-sans text-fg-2 text-left">
        {{ body }}
      </Text>
    </Column>
  </Row>
</template>

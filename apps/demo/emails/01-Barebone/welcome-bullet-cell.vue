<script setup lang="ts">
// Used by welcome.vue. Upstream it's defined in that same file,
// but in Vue each component needs a file of its own.
import { Column, Text } from 'vuemail';

const { isLast } = defineProps<{ isLast?: boolean }>();
</script>

<template>
  <Column
    :class="`mobile:!block mobile:!w-full mobile:!max-w-full w-1/2 pr-8 align-top mobile:pr-0${isLast ? '' : ' mobile:mb-8'}`"
  >
    <Text class="mt-0 mb-5">
      <span
        class="inline-block border-stroke-strong border border-solid rounded-full size-6 align-middle"
      />
    </Text>
    <Text class="m-0 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
      Bring your team, tools, and workflows together in one place—with
      permissions that match how you work.
    </Text>
  </Column>
</template>

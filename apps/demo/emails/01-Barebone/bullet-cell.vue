<script setup lang="ts">
// Used by product-update.vue. Upstream it's defined in that same file,
// but in Vue each component needs a file of its own.
import { Column, Text } from '@vuemaildev/vuemail';

const { isLast } = defineProps<{ isLast?: boolean }>();
</script>

<template>
  <Column
    :class="`mobile:!block mobile:!w-full mobile:!max-w-full w-1/2 pr-8 align-top mobile:pr-0${isLast ? '' : ' mobile:mb-8'}`"
  >
    <Text class="mt-0 mb-5">
      <span
        class="inline-block border-stroke-strong border border-solid rounded-lg size-6 text-[1px] align-middle leading-6"
      >&nbsp;</span>
    </Text>
    <Text class="m-0 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
      These updates roll out gradually. Check your workspace to see what&apos;s
      available to you today.
    </Text>
  </Column>
</template>

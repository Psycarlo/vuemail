<script setup lang="ts">
import { computed } from 'vue';
import type { ErrorObject } from '../../../shared/types';

const props = defineProps<{
  error: ErrorObject;
}>();

const messageMatch = computed(() =>
  props.error.message.match(
    /(Unexpected closing tag "[^"]+". It may happen when the tag has already been closed by another tag). (For more info see) (.+)/,
  ),
);
</script>

<template>
  <div class="absolute inset-0 z-50 bg-black/80" />
  <div
    class="min-h-[50vh] w-full max-w-lg sm:rounded-lg md:max-w-[568px] lg:max-w-[920px] absolute left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-t-sm overflow-hidden bg-white text-black shadow-lg duration-200 flex flex-col selection:text-black!"
  >
    <div class="bg-red-500 h-3" />
    <div class="flex grow p-6 min-w-0 max-w-full flex-col space-y-1.5">
      <div class="shrink pb-2 text-xl tracking-tight">
        <b>{{ error.name }}</b>:
        <template v-if="messageMatch"
          >{{ messageMatch[1] }}.
          <p class="text-lg">
            {{ messageMatch[2] }}
            <a
              class="underline"
              :href="messageMatch[3]"
              rel="noreferrer"
              target="_blank"
              >{{ messageMatch[3] }}</a
            >
          </p>
        </template>
        <template v-else>{{ error.message }}</template>
      </div>
      <div
        v-if="error.stack"
        class="grow scroll-px-4 overflow-x-auto rounded-lg bg-black p-2 text-gray-100"
      >
        <pre
          class="w-full min-w-0 font-mono leading-6 selection:text-green-12! text-xs"
          >{{ error.stack }}</pre
        >
      </div>
    </div>
  </div>
</template>

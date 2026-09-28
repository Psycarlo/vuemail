<script setup lang="ts">
// A single line of code, like a command, with a button to copy it
import { computed } from 'vue';
import { codeTheme, highlight, styleForToken } from '~/utils/highlight';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
  }>(),
  { language: 'html' },
);

const value = computed(() => props.code.trim());
const lines = computed(() => highlight(value.value, props.language));

const gradientLine =
  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)';
</script>

<template>
  <pre
    class="relative inline-flex h-11 w-full items-center overflow-auto whitespace-pre rounded-xl border border-slate-6 pr-11 pl-4 font-mono text-sm backdrop-blur-md"
    :style="{
      lineHeight: '130%',
      background:
        'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
      boxShadow: 'rgb(0 0 0 / 10%) 0rem .3125rem 1.875rem -0.3125rem',
    }"
  ><CopyCode
      :code="value"
      class="absolute right-1 shadow-none hover:text-white [&_svg]:hover:text-white enabled:hover:bg-transparent! focus:ring-0"
    /><div
      class="absolute top-0 right-0 h-px w-50"
      :style="{ background: gradientLine }"
    /><div
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      :style="codeTheme.plain"
      :class="[
        'whitespace-pre',
        language === 'bash' &&
          lines.length === 1 &&
          `before:mr-2 before:text-slate-11 before:content-['$']`,
      ]"
    ><span
        v-for="(token, tokenIndex) in line"
        :key="tokenIndex"
        :style="styleForToken(token)"
      >{{ token.content }}</span></div><div
      class="absolute bottom-0 left-0 h-px w-50"
      :style="{ background: gradientLine }"
    /></pre>
</template>

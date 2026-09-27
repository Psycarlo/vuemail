<script setup lang="ts">
import { computed } from 'vue';
import { codeTheme, highlight, styleForToken } from '~/utils/highlight';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    codeClass?: string;
    isGradientLine?: boolean;
  }>(),
  { language: 'html', isGradientLine: true },
);

const lines = computed(() => highlight(props.code.trim(), props.language));

const gradientLine =
  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)';
</script>

<template>
  <div
    v-if="isGradientLine"
    class="absolute top-0 right-0 h-px w-50"
    :style="{ background: gradientLine }"
  />
  <pre class="p-4 font-mono" :style="codeTheme.plain"><div
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      :class="[
        'whitespace-pre',
        codeClass,
        language === 'bash' &&
          lines.length === 1 &&
          `before:mr-2 before:text-slate-11 before:content-['$']`,
      ]"
    ><span
        v-for="(token, tokenIndex) in line"
        :key="tokenIndex"
        :style="styleForToken(token)"
      >{{ token.content }}</span>{{ line.length === 0 ? '\n' : '' }}</div></pre>
  <div
    v-if="isGradientLine"
    class="absolute bottom-0 left-0 h-px w-50"
    :style="{ background: gradientLine }"
  />
</template>

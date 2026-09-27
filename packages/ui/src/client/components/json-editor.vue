<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';
import {
  getTokenClass,
  getTokenStyle,
  highlight,
  lineStyle,
} from '../utils/highlight';

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  change: [value: string];
}>();

defineOptions({ inheritAttrs: false });

// Text metrics must match between the highlighted <pre> and the transparent
// <textarea> on top of it, or the caret drifts from the characters.
const sharedTextClasses =
  'whitespace-pre-wrap break-words p-2 text-[13px] leading-5 font-[MonoLisa,Menlo,monospace]';

const tokens = computed(() => highlight(props.value, 'json'));
</script>

<!--
  Syntax-highlighted JSON editing surface: a highlighted render with an
  invisible textarea overlaid, so it looks like the source view but types
  like a plain input.
-->
<template>
  <div
    :class="
      cn(
        'relative min-h-40 rounded-md border border-slate-6 transition-colors',
        'focus-within:border-slate-8',
        disabled && 'opacity-60',
        $attrs.class as string,
      )
    "
  >
    <pre aria-hidden="true" :class="sharedTextClasses"><div
        v-for="(line, lineIndex) in tokens"
        :key="lineIndex"
        class="token-line"
        :style="lineStyle"
      ><span
          v-for="(token, tokenIndex) in line"
          :key="tokenIndex"
          :class="getTokenClass(token)"
          :style="getTokenStyle(token)"
        >{{ token.content }}</span><template
          v-if="line.length === 1 && line[0]?.empty"
        >&#8203;</template></div></pre>
    <textarea
      :aria-invalid="$attrs['aria-invalid'] as boolean | undefined"
      :aria-label="$attrs['aria-label'] as string"
      :class="
        cn(
          sharedTextClasses,
          'absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-slate-12 outline-none',
        )
      "
      :disabled="disabled"
      spellcheck="false"
      :value="value"
      @input="emit('change', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

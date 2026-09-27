<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFragmentIdentifier } from '../composables/use-fragment-identifier';
import { cn } from '../utils/cn';
import {
  getTokenClass,
  getTokenStyle,
  highlight,
  lineStyle,
} from '../utils/highlight';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    /** The Prism grammar to highlight with, if not the one of `language`. */
    grammar?: string;
  }>(),
  { language: 'html', grammar: undefined },
);

// Sources of Vue emails are highlighted as markup, which highlights their
// `<script>` and `<style>` blocks too
const grammarForLanguage: Record<string, string> = {
  vue: 'markup',
  html: 'markup',
};

const lineHashRegex = /#L(?<start>\d+)(?:,(?<end>\d+))?/;

const route = useRoute();
const router = useRouter();
const locationHash = useFragmentIdentifier();

// Lines link to themselves, keeping the rest of the current location
const locationHref = computed(
  () => router.resolve({ path: route.path, query: route.query }).href,
);

const navigateToLine = (event: MouseEvent, line: number) => {
  // Leaves opening the link in a new tab or window to the browser
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
  if (event.button !== 0) return;

  event.preventDefault();
  void router.push({ path: route.path, query: route.query, hash: `#L${line}` });
};

const highlightedLines = computed(() => {
  if (locationHash.value) {
    const match = locationHash.value.match(lineHashRegex);
    if (match?.groups?.start) {
      const start = Number.parseInt(match.groups.start, 10);
      const end = match.groups.end
        ? Number.parseInt(match.groups.end, 10)
        : start;
      return [start, end] as const;
    }
  }
  return undefined;
});

const isHighlighting = (line: number) => {
  const range = highlightedLines.value;
  if (!range) return false;

  return range[0] <= line && range[1] >= line;
};

const scroller = ref<HTMLDivElement>();

const scrollToHighlightedLines = () => {
  const range = highlightedLines.value;
  if (range && scroller.value) {
    const lineElement = scroller.value.querySelector(`#L${range[0]}`);
    if (lineElement instanceof HTMLAnchorElement) {
      scroller.value.scrollTo({
        top: Math.max(lineElement.offsetTop - 325, 0),
        behavior: 'smooth',
      });
    }
  }
};

onMounted(scrollToHighlightedLines);
watch(
  () => [highlightedLines.value?.[0], highlightedLines.value?.[1], props.code],
  scrollToHighlightedLines,
  { flush: 'post' },
);

const value = computed(() => props.code.trim());

const tokens = computed(() => {
  const lines = highlight(
    value.value,
    props.grammar ?? grammarForLanguage[props.language] ?? props.language,
  );
  for (const line of lines) {
    for (const [key, token] of line.entries()) {
      const isException =
        token.content === 'from' && line[key + 1]?.content === ':';
      if (isException) {
        token.types = [...token.types, 'key-white'];
      }
    }
  }
  return lines;
});

const gradientBorder =
  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)';
</script>

<template>
  <div
    class="absolute right-0 top-0 h-px w-[200px]"
    :style="{ background: gradientBorder }"
  />
  <div
    ref="scroller"
    class="max-h-[650px] h-full p-4 after:w-full after:static after:block after:h-4 after:content-[''] overflow-auto"
  >
    <div class="grid grid-cols-[auto_1fr] w-full">
      <template v-for="(line, i) in tokens" :key="i">
        <!-- Line number cell -->
        <a
          :id="`L${i + 1}`"
          :aria-selected="isHighlighting(i + 1)"
          :class="
            cn(
              'text-[#49494f] relative text-[13px] font-light font-[MonoLisa,Menlo,monospace] align-middle scroll-mt-[325px] select-none pr-3 cursor-pointer hover:text-slate-12 transition-colors',
              'aria-selected:text-green-11 aria-selected:hover:text-green-11 aria-selected:bg-green-5 aria-selected:[&+*]:bg-green-5',
              highlightedLines && highlightedLines[0] === i + 1 && 'rounded-tl-sm',
              highlightedLines && highlightedLines[1] === i + 1 && 'rounded-bl-sm',
            )
          "
          :href="`${locationHref}#L${i + 1}`"
          type="button"
          @click="navigateToLine($event, i + 1)"
          >{{ i + 1 }}</a
        >

        <!-- Code content cell -->
        <div
          :class="
            cn('whitespace-pre transition-colors', {
              [`before:mr-2 before:text-slate-11 before:content-['$']`]:
                language === 'bash' && tokens.length === 1,
            })
          "
          :style="lineStyle"
        >
          <span
            v-for="(token, key) in line"
            :key="key"
            :class="getTokenClass(token)"
            :style="getTokenStyle(token)"
            >{{ token.content }}</span
          >
        </div>
      </template>
    </div>
  </div>
  <div
    class="absolute bottom-0 left-0 h-px w-[200px]"
    :style="{ background: gradientBorder }"
  />
</template>

<script setup lang="ts">
import { LayoutGroup, motion } from 'motion-v';
import { TooltipTrigger } from 'reka-ui';
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import IconButton from '../icons/icon-button.vue';
import IconCheck from '../icons/icon-check.vue';
import IconClipboard from '../icons/icon-clipboard.vue';
import IconDownload from '../icons/icon-download.vue';
import { tabTransition } from '../utils/constants';
import { copyTextToClipboard } from '../utils/copy-text-to-clipboard';
import languageMap from '../utils/language-map';
import Code from './code.vue';
import Tooltip from './tooltip.vue';
import TooltipContent from './tooltip-content.vue';

export interface MarkupProps {
  language: string;
  extension?: string;
  content: string;
  /** The Prism grammar to highlight with, if not the one of `language`. */
  grammar?: string;
}

const props = defineProps<{
  markups: MarkupProps[];
  basename: string;
  activeLang: string;
}>();

const emit = defineEmits<{
  'update:activeLang': [lang: string];
}>();

const activeMarkup = computed(() => {
  const markup = props.markups.find(
    ({ language }) => props.activeLang === language,
  );
  if (!markup) {
    throw new Error('No markup found for the active language!', {
      cause: {
        activeLang: props.activeLang,
        markups: props.markups,
      },
    });
  }
  return markup;
});

const codeId = useId();

// Copy to clipboard
const isCopied = ref(false);
let unsetIsCopiedTimeout: ReturnType<typeof setTimeout> | undefined;
watch(
  () => activeMarkup.value.content,
  () => {
    isCopied.value = false;
    clearTimeout(unsetIsCopiedTimeout);
    unsetIsCopiedTimeout = undefined;
  },
);
const copy = async () => {
  isCopied.value = true;
  await copyTextToClipboard(activeMarkup.value.content);
  unsetIsCopiedTimeout = setTimeout(() => {
    isCopied.value = false;
  }, 3000);
};

// Download
const filename = computed(
  () =>
    `${props.basename}.${activeMarkup.value.extension || activeMarkup.value.language}`,
);
const downloadUrl = computed(() => {
  const file = new File([activeMarkup.value.content], filename.value);
  return URL.createObjectURL(file);
});
watch(downloadUrl, (_url, previousUrl) => {
  URL.revokeObjectURL(previousUrl);
});

onBeforeUnmount(() => {
  clearTimeout(unsetIsCopiedTimeout);
  URL.revokeObjectURL(downloadUrl.value);
});
</script>

<template>
  <div
    class="relative max-h-[650px] w-full h-full whitespace-pre rounded-md border border-slate-6 text-sm"
    :style="{
      lineHeight: '130%',
      background:
        'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
      boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
    }"
  >
    <div class="h-9 border-b border-slate-6">
      <div class="flex">
        <LayoutGroup :id="codeId">
          <motion.button
            v-for="{ language } in markups"
            :key="language"
            :class="`relative px-4 py-[8px] font-sans text-sm font-medium transition duration-200 ease-in-out hover:text-slate-12 ${
              activeLang !== language ? 'text-slate-11' : 'text-slate-12'
            }`"
            @click="emit('update:activeLang', language)"
          >
            <motion.span
              v-if="activeLang === language"
              :animate="{ opacity: 1 }"
              class="absolute bottom-0 left-0 right-0 top-0 bg-slate-4"
              :exit="{ opacity: 0 }"
              :initial="{ opacity: 0 }"
              layout-id="code"
              :transition="tabTransition"
            />{{ languageMap[language] }}
          </motion.button>
        </LayoutGroup>
      </div>
      <Tooltip>
        <TooltipTrigger as-child class="absolute right-2 top-2 hidden md:block">
          <IconButton @click="copy">
            <IconCheck v-if="isCopied" />
            <IconClipboard v-else />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Copy to Clipboard</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          as-child
          class="text-gray-11 absolute right-8 top-2 hidden md:block"
        >
          <a
            class="text-slate-11 transition duration-200 ease-in-out hover:text-slate-12"
            :download="filename"
            :href="downloadUrl"
          >
            <IconDownload />
          </a>
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>
    </div>
    <div class="h-[calc(100%-2.25rem)]">
      <Code
        :code="activeMarkup.content"
        :grammar="activeMarkup.grammar"
        :language="activeLang"
      />
    </div>
  </div>
</template>

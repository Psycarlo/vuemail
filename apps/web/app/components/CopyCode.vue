<script setup lang="ts">
import { CheckIcon, ClipboardIcon } from 'lucide-vue-next';
import { AnimatePresence, Motion } from 'motion-v';
import { ref } from 'vue';

const props = defineProps<{ code: string }>();

const isCopied = ref(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(props.code);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 1500);
};

const iconTransition = { type: 'spring', bounce: 0, duration: 0.3 } as const;
</script>

<template>
  <button
    :class="[
      // React Email's IconButton
      'rounded-sm p-1 text-[#EEF7FE] transition duration-200 ease-in-out hover:text-white focus:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-6',
      'p-2.5 flex items-center justify-center rounded-xl duration-200 cursor-pointer',
      'shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)] enabled:hover:bg-zinc-900/80',
    ]"
    :disabled="isCopied"
    type="button"
    @click="handleCopy"
  >
    <AnimatePresence mode="popLayout" :initial="false">
      <Motion
        v-if="isCopied"
        key="copied"
        as="span"
        class="ml-px"
        :initial="{ scale: 0 }"
        :animate="{ scale: 1, filter: 'blur(0)' }"
        :exit="{ scale: 0, filter: 'blur(2px)' }"
        :transition="iconTransition"
      >
        <CheckIcon class="size-4 text-slate-12" />
      </Motion>
      <Motion
        v-else
        key="copy"
        as="span"
        class="ml-px"
        :initial="{ scale: 0 }"
        :animate="{ scale: 1, filter: 'blur(0)' }"
        :exit="{ scale: 0, filter: 'blur(2px)' }"
        :transition="iconTransition"
      >
        <ClipboardIcon class="size-4 text-slate-11 transition-colors" />
      </Motion>
    </AnimatePresence>
    <span aria-live="polite" class="sr-only">
      {{ isCopied ? 'Copied' : 'Copy to clipboard' }}
    </span>
  </button>
</template>

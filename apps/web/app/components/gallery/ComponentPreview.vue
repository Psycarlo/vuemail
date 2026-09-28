<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { vSrcdoc } from '~/utils/srcdoc';

defineProps<{
  activeView: string;
  html: string;
}>();

const iframeRef = ref<HTMLIFrameElement>();

// Fits the iframe to the height of the component
const handleResize = () => {
  const iframe = iframeRef.value;
  const iframeDocument = iframe?.contentDocument;
  // Not the blank document the iframe starts with, before the component
  // loads: it would add the extra 20px twice, the layout of the components
  // filling the iframe
  if (!iframe || !iframeDocument?.body || iframeDocument.URL === 'about:blank')
    return;

  const body = iframeDocument.body;
  const htmlFrame = iframeDocument.documentElement;
  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    htmlFrame.clientHeight,
    htmlFrame.scrollHeight,
    htmlFrame.offsetHeight,
  );
  iframe.style.height = `${height + 20}px`;
};

onMounted(() => {
  iframeRef.value?.addEventListener('load', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  iframeRef.value?.removeEventListener('load', handleResize);
});
</script>

<template>
  <iframe
    ref="iframeRef"
    v-srcdoc="html"
    :class="[
      'relative z-2 m-auto flex h-fit overflow-y-hidden rounded-md bg-zinc-200 transition-none duration-300 ease-[cubic-bezier(.36,.66,.6,1)] transition-discrete',
      activeView === 'mobile' ? 'w-90' : 'w-full',
    ]"
    title="Component preview"
  />
</template>

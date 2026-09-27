<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  applyColorInversion,
  undoColorInversion,
} from '../../utils/color-inversion';

const props = defineProps<{
  markup: string;
  width: number;
  height: number;
  darkMode: boolean;
}>();

const iframe = ref<HTMLIFrameElement>();

const syncColorInversion = (element: HTMLIFrameElement) => {
  if (props.darkMode) {
    applyColorInversion(element);
  } else {
    undoColorInversion(element);
  }
};

onMounted(() => {
  if (iframe.value) syncColorInversion(iframe.value);
});
watch(
  () => props.darkMode,
  () => {
    if (iframe.value) syncColorInversion(iframe.value);
  },
);
</script>

<!--
  `srcdoc` content inherits the parent's origin, so a `<script>` in a
  template (especially raw `.html` files read from disk) would execute
  with same-origin access to the preview app. Sandboxing disables
  scripts, forms, popups, and top-level navigation while keeping
  `allow-same-origin` so the parent can still inspect/modify the
  iframe document for color inversion and event bubbling.
-->
<template>
  <iframe
    ref="iframe"
    :height="height"
    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    :srcdoc="markup"
    :width="width"
    @load="syncColorInversion($event.currentTarget as HTMLIFrameElement)"
  />
</template>

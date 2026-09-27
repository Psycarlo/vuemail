<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { EmailRenderingResult } from '../../shared/types';
import { ApiError, renderEmail } from '../api';
import { providePropsPanel } from '../composables/use-props-panel';
import { toErrorObject } from '../utils/to-error-object';
import PreviewContent from './preview/preview-content.vue';

const props = defineProps<{
  // will come in here as a relative path to the email
  // ex: authentication/verify-password
  slug: string;
}>();

const router = useRouter();

// This page stays mounted while navigating between emails, so the props
// panel keeps its state across them
providePropsPanel();

// The first render of the email, which the preview then re-renders as its
// props or files change. The previous email stays up until it's ready.
const initialRendering = shallowRef<{
  slug: string;
  result: EmailRenderingResult;
}>();

let latestRequest = 0;

watch(
  () => props.slug,
  async (slug) => {
    document.title = `${slug.split('/').pop()} — Vuemail`;

    const request = ++latestRequest;
    let result: EmailRenderingResult;
    try {
      result = await renderEmail(slug);
    } catch (exception) {
      if (request !== latestRequest) return;

      if (exception instanceof ApiError && exception.status === 404) {
        await router.replace('/');
        return;
      }
      result = { error: toErrorObject(exception) };
    }
    if (request !== latestRequest) return;

    initialRendering.value = { slug, result };
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  // Leaving the page drops the renders still on their way
  latestRequest++;
});
</script>

<template>
  <PreviewContent
    v-if="initialRendering"
    :key="initialRendering.slug"
    :email-slug="initialRendering.slug"
    :server-rendering-result="initialRendering.result"
  />
</template>

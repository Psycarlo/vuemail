<script setup lang="ts">
import { computed } from 'vue';
import type { EmailRenderingResult } from '../../../shared/types';
import EmailToolbar from '../../components/toolbar/email-toolbar.vue';
import { providePreview } from '../../composables/use-preview';
import EmailPreview from './email-preview.vue';

const props = defineProps<{
  emailSlug: string;
  serverRenderingResult: EmailRenderingResult;
}>();

const { renderedEmailMetadata } = providePreview({
  emailSlug: props.emailSlug,
  serverRenderingResult: props.serverRenderingResult,
});

// The file name of the email, as in `welcome.vue`. Failed renders don't
// tell the extension of the email, so it's left out until one succeeds.
const emailTitle = computed(() => {
  const metadata = renderedEmailMetadata.value;
  if (metadata) return `${metadata.basename}.${metadata.extname}`;
  return props.emailSlug.split('/').pop() ?? props.emailSlug;
});
</script>

<template>
  <EmailPreview :email-title="emailTitle" />

  <EmailToolbar
    v-if="renderedEmailMetadata"
    :rendering="renderedEmailMetadata"
    :slug="emailSlug"
  />
</template>

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

const { renderedEmailMetadata, renderingResult } = providePreview({
  emailSlug: props.emailSlug,
  serverRenderingResult: props.serverRenderingResult,
});

// The file name of the email, as in `welcome.vue`, which failed renders
// tell as well
const emailTitle = computed(() => {
  const { basename, extname } =
    renderedEmailMetadata.value ?? renderingResult.value;
  if (basename !== undefined && extname !== undefined) {
    return `${basename}.${extname}`;
  }
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

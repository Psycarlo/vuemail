<script setup lang="ts">
import { CollapsibleRoot } from 'reka-ui';
import type { EmailsDirectory } from '../../../shared/types';
import FileTreeDirectoryChildren from './file-tree-directory-children.vue';

defineProps<{
  currentEmailOpenSlug: string | undefined;
  emailsDirectoryMetadata: EmailsDirectory;
}>();
</script>

<template>
  <div class="flex w-full h-full flex-col lg:w-full lg:min-w-58">
    <nav class="flex grow flex-col p-4 pr-0 pl-0">
      <CollapsibleRoot :open="true">
        <FileTreeDirectoryChildren
          :current-email-open-slug="currentEmailOpenSlug"
          :emails-directory-metadata="emailsDirectoryMetadata"
          is-root
          :open="true"
        />
      </CollapsibleRoot>
    </nav>
  </div>
</template>

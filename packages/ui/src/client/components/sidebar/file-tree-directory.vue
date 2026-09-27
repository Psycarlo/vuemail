<script lang="ts">
// Directories stay open across navigations, which mount the sidebar's
// directories again when they come and go
const persistedOpenDirectories = new Set<string>();
</script>

<script setup lang="ts">
import { CollapsibleRoot, CollapsibleTrigger } from 'reka-ui';
import { computed, ref, useAttrs, watch } from 'vue';
import type { EmailsDirectory } from '../../../shared/types';
import IconArrowDown from '../../icons/icon-arrow-down.vue';
import IconFolder from '../../icons/icon-folder.vue';
import IconFolderOpen from '../../icons/icon-folder-open.vue';
import { cn } from '../../utils/cn';
import Heading from '../heading.vue';
import FileTreeDirectoryChildren from './file-tree-directory-children.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  emailsDirectoryMetadata: EmailsDirectory;
  currentEmailOpenSlug?: string;
}>();

const attrs = useAttrs();

const doesDirectoryContainCurrentEmailOpen = computed(() =>
  props.currentEmailOpenSlug
    ? props.currentEmailOpenSlug.includes(
        props.emailsDirectoryMetadata.relativePath.replaceAll('\\', '/'),
      )
    : false,
);

const isEmpty = computed(
  () =>
    props.emailsDirectoryMetadata.emailFilenames.length === 0 &&
    props.emailsDirectoryMetadata.subDirectories.length === 0,
);

const open = ref(
  persistedOpenDirectories.has(props.emailsDirectoryMetadata.absolutePath) ||
    doesDirectoryContainCurrentEmailOpen.value,
);

watch(
  [
    doesDirectoryContainCurrentEmailOpen,
    () => props.emailsDirectoryMetadata.absolutePath,
  ],
  ([containsCurrentEmailOpen, absolutePath]) => {
    if (!containsCurrentEmailOpen) return;

    persistedOpenDirectories.add(absolutePath);
    open.value = true;
  },
  { immediate: true },
);

const onOpenChange = (isOpening: boolean) => {
  if (isOpening) {
    persistedOpenDirectories.add(props.emailsDirectoryMetadata.absolutePath);
  } else {
    persistedOpenDirectories.delete(props.emailsDirectoryMetadata.absolutePath);
  }

  open.value = isOpening;
};
</script>

<template>
  <CollapsibleRoot
    :class="cn('group', attrs.class as string)"
    :open="open"
    @update:open="onOpenChange"
  >
    <CollapsibleTrigger
      :class="
        cn(
          'flex h-8 w-full items-center text-start justify-between gap-2 font-medium text-[14px]',
          {
            'cursor-pointer': !isEmpty,
          },
        )
      "
    >
      <IconFolderOpen v-if="open" class="w-[20px]" height="20" width="20" />
      <IconFolder v-else height="20" width="20" />
      <Heading
        as="h3"
        class="transition grow w-[calc(100%-40px)] truncate duration-200 ease-in-out hover:text-slate-12"
        color="gray"
        size="2"
        weight="medium"
      >
        {{ emailsDirectoryMetadata.directoryName }}
      </Heading>
      <IconArrowDown
        v-if="!isEmpty"
        class="ml-auto opacity-60 transition-transform data-[open=true]:rotate-180"
        :data-open="open"
        height="20"
        width="20"
      />
    </CollapsibleTrigger>
    <FileTreeDirectoryChildren
      v-if="!isEmpty"
      :current-email-open-slug="currentEmailOpenSlug"
      :emails-directory-metadata="emailsDirectoryMetadata"
      :open="open"
    />
  </CollapsibleRoot>
</template>

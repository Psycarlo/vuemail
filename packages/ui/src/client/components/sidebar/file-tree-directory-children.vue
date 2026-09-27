<script setup lang="ts">
import { AnimatePresence, LayoutGroup, motion } from 'motion-v';
import { CollapsibleContent } from 'reka-ui';
import { computed, useId } from 'vue';
import { useRoute } from 'vue-router';
import type { EmailsDirectory } from '../../../shared/types';
import IconFile from '../../icons/icon-file.vue';
import { cn } from '../../utils/cn';
import { getPreviewPath } from '../../utils/get-preview-path';
import { getSearchParam } from '../../utils/search-params';
import FileTreeDirectory from './file-tree-directory.vue';

const props = defineProps<{
  emailsDirectoryMetadata: EmailsDirectory;
  currentEmailOpenSlug?: string;
  open: boolean;
  isRoot?: boolean;
}>();

const route = useRoute();

const id = useId();

const removeExtensionFrom = (path: string) => {
  const ext = path.split('.').pop();
  if (
    ext === 'vue' ||
    ext === 'tsx' ||
    ext === 'jsx' ||
    ext === 'ts' ||
    ext === 'js' ||
    ext === 'html'
  ) {
    return path.split('.').slice(0, -1).join('.');
  }

  return path;
};

const emails = computed(() => {
  // Relative paths come with backslashes from servers running on Windows
  const directoryPath = props.emailsDirectoryMetadata.relativePath.replaceAll(
    '\\',
    '/',
  );

  return props.emailsDirectoryMetadata.emailFilenames.map((emailFilename) => {
    const emailSlug = props.isRoot
      ? emailFilename
      : `${directoryPath}/${emailFilename}`;

    const isCurrentPage = props.currentEmailOpenSlug
      ? removeExtensionFrom(props.currentEmailOpenSlug) === emailSlug
      : false;

    // Raw .html templates don't expose a Compatibility tab, so
    // dropping the param prevents the toolbar from opening on
    // a hidden tab when navigating from a .vue email.
    const isHtmlTarget = emailFilename.endsWith('.html');
    const targetQuery = { ...route.query };
    if (
      isHtmlTarget &&
      getSearchParam(route.query, 'toolbar-panel') === 'compatibility'
    ) {
      targetQuery['toolbar-panel'] = 'linter';
    }

    return {
      emailFilename,
      emailSlug,
      isCurrentPage,
      to: { path: getPreviewPath(emailSlug), query: targetQuery },
    };
  });
});
</script>

<template>
  <AnimatePresence :initial="false">
    <CollapsibleContent
      v-if="open"
      key="content"
      as-child
      class="relative overflow-y-hidden pl-1"
      force-mount
    >
      <motion.div
        :animate="{ opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0, height: 0 }"
        :initial="{ opacity: 0, height: 0 }"
      >
        <div v-if="!isRoot" class="line absolute left-2.5 h-full w-px bg-slate-6" />
        <div class="flex flex-col truncate">
          <LayoutGroup :id="`sidebar-${id}`">
            <FileTreeDirectory
              v-for="subDirectory in emailsDirectoryMetadata.subDirectories"
              :key="subDirectory.absolutePath"
              :class="cn('data-[state=open]:mb-2', !isRoot && 'pl-3')"
              :current-email-open-slug="currentEmailOpenSlug"
              :emails-directory-metadata="subDirectory"
            />
            <RouterLink
              v-for="(email, index) in emails"
              :key="email.emailSlug"
              v-slot="{ href, navigate }"
              custom
              :to="email.to"
            >
              <a :href="href" @click="navigate">
                <motion.span
                  :animate="{ x: 0, opacity: 1 }"
                  :class="
                    cn(
                      'relative flex h-8 w-full items-center text-start gap-2 rounded-md align-middle text-slate-11 text-sm transition-colors duration-100 ease-[cubic-bezier(.6,.12,.34,.96)]',
                      isRoot ? undefined : 'pl-3',
                      {
                        'text-green-11': email.isCurrentPage,
                        'hover:text-slate-12':
                          currentEmailOpenSlug !== email.emailSlug,
                      },
                    )
                  "
                  :initial="{ x: -10 + -index * 1.5, opacity: 0 }"
                  :transition="{
                    x: { delay: 0.03 * index, duration: 0.2 },
                    opacity: { delay: 0.03 * index, duration: 0.2 },
                  }"
                >
                  <motion.span
                    v-if="email.isCurrentPage"
                    :animate="{ opacity: 1 }"
                    class="absolute inset-0 rounded-md bg-green-5 opacity-0 transition-all duration-200 ease-[cubic-bezier(.6,.12,.34,.96)]"
                    :exit="{ opacity: 0 }"
                    :initial="{ opacity: 0 }"
                  >
                    <motion.div
                      v-if="!isRoot"
                      class="absolute top-1 left-[0.4rem] inset-0 h-6 w-px rounded-xs bg-green-11"
                      layout-id="active-file"
                      :transition="{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }"
                    />
                  </motion.span>
                  <IconFile class="h-5 w-5" height="20" width="20" />
                  <span class="truncate w-[calc(100%-1.25rem)]">
                    {{ email.emailFilename }}
                  </span>
                </motion.span>
              </a>
            </RouterLink>
          </LayoutGroup>
        </div>
      </motion.div>
    </CollapsibleContent>
  </AnimatePresence>
</template>

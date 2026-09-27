<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useRoute } from 'vue-router';
import { useEmails } from '../../composables/use-emails';
import { cn } from '../../utils/cn';
import AppLogo from '../app-logo.vue';
import FileTree from './file-tree.vue';

defineOptions({ inheritAttrs: false });

const { emailsDirectory } = useEmails();
const route = useRoute();
const attrs = useAttrs();

const currentEmailOpenSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : undefined,
);
</script>

<template>
  <aside
    :class="
      cn(
        'overflow-hidden',
        'lg:static lg:z-auto lg:max-h-screen lg:w-[16rem]',
        attrs.class as string,
      )
    "
  >
    <div
      class="flex w-full h-full overflow-hidden flex-col border-slate-6 border-r"
    >
      <div
        class="hidden min-h-14 shrink items-center py-2 px-3 lg:flex border-b border-slate-4"
      >
        <h2>
          <AppLogo />
        </h2>
      </div>
      <div
        class="relative grow w-full h-full overflow-y-auto overflow-x-hidden px-4 pb-3"
      >
        <FileTree
          v-if="emailsDirectory"
          :current-email-open-slug="currentEmailOpenSlug"
          :emails-directory-metadata="emailsDirectory"
        />
      </div>
    </div>
  </aside>
</template>

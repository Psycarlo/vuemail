<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { provideShell } from '../composables/use-shell';
import { cn } from '../utils/cn';
import AppLogo from './app-logo.vue';
import EmailsSidebar from './sidebar/emails-sidebar.vue';

const sidebarToggled = ref(true);
const route = useRoute();

provideShell({
  sidebarToggled,
  toggleSidebar: () => {
    sidebarToggled.value = !sidebarToggled.value;
  },
});

// 64rem is the `lg` breakpoint the drawer styles below are keyed to.
watch(
  () => route.path,
  () => {
    if (window.matchMedia('(min-width: 64rem)').matches) return;

    sidebarToggled.value = true;
  },
);
</script>

<template>
  <div
    class="flex h-17.5 items-center justify-between border-slate-6 border-b px-6 lg:hidden"
  >
    <div class="flex h-17.5 items-center">
      <AppLogo />
    </div>
    <button
      class="flex h-6 w-6 items-center justify-center rounded-sm text-white"
      type="button"
      @click="sidebarToggled = !sidebarToggled"
    >
      <svg
        fill="none"
        height="16"
        stroke="white"
        viewBox="0 0 15 15"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Menu</title>
        <path
          clip-rule="evenodd"
          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </button>
  </div>
  <div class="w-dvw flex h-[calc(100dvh-4.375rem)] lg:h-dvh">
    <EmailsSidebar
      :class="
        cn(
          'fixed top-17.5 left-0 z-9999 h-full max-h-full w-full max-w-full will-change-auto [transition:width_0.2s_ease-in-out]',
          'lg:static lg:inline-block lg:z-auto lg:max-h-full lg:w-[16rem]',
          {
            '-translate-x-full lg:translate-x-0': sidebarToggled,
            'lg:w-0': !sidebarToggled,
          },
        )
      "
    />
    <main
      :class="
        cn(
          'inline-block relative overflow-hidden will-change-[width]',
          'w-full h-full',
          '[transition:width_0.2s_ease-in-out,transform_0.2s_ease-in-out]',
          {
            'lg:w-[calc(100%-16rem)]': sidebarToggled,
            'opacity-0 lg:opacity-100': !sidebarToggled,
          },
        )
      "
    >
      <slot />
    </main>
  </div>
</template>

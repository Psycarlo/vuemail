<script setup lang="ts">
import {
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vaul-vue';
import { ref } from 'vue';

defineProps<{ starCount: string }>();

const GITHUB_URL = 'https://github.com/vuemail/vuemail';

const items = [
  { href: '/components', label: 'Components' },
  { href: '/templates', label: 'Templates' },
  { href: '/editor', label: 'Editor' },
  { href: '/docs', label: 'Docs' },
];

const isDrawerOpen = ref(false);
const closeDrawer = () => {
  isDrawerOpen.value = false;
};
</script>

<template>
  <nav class="hidden items-center gap-2 md:flex">
    <ul class="flex gap-2">
      <AppMenuItem
        v-for="item in items"
        :key="item.href"
        :href="item.href"
        @click="closeDrawer"
      >
        {{ item.label }}
      </AppMenuItem>
    </ul>
    <span
      aria-hidden="true"
      class="sm:inline-block! mx-2 hidden h-5 w-px bg-slate-6"
    />
    <ul class="flex gap-2">
      <AppMenuItem
        class="w-fit gap-1.5 justify-center px-2"
        :href="GITHUB_URL"
        @click="closeDrawer"
      >
        <GithubIcon />
        <span>{{ starCount }}</span>
      </AppMenuItem>
    </ul>
  </nav>
  <nav class="relative flex items-center gap-1 md:hidden">
    <AppMenuItem
      class="w-fit gap-1.5 justify-center px-2"
      :href="GITHUB_URL"
      @click="closeDrawer"
    >
      <GithubIcon />
      <span>{{ starCount }}</span>
    </AppMenuItem>
    <ul class="flex gap-2">
      <DrawerRoot v-model:open="isDrawerOpen" should-scale-background>
        <DrawerTrigger class="p-2">
          <div class="flex flex-col gap-2">
            <div class="w-5 h-px rounded-full bg-slate-11" />
            <div class="w-5 h-px rounded-full bg-slate-11" />
          </div>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay
            class="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 h-[200dvh] w-[200dvw] bg-black/80"
          />
          <DrawerContent
            class="fixed right-0 bottom-0 left-0 z-51 flex h-fit flex-col gap-8 rounded-t-xl bg-black border-t border-slate-5 p-8 pt-10"
          >
            <DrawerTitle class="sr-only">Menu</DrawerTitle>
            <ul class="flex w-full flex-col items-start gap-4">
              <AppMenuItem
                v-for="item in items"
                :key="item.href"
                :href="item.href"
                @click="closeDrawer"
              >
                {{ item.label }}
              </AppMenuItem>
            </ul>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </ul>
  </nav>
</template>

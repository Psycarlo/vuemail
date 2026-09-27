<script setup lang="ts">
const items = [
  { icon: 'gmail', title: 'Gmail' },
  { icon: 'apple_mail', title: 'Apple Mail' },
  { icon: 'outlook', title: 'Outlook' },
  { icon: 'yahoo_mail', title: 'Yahoo! Mail' },
  { icon: 'hey', title: 'HEY' },
  { icon: 'superhuman', title: 'Superhuman' },
] as const;
</script>

<template>
  <section class="relative my-20 space-y-16 max-md:px-6">
    <div class="flex flex-col gap-6">
      <UiHeading as="h2" size="8" weight="medium" class="text-white/80">
        Battle-tested Primitives
      </UiHeading>
      <UiText size="5" class="opacity-70">
        All components are tested on the most popular email clients.
      </UiText>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-6 lg:gap-16 lg:max-w-4xl">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-col items-center justify-center gap-3"
      >
        <div
          class="flex items-center w-20 h-20 shrink-0 grow justify-center bg-linear-to-b from-zinc-800 to-zinc-950 rounded-[18px] shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)]"
        >
          <HomePrimitivesIcon :name="item.icon" />
        </div>
        <UiText
          size="3"
          class="text-gradient opacity-90 font-[460] tracking-tight"
        >
          {{ item.title }}
        </UiText>
      </div>
    </div>
    <HomeBackgroundImage
      class="pointer-events-none absolute sm:-translate-x-48 -top-20 z-3 scale-110 select-none mix-blend-lighten"
      priority
    />
  </section>
</template>

<script setup lang="ts">
import { communityItems, officialItems } from '#shared/templates';
</script>

<template>
  <section class="mb-24">
    <UiHeading
      as="h2"
      class="px-6 text-slate-12 md:px-8"
      size="3"
      weight="medium"
    >
      Official
    </UiHeading>
    <div
      class="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3"
    >
      <TemplatesCard
        v-for="(item, index) in officialItems"
        :key="item.name"
        v-bind="item"
        :index="index"
      />
    </div>
  </section>

  <section>
    <UiHeading
      as="h2"
      class="px-6 text-slate-12 md:px-8"
      size="3"
      weight="medium"
    >
      Community
    </UiHeading>
    <div
      class="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3"
    >
      <TemplatesCard
        v-for="(item, index) in communityItems"
        :key="item.name"
        v-bind="item"
        :index="index"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { TabsContent } from 'reka-ui';
import { computed } from 'vue';

interface Tab {
  label: string;
  value: string;
  code: string;
}

const props = defineProps<{
  tabs: Tab[];
  activeTab: string;
}>();

const activeCode = computed(
  () => props.tabs.find((tab) => tab.value === props.activeTab)?.code || '',
);

const { isScrolling } = useIsScrolling();

// Rendered on the server, where upstream renders it in the browser
const { data: emailOutput } = await useFetch<string>('/api/playground', {
  key: 'home-playground-email',
  default: () => '',
});

const maskStyle = {
  maskImage:
    'linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to right, black 0%, black 96%, transparent 100%), linear-gradient(to left, black 0%, black 96%, transparent 100%)',
  maskComposite: 'intersect',
};
</script>

<template>
  <div class="relative border border-zinc-800 rounded-[20px] overflow-hidden">
    <div
      class="flex items-center justify-between border-b border-zinc-800 h-14 px-2.5"
    >
      <div class="flex items-center gap-1.5 sm:gap-2 h-full ml-2">
        <div
          v-for="index in 3"
          :key="index"
          class="size-2.5 sm:size-3 rounded-full bg-zinc-800"
        />
      </div>
      <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        <HomeFileIcon class="size-4 sm:size-4.5" />
        <span class="text-slate-11 font-mono text-xs sm:text-sm">
          email-template.vue
        </span>
      </div>
      <div class="flex items-center gap-2">
        <CopyCode :code="activeCode" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 w-full">
      <div class="md:col-span-2 max-md:border-b max-md:border-zinc-800">
        <!-- The padding classes go to the <pre> of the code block -->
        <TabsContent
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :class="[
            'h-[400px] md:h-[600px] overflow-auto max-md:[&>pre]:px-2 max-md:[&>pre]:py-3',
            isScrolling && 'pointer-events-none',
          ]"
          :style="maskStyle"
        >
          <SiteCodeBlock
            :code="tab.code"
            code-class="w-fit"
            language="vue"
            :is-gradient-line="false"
          />
        </TabsContent>
      </div>
      <div
        class="md:col-span-2 md:border-l border-zinc-800 h-[400px] md:h-auto"
      >
        <!-- Once: hydrating it would set `srcdoc` again, reloading it -->
        <iframe
          v-if="emailOutput"
          v-once
          class="w-full h-full"
          :srcdoc="emailOutput"
          title="Email Preview"
        />
      </div>
    </div>

    <div
      aria-hidden="true"
      class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-96 bg-linear-to-l from-transparent via-green-12/50 via-50% to-transparent"
    />
  </div>
</template>

<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot } from 'reka-ui';

defineProps<{
  title?: string;
  sourceCode: string;
  githubUrl: string;
}>();

type ActiveView = 'example' | 'code';

const activeView = ref<ActiveView>('example');

provide(editorExamplePageKey, true);
</script>

<template>
  <TabsRoot
    v-model="activeView"
    class="relative mb-8 flex w-full flex-col gap-2 md:mb-12"
  >
    <div class="relative flex w-full items-center gap-6 px-6 pb-3 md:px-8">
      <h2
        v-if="title"
        class="shrink grow basis-0 text-pretty font-semibold text-lg text-slate-12 md:text-xl"
      >
        {{ title }}
      </h2>
      <TabsList
        :class="[
          'relative flex w-fit items-center overflow-hidden p-1 text-xs',
          { 'ml-auto': !title },
        ]"
      >
        <TabTrigger
          :active-view="activeView"
          layout-id="example-view"
          value="example"
          class="flex w-9 items-center justify-center px-0!"
        >
          <IconMonitor />
        </TabTrigger>
        <TabTrigger
          :active-view="activeView"
          layout-id="example-view"
          value="code"
          class="flex w-9 items-center justify-center px-0!"
        >
          <IconSource />
        </TabTrigger>
      </TabsList>
      <div class="absolute right-0 bottom-0 h-px w-dvw bg-slate-4" />
    </div>
    <div
      class="relative h-fit w-full transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] transition-discrete"
    >
      <TabsContent
        class="relative m-4 mx-2 h-fit scroll-m-2 transition-colors focus:outline-hidden md:mx-8"
        value="example"
      >
        <slot />
      </TabsContent>
      <TabsContent
        class="relative m-4 mx-2 h-fit scroll-m-2 overflow-hidden rounded-2xl border border-slate-4 transition-colors focus:outline-hidden focus:ring-3 focus:ring-slate-8 md:mx-8"
        value="code"
      >
        <EditorExampleCodeView :code="sourceCode" :github-url="githubUrl" />
      </TabsContent>
    </div>
  </TabsRoot>
</template>

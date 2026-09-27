<script lang="ts">
/** A component of the gallery, as `GET /api/components/:category` returns it. */
export interface GalleryComponent {
  slug: string;
  title: string;
  code: {
    html: string;
    tailwind?: string;
    'inline-styles'?: string;
    vue?: string;
  };
}
</script>

<script setup lang="ts">
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui';
import { computed, ref } from 'vue';
import IconMonitor from '~/components/icon/IconMonitor.vue';
import IconPhone from '~/components/icon/IconPhone.vue';
import IconSource from '~/components/icon/IconSource.vue';

type ActiveView = 'code' | 'desktop' | 'mobile';

const props = defineProps<{
  component: GalleryComponent;
  /** Classes for the header, with the title and the tabs */
  headerClass?: string;
}>();

const activeView = ref<ActiveView>('desktop');

const onViewChange = (value: string | number) => {
  activeView.value = value as ActiveView;
};

const views = [
  { value: 'desktop', tooltip: 'Desktop', icon: IconMonitor },
  { value: 'mobile', tooltip: 'Mobile', icon: IconPhone },
  { value: 'code', tooltip: 'Code', icon: IconSource },
] as const;

const sendMarkup = computed(() =>
  convertUrisIntoUrls(props.component.code.html).replace(
    /height\s*:\s*100vh;?/,
    '',
  ),
);

const tabContentClass =
  'relative m-4 mx-2 h-fit scroll-m-2 overflow-hidden rounded-2xl border border-slate-4 transition-colors focus:outline-hidden md:mx-8';
const previewBackgroundClass =
  'absolute inset-0 bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),radial-gradient(#091A21_.0313rem,transparent_.0313rem)] bg-transparent opacity-30 transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] bg-position-[0_0,.625rem_.625rem] bg-size-[1.25rem_1.25rem] h-[calc-size(auto)] transition-discrete';
</script>

<template>
  <TabsRoot
    class="relative mb-8 flex w-full flex-col gap-2 md:mb-12"
    :model-value="activeView"
    @update:model-value="onViewChange"
  >
    <TooltipProvider>
      <div
        :class="[
          'relative flex w-full items-center gap-6 px-6 pb-3 md:px-8',
          headerClass,
        ]"
      >
        <h2
          class="shrink grow basis-0 text-pretty font-semibold text-lg text-slate-12 md:text-xl"
        >
          {{ component.title }}
        </h2>
        <TabsList
          class="relative flex w-fit items-center overflow-hidden p-1 text-xs"
        >
          <TooltipRoot v-for="view in views" :key="view.value">
            <TooltipTrigger as-child>
              <TabTrigger
                :active-view="activeView"
                class="w-9 px-0! flex items-center justify-center"
                :layout-id="`${component.slug}-view`"
                :value="view.value"
              >
                <component :is="view.icon" />
              </TabTrigger>
            </TooltipTrigger>
            <TooltipContent>{{ view.tooltip }}</TooltipContent>
          </TooltipRoot>
          <Send
            class="ml-2"
            :default-subject="component.title"
            :markup="sendMarkup"
          />
        </TabsList>
        <div class="absolute right-0 bottom-0 h-px w-dvw bg-slate-4" />
      </div>
      <div
        class="relative h-fit w-full transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] transition-discrete"
      >
        <TabsContent :class="[tabContentClass, 'min-h-[228px]']" value="desktop">
          <div :class="previewBackgroundClass" />
          <GalleryComponentPreview
            active-view="desktop"
            :html="component.code.html"
          />
        </TabsContent>
        <TabsContent :class="[tabContentClass, 'min-h-[228px]']" value="mobile">
          <div :class="previewBackgroundClass" />
          <GalleryComponentPreview
            active-view="mobile"
            :html="component.code.html"
          />
        </TabsContent>
        <TabsContent :class="tabContentClass" value="code">
          <GalleryComponentCodeView :component="component" />
        </TabsContent>
      </div>
    </TooltipProvider>
  </TabsRoot>
</template>

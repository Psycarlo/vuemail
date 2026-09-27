<script setup lang="ts">
import { TabsList, TabsRoot } from 'reka-ui';
import { computed, onMounted, type Ref, ref } from 'vue';
import type { VueCodeVariant } from './CodeVariantSelect.vue';
import type { GalleryComponent } from './ComponentView.vue';

type Language = 'vue' | 'html';

const props = defineProps<{ component: GalleryComponent }>();

/** State remembered by the browser, restored once the component mounts. */
const useStoredState = <T extends string>(
  key: string,
  defaultValue: T,
  values: readonly T[],
) => {
  const state = ref(defaultValue) as Ref<T>;
  onMounted(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue && (values as readonly string[]).includes(storedValue)) {
        state.value = storedValue as T;
      }
    } catch {
      // Storage can be unavailable, like in private windows
    }
  });

  const setState = (newValue: T) => {
    try {
      if (newValue) localStorage.setItem(key, newValue);
    } catch {
      // Storage can be unavailable, like in private windows
    }
    state.value = newValue;
  };
  return [state, setState] as const;
};

const [selectedVariant, setSelectedVariant] = useStoredState<VueCodeVariant>(
  'code-variant',
  'tailwind',
  ['tailwind', 'inline-styles'],
);
const [selectedLanguage, setSelectedLanguage] = useStoredState<Language>(
  'code-language',
  'vue',
  ['vue', 'html'],
);

const code = computed(() => {
  const { code } = props.component;
  if (selectedLanguage.value === 'html') {
    return convertUrisIntoUrls(code.html.replace(/height\s*:\s*100vh;?/, ''));
  }

  const codeForSelectedVariant = code[selectedVariant.value];
  if (!codeForSelectedVariant) {
    return convertUrisIntoUrls(code.vue ?? code.html);
  }
  const withUrls = convertUrisIntoUrls(codeForSelectedVariant);
  return selectedVariant.value === 'tailwind'
    ? wrapWithTailwind(withUrls)
    : withUrls;
});

const onLanguageChange = (value: string | number) => {
  setSelectedLanguage(value as Language);
};
</script>

<template>
  <div class="flex h-full w-full flex-col gap-2 bg-slate-3">
    <div
      class="relative flex w-full justify-between gap-4 border-slate-4 border-b border-solid p-4 text-xs"
    >
      <TabsRoot
        :model-value="selectedLanguage"
        @update:model-value="onLanguageChange"
      >
        <TabsList class="p1-text-xs flex w-fit space-x-1 overflow-hidden">
          <TabTrigger
            :active-view="selectedLanguage"
            :layout-id="`${component.slug}-language`"
            value="vue"
          >
            Vue
          </TabTrigger>
          <TabTrigger
            :active-view="selectedLanguage"
            :layout-id="`${component.slug}-language`"
            value="html"
          >
            HTML
          </TabTrigger>
        </TabsList>
      </TabsRoot>
      <div class="flex gap-2">
        <GalleryCodeVariantSelect
          v-if="selectedLanguage === 'vue' && !component.code.vue"
          :model-value="selectedVariant"
          @update:model-value="setSelectedVariant"
        />
        <!-- With the classes of React Email's IconButton, which wraps its CopyCode -->
        <CopyCode
          class="rounded-sm p-1 text-[#EEF7FE] transition duration-200 ease-in-out hover:text-white focus:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-6 shadow-none p-2 h-8 w-8"
          :code="code"
        />
      </div>
    </div>
    <div class="h-full w-full overflow-auto">
      <SiteCodeBlock
        :code="code"
        :language="selectedLanguage === 'html' ? 'html' : 'vue'"
      />
    </div>
  </div>
</template>

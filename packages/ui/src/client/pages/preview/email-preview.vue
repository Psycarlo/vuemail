<script setup lang="ts">
import 'vue-sonner/style.css';
import { TooltipProvider } from 'reka-ui';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router';
import { Toaster } from 'vue-sonner';
import CodeContainer, {
  type MarkupProps,
} from '../../components/code-container.vue';
import PreviewPropsPanel from '../../components/preview-props-panel.vue';
import ResizableWrapper from '../../components/resizable-wrapper.vue';
import Send from '../../components/send.vue';
import ActiveViewToggleGroup from '../../components/topbar/active-view-toggle-group.vue';
import EmulatedDarkModeToggle from '../../components/topbar/emulated-dark-mode-toggle.vue';
import PropsPanelToggle from '../../components/topbar/props-panel-toggle.vue';
import ViewSizeControls from '../../components/topbar/view-size-controls.vue';
import Topbar from '../../components/topbar.vue';
import { useClampedState } from '../../composables/use-clamped-state';
import { useDebouncedCallback } from '../../composables/use-debounced-callback';
import { usePreviewContext } from '../../composables/use-preview';
import { usePropsPanel } from '../../composables/use-props-panel';
import { useToolbarState } from '../../composables/use-toolbar-state';
import { cn } from '../../utils/cn';
import { inferEmailTitle } from '../../utils/infer-email-title';
import { makeIframeDocumentBubbleEvents } from '../../utils/make-iframe-document-bubble-events';
import { getSearchParam } from '../../utils/search-params';
import EmailFrame from './email-frame.vue';
import ErrorOverlay from './error-overlay.vue';

defineProps<{
  emailTitle: string;
}>();

const { renderingResult, renderedEmailMetadata, emailSlug } =
  usePreviewContext();

const route = useRoute();
const router = useRouter();

const isDarkModeEnabled = computed(
  () => getSearchParam(route.query, 'dark') !== null,
);
const activeView = computed(
  () => getSearchParam(route.query, 'view') ?? 'preview',
);
const isRawHtmlEmail = computed(
  () => renderedEmailMetadata.value?.extname === 'html',
);

// The grammars sources are highlighted with, by the extension of the email
const sourceGrammars: Record<string, string> = {
  vue: 'markup',
  tsx: 'tsx',
  jsx: 'jsx',
  js: 'javascript',
};

const markups = computed((): MarkupProps[] => {
  const metadata = renderedEmailMetadata.value;
  if (!metadata) return [];

  return isRawHtmlEmail.value
    ? [
        {
          language: 'html',
          extension: 'html',
          content: metadata.prettyMarkup,
        },
        {
          language: 'markdown',
          extension: 'md',
          content: metadata.plainText,
        },
      ]
    : [
        {
          language: 'vue',
          extension: metadata.extname,
          content: metadata.source,
          grammar: sourceGrammars[metadata.extname] ?? 'markup',
        },
        {
          language: 'html',
          content: metadata.prettyMarkup,
        },
        {
          language: 'markdown',
          extension: 'md',
          content: metadata.plainText,
        },
      ];
});

const activeLang = computed(() => {
  const requestedLang = getSearchParam(route.query, 'lang');
  const defaultLang = isRawHtmlEmail.value ? 'html' : 'vue';
  // Raw HTML templates only expose `html` and `markdown` tabs, so coerce any
  // lingering `vue` selection from URL state (or any other language without
  // a tab) to the default tab to avoid the "No markup found for the active
  // language!" error in CodeContainer.
  return requestedLang !== null &&
    markups.value.some(({ language }) => language === requestedLang)
    ? requestedLang
    : defaultLang;
});

const navigate = (query: LocationQueryRaw, hash: string) =>
  router.push({ path: route.path, query, hash });

const handleDarkModeChange = (enabled: boolean) => {
  const params: LocationQueryRaw = { ...route.query };
  if (enabled) {
    params.dark = '';
  } else {
    delete params.dark;
  }
  void navigate(params, route.hash);
};

const handleViewChange = (view: string) => {
  void navigate({ ...route.query, view }, route.hash);
};

const handleLangChange = (lang: string) => {
  const isSameLang = getSearchParam(route.query, 'lang') === lang;
  void navigate(
    { ...route.query, view: 'source', lang },
    isSameLang ? route.hash : '',
  );
};

const renderingError = computed(() =>
  'error' in renderingResult.value ? renderingResult.value.error : undefined,
);

const maxWidth = ref(Number.POSITIVE_INFINITY);
const maxHeight = ref(Number.POSITIVE_INFINITY);
const minWidth = 220;
const minHeight = minWidth * 1.6;
const parseStoredSize = (name: string, fallback: number) => {
  const stored = getSearchParam(route.query, name);
  const size = stored ? Number.parseInt(stored, 10) : fallback;
  return Number.isNaN(size) ? fallback : size;
};
const [width, setWidth] = useClampedState(
  parseStoredSize('width', 1024),
  minWidth,
  maxWidth,
);
const [height, setHeight] = useClampedState(
  parseStoredSize('height', 600),
  minHeight,
  maxHeight,
);

const handleSaveViewSize = useDebouncedCallback(() => {
  void navigate(
    {
      ...route.query,
      width: width.value.toString(),
      height: height.value.toString(),
    },
    route.hash,
  );
}, 300);

const handleResize = (value: number, direction: string) => {
  const isHorizontal = direction === 'east' || direction === 'west';
  if (isHorizontal) {
    setWidth(Math.round(value));
  } else {
    setHeight(Math.round(value));
  }
};

const { toggled: toolbarToggled } = useToolbarState();

const { open: propsPanelOpen, setOpen: handlePropsPanelChange } =
  usePropsPanel();

const content = ref<HTMLDivElement>();
let resizeObserver: ResizeObserver | undefined;
onMounted(() => {
  resizeObserver = new ResizeObserver((entry) => {
    const [elementEntry] = entry;
    if (elementEntry) {
      maxWidth.value = elementEntry.contentRect.width;
      maxHeight.value = elementEntry.contentRect.height;
    }
  });
  if (content.value) {
    resizeObserver.observe(content.value);
  }
});

// Resizing goes on while dragging over the email's own document
let stopBubblingIframeEvents: (() => void) | undefined;
const handleFrameLoad = (event: Event) => {
  stopBubblingIframeEvents?.();
  stopBubblingIframeEvents = makeIframeDocumentBubbleEvents(
    event.currentTarget as HTMLIFrameElement,
  );
};

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stopBubblingIframeEvents?.();
});
</script>

<template>
  <Topbar :email-title="emailTitle">
    <template v-if="activeView === 'preview'">
      <EmulatedDarkModeToggle
        :enabled="isDarkModeEnabled"
        @change="handleDarkModeChange"
      />
      <ViewSizeControls
        :min-height="minHeight"
        :min-width="minWidth"
        :view-height="height"
        :view-width="width"
        @update:view-height="
          (newHeight) => {
            setHeight(newHeight);
            handleSaveViewSize();
          }
        "
        @update:view-width="
          (newWidth) => {
            setWidth(newWidth);
            handleSaveViewSize();
          }
        "
      />
    </template>
    <ActiveViewToggleGroup
      :active-view="activeView"
      @update:active-view="handleViewChange"
    />
    <PropsPanelToggle
      v-if="renderedEmailMetadata && !isRawHtmlEmail"
      :open="propsPanelOpen"
      @change="handlePropsPanelChange"
    />
    <div v-if="renderedEmailMetadata" class="flex justify-end">
      <Send
        :key="emailSlug"
        :default-subject="inferEmailTitle(emailTitle)"
        :markup="renderedEmailMetadata.markup"
        :storage-key="emailSlug"
      />
    </div>
  </Topbar>

  <div
    :class="
      cn(
        'flex h-[calc(100%-3.5rem-2.375rem)] will-change-[height] transition-[height] duration-300',
        toolbarToggled && 'h-[calc(100%-3.5rem-13rem)]',
      )
    "
  >
    <div
      ref="content"
      :class="
        cn(
          'relative flex min-w-0 grow p-4',
          activeView === 'preview' && 'bg-gray-200',
          activeView === 'preview' && isDarkModeEnabled && 'bg-gray-400',
        )
      "
    >
      <ErrorOverlay v-if="renderingError" :error="renderingError" />

      <template v-if="renderedEmailMetadata">
        <ResizableWrapper
          v-if="activeView === 'preview'"
          v-slot="{ resizingClass }"
          :height="height"
          :max-height="maxHeight"
          :max-width="maxWidth"
          :min-height="minHeight"
          :min-width="minWidth"
          :width="width"
          @resize="handleResize"
          @resize-end="handleSaveViewSize()"
        >
          <EmailFrame
            :class="
              cn(
                'max-h-full rounded-lg bg-white [color-scheme:auto]',
                resizingClass,
              )
            "
            :dark-mode="isDarkModeEnabled"
            :height="height"
            :markup="renderedEmailMetadata.markup"
            :title="emailTitle"
            :width="width"
            @load="handleFrameLoad"
          />
        </ResizableWrapper>

        <div v-if="activeView === 'source'" class="h-full w-full">
          <div class="m-auto h-full flex max-w-3xl p-6">
            <TooltipProvider>
              <CodeContainer
                :active-lang="activeLang"
                :basename="renderedEmailMetadata.basename"
                :markups="markups"
                @update:active-lang="handleLangChange"
              />
            </TooltipProvider>
          </div>
        </div>
      </template>

      <Toaster />
    </div>

    <PreviewPropsPanel
      v-if="renderedEmailMetadata && !isRawHtmlEmail"
      :open="propsPanelOpen"
    />
  </div>
</template>

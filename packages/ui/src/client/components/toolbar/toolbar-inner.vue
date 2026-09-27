<script setup lang="ts">
import { LayoutGroup } from 'motion-v';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui';
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { nicenames } from '../../../node/email-validation/caniemail-data';
import { getRelevantEmailClients } from '../../../node/email-validation/email-clients';
import type {
  CompatibilityCheckingResult,
  LintingRow,
  RenderedEmailMetadata,
  SpamCheckingResult,
} from '../../../shared/types';
import { useCachedWorkspaceState } from '../../composables/use-cached-workspace-state';
import {
  type ToolbarTabValue,
  toolbarTabValues,
  useToolbarState,
} from '../../composables/use-toolbar-state';
import { config, isStatic } from '../../config';
import IconArrowDown from '../../icons/icon-arrow-down.vue';
import IconCheck from '../../icons/icon-check.vue';
import IconInfo from '../../icons/icon-info.vue';
import IconReload from '../../icons/icon-reload.vue';
import { cn } from '../../utils/cn';
import CodeSnippet from '../code-snippet.vue';
import Compatibility from './compatibility.vue';
import CopyForAi from './copy-for-ai.vue';
import Linter from './linter.vue';
import ResendIntegration from './resend-integration.vue';
import SpamAssassin from './spam-assassin.vue';
import ToolbarButton from './toolbar-button.vue';
import ToolbarLoadingState from './toolbar-loading-state.vue';
import ToolbarSuccessState from './toolbar-success-state.vue';
import { useCompatibility } from './use-compatibility';
import { useLinter } from './use-linter';
import { useSpamAssassin } from './use-spam-assassin';

const props = defineProps<{
  slug: string;
  rendering: RenderedEmailMetadata;
}>();

const compatibilityClientsLabel = getRelevantEmailClients(
  config.compatibilityClients,
)
  .map((client) => nicenames.family[client] ?? client)
  .join(', ');

const {
  activeTab,
  toggled,
  setActiveTab: setActivePanelValue,
} = useToolbarState();

const [cachedSpamCheckingResult, setCachedSpamCheckingResult] =
  useCachedWorkspaceState<SpamCheckingResult>(`spam-assassin:${props.slug}`);
const {
  result: spamCheckingResult,
  load: loadSpamChecking,
  loading: spamLoading,
} = useSpamAssassin({
  slug: props.slug,
  markup: () => props.rendering.prettyMarkup,
  plainText: () => props.rendering.plainText,

  initialResult: cachedSpamCheckingResult.value,
});

const [cachedLintingRows, setCachedLintingRows] = useCachedWorkspaceState<
  LintingRow[]
>(`linter:${props.slug}`);
const {
  rows: lintingRows,
  load: loadLinting,
  loading: lintLoading,
} = useLinter({
  slug: props.slug,
  markup: () => props.rendering.prettyMarkup,

  initialRows: cachedLintingRows.value,
});

const [cachedCompatibilityResults, setCachedCompatibilityResults] =
  useCachedWorkspaceState<CompatibilityCheckingResult[]>(
    `compatibility:${props.slug}`,
  );
const {
  results: compatibilityCheckingResults,
  load: loadCompatibility,
  loading: compatibilityLoading,
} = useCompatibility({
  slug: props.slug,
  markup: () => props.rendering.prettyMarkup,

  initialResults: cachedCompatibilityResults.value,
});

// Unlike upstream, compatibility is checked on the rendered HTML, so it
// applies to raw HTML emails too, and the checks run side by side. Built
// previews come with the results of their build.
onMounted(() => {
  void loadLinting().then((rows) => {
    if (rows) setCachedLintingRows(rows);
  });
  void loadSpamChecking().then((result) => {
    if (result) setCachedSpamCheckingResult(result);
  });
  void loadCompatibility().then((results) => {
    if (results) setCachedCompatibilityResults(results);
  });
});

const id = useId();
const isToolbarInfoOpen = ref(false);
let infoPointerType = '';
let infoBlurListener: (() => void) | null = null;

const removeInfoBlurListener = () => {
  if (infoBlurListener) {
    window.removeEventListener('blur', infoBlurListener);
    infoBlurListener = null;
  }
};
// Only a cleanup for when the component unmounts with the popover still
// open; opening/closing itself is handled directly in `onInfoOpenChange`.
onBeforeUnmount(removeInfoBlurListener);

const onInfoOpenChange = (open: boolean) => {
  if (!open) {
    isToolbarInfoOpen.value = false;
    removeInfoBlurListener();
    return;
  }

  // Mouse users already get this info on hover, so only touch and keyboard
  // interactions open the popover. Keyboard activation dispatches `click`
  // without a preceding `pointerdown`, leaving the pointer type empty.
  if (infoPointerType === 'mouse') return;

  isToolbarInfoOpen.value = true;
  if (infoBlurListener === null) {
    // Taps inside the email preview iframe do not reach reka-ui's dismiss
    // layer, but they do blur the window.
    const closeWhenPreviewGetsFocus = () => {
      if (!(document.activeElement instanceof HTMLIFrameElement)) {
        return;
      }
      isToolbarInfoOpen.value = false;
      removeInfoBlurListener();
    };
    infoBlurListener = closeWhenPreviewGetsFocus;
    window.addEventListener('blur', closeWhenPreviewGetsFocus);
  }
};

const onInfoPointerDown = (event: PointerEvent) => {
  // Read the pointer type from `pointerdown` rather than the `click` event:
  // Safari before 18.2 dispatches `click` as a plain MouseEvent without
  // `pointerType`.
  infoPointerType = event.pointerType;
  const clearPointerType = () => {
    window.removeEventListener('pointerup', clearPointerType, true);
    window.removeEventListener('pointercancel', clearPointerType, true);
    // Deferred so the `click` for this same interaction can still read the
    // pointer type; this also self-heals if the pointer is released off the
    // button and no `click` ever fires.
    setTimeout(() => {
      infoPointerType = '';
    }, 0);
  };
  window.addEventListener('pointerup', clearPointerType, { capture: true });
  window.addEventListener('pointercancel', clearPointerType, {
    capture: true,
  });
};

const toolbarPanelDescription = computed(
  () =>
    (activeTab.value === 'linter' &&
      'The Linter tab checks all the images and links for common issues like missing alt text, broken URLs, insecure HTTP methods, and more.') ||
    (activeTab.value === 'spam-assassin' &&
      'The Spam tab will look at the content and use a robust scoring framework to determine if the email is likely to be spam. Powered by SpamAssassin.') ||
    (activeTab.value === 'compatibility' &&
      'The Compatibility tab shows how well the HTML/CSS is supported across mail clients like Outlook, Gmail, etc. Powered by Can I Email.') ||
    (activeTab.value === 'resend' &&
      'The Resend tab allows you to upload your Vuemail code using the Resend Templates API.') ||
    'Info',
);

const panelLabels: Record<ToolbarTabValue, string> = {
  linter: 'Linter',
  compatibility: 'Compatibility',
  'spam-assassin': 'Spam',
  resend: 'Resend',
};
const availablePanels = toolbarTabValues.map((value) => ({
  value,
  label: panelLabels[value],
}));
const activePanelLabel = computed(
  () =>
    (activeTab.value ? panelLabels[activeTab.value] : undefined) ?? 'Linter',
);

const isLoading = computed(
  () => lintLoading.value || spamLoading.value || compatibilityLoading.value,
);

// Built previews show the results of their build
const canReload = computed(() => !isStatic && activeTab.value !== 'resend');

const reload = async () => {
  const tab = activeTab.value;
  if (tab === undefined) {
    setActivePanelValue('linter');
  }
  if (tab === 'spam-assassin') {
    await loadSpamChecking();
  } else if (tab === 'linter') {
    await loadLinting();
  } else if (tab === 'compatibility') {
    await loadCompatibility();
  }
};

const toggle = () => {
  if (activeTab.value === undefined) {
    setActivePanelValue('linter');
  } else {
    setActivePanelValue(undefined);
  }
};
</script>

<template>
  <div
    :data-toggled="toggled"
    :class="
      cn(
        'absolute bottom-0 left-0 right-0',
        'border-t border-slate-6 group/toolbar text-xs text-slate-11 h-52 transition-transform',
        'data-[toggled=false]:translate-y-42.5',
      )
    "
  >
    <TabsRoot
      as-child
      :model-value="activeTab ?? ''"
      @update:model-value="
        (newValue) => setActivePanelValue(newValue as ToolbarTabValue)
      "
    >
      <div class="flex flex-col h-full">
        <div
          class="flex h-10 w-full shrink-0 items-center border-b border-solid border-slate-6 px-2 sm:px-4"
        >
          <div class="flex h-full min-w-0 flex-1 items-center sm:hidden">
            <DropdownMenuRoot>
              <DropdownMenuTrigger as-child>
                <button
                  type="button"
                  class="group flex h-full items-center gap-1 px-1 text-slate-11 text-sm transition-colors hover:text-slate-12"
                >
                  {{ activePanelLabel }}
                  <IconArrowDown
                    :size="20"
                    class="transition-transform group-data-[state=open]:rotate-180"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="start"
                  class="z-50 min-w-44 rounded-md border border-slate-6 bg-black p-1 font-sans"
                  :collision-padding="8"
                  side="top"
                  :side-offset="8"
                >
                  <DropdownMenuItem
                    v-for="panel in availablePanels"
                    :key="panel.value"
                    :class="
                      cn(
                        'flex cursor-pointer items-center justify-between gap-2 rounded px-3 py-2 text-slate-11 text-sm outline-none',
                        'data-[highlighted]:bg-white/5 data-[highlighted]:text-slate-12',
                        activeTab === panel.value && 'text-green-11',
                      )
                    "
                    @select="setActivePanelValue(panel.value)"
                  >
                    {{ panel.label }}
                    <IconCheck v-if="activeTab === panel.value" :size="16" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>
          <TabsList class="hidden h-full min-w-0 flex-1 gap-4 sm:flex">
            <LayoutGroup :id="`toolbar-${id}`">
              <TabsTrigger as-child value="linter">
                <ToolbarButton :active="activeTab === 'linter'">
                  Linter
                </ToolbarButton>
              </TabsTrigger>
              <TabsTrigger as-child value="compatibility">
                <ToolbarButton :active="activeTab === 'compatibility'">
                  Compatibility
                </ToolbarButton>
              </TabsTrigger>
              <TabsTrigger as-child value="spam-assassin">
                <ToolbarButton :active="activeTab === 'spam-assassin'">
                  Spam
                </ToolbarButton>
              </TabsTrigger>
              <TabsTrigger as-child value="resend">
                <ToolbarButton :active="activeTab === 'resend'">
                  Resend
                </ToolbarButton>
              </TabsTrigger>
            </LayoutGroup>
          </TabsList>
          <div class="ml-2 flex shrink-0 items-center gap-1 sm:ml-4">
            <CopyForAi
              :linting-rows="lintingRows"
              :compatibility-results="compatibilityCheckingResults"
              :spam-result="spamCheckingResult"
              :source="rendering.source"
              :extname="rendering.extname"
              :active-tab="activeTab"
            />
            <PopoverRoot
              :open="isToolbarInfoOpen"
              @update:open="onInfoOpenChange"
            >
              <PopoverTrigger as-child>
                <ToolbarButton
                  aria-label="About the current toolbar panel"
                  :delay-duration="0"
                  :tooltip="
                    isToolbarInfoOpen ? undefined : toolbarPanelDescription
                  "
                  @pointerdown="onInfoPointerDown"
                >
                  <IconInfo :size="24" />
                </ToolbarButton>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent
                  align="end"
                  class="z-50 w-60 max-w-[calc(100vw-1rem)] rounded-md border border-slate-6 bg-black px-3 py-2 font-sans text-white text-xs"
                  :collision-padding="8"
                  side="top"
                  :side-offset="8"
                >
                  {{ toolbarPanelDescription }}
                </PopoverContent>
              </PopoverPortal>
            </PopoverRoot>
            <ToolbarButton
              v-if="canReload"
              tooltip="Reload"
              :disabled="isLoading"
              @click="reload"
            >
              <IconReload
                :size="24"
                :class="cn({ 'opacity-60 animate-spin-fast': isLoading })"
              />
            </ToolbarButton>
            <ToolbarButton tooltip="Toggle toolbar" @click="toggle">
              <IconArrowDown
                :size="24"
                class="transition-transform group-data-[toggled=false]/toolbar:rotate-180"
              />
            </ToolbarButton>
          </div>
        </div>

        <div
          class="grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto pr-3 pl-4 pt-3"
        >
          <TabsContent value="linter">
            <ToolbarLoadingState
              v-if="lintLoading"
              message="Analyzing your code for linting issues..."
            />
            <ToolbarSuccessState
              v-else-if="lintingRows?.length === 0"
              icon
              title="All good"
            >
              No linting issues found.
            </ToolbarSuccessState>
            <Linter v-else :rows="lintingRows ?? []" />
          </TabsContent>
          <TabsContent value="compatibility">
            <ToolbarLoadingState
              v-if="compatibilityLoading"
              message="Checking email compatibility..."
            />
            <ToolbarSuccessState
              v-else-if="compatibilityCheckingResults?.length === 0"
              icon
              title="Great compatibility"
            >
              Template should render properly in {{ compatibilityClientsLabel }}.
            </ToolbarSuccessState>
            <Compatibility v-else :results="compatibilityCheckingResults ?? []" />
          </TabsContent>
          <TabsContent value="spam-assassin">
            <ToolbarLoadingState
              v-if="spamLoading"
              message="Evaluating your email for spam indicators..."
            />
            <ToolbarSuccessState
              v-else-if="spamCheckingResult?.isSpam === false"
              icon
              title="10/10"
            >
              Your email is clean of abuse indicators.
            </ToolbarSuccessState>
            <SpamAssassin v-else :result="spamCheckingResult" />
          </TabsContent>
          <TabsContent value="resend">
            <ResendIntegration
              v-if="config.hasResendApiKey"
              :email-slug="slug"
              :html-markup="rendering.prettyMarkup"
            />
            <ToolbarSuccessState v-else title="Connect to Resend" wide>
              Run
              <CodeSnippet>npx vuemail@latest resend setup</CodeSnippet>
              <br />
              on your terminal to connect your Resend account.
            </ToolbarSuccessState>
          </TabsContent>
        </div>
      </div>
    </TabsRoot>
  </div>
</template>

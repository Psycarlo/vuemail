<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui';
import { computed } from 'vue';
import { toast } from 'vue-sonner';
import type {
  CompatibilityCheckingResult,
  LintingRow,
  SpamCheckingResult,
} from '../../../shared/types';
import IconArrowUpRight from '../../icons/icon-arrow-up-right.vue';
import IconClipboard from '../../icons/icon-clipboard.vue';
import { ChatGPTLogo, ClaudeLogo, CursorLogo } from '../../icons/llm-logos';
import { cn } from '../../utils/cn';
import {
  type ActiveTab,
  buildChatGPTUrl,
  buildClaudeUrl,
  buildCursorUrl,
  getLinkDescription,
  getPromptForTab,
  MAX_SAFE_CHATGPT_URL_LENGTH,
} from './copy-for-ai-prompts';

const props = defineProps<{
  lintingRows: LintingRow[] | undefined;
  compatibilityResults: CompatibilityCheckingResult[] | undefined;
  spamResult: SpamCheckingResult | undefined;
  /** The source code of the email. */
  source: string;
  /** The extension of the email's file, like `vue` or `html`. */
  extname: string;
  activeTab: ActiveTab;
}>();

const markdown = computed(() =>
  getPromptForTab(
    props.activeTab,
    props.lintingRows,
    props.compatibilityResults,
    props.spamResult,
    props.source,
    props.extname,
  ),
);

const linkDescription = computed(() => getLinkDescription(props.activeTab));

const handleCopyMarkdown = () => {
  void navigator.clipboard.writeText(markdown.value).then(() => {
    toast.success('Prompt copied to clipboard');
  });
};

const claudeUrl = computed(() => buildClaudeUrl(markdown.value));
const directChatGPTUrl = computed(() => buildChatGPTUrl(markdown.value));
const isChatGPTPromptTooLong = computed(
  () => directChatGPTUrl.value.length > MAX_SAFE_CHATGPT_URL_LENGTH,
);
const chatGPTUrl = computed(() =>
  isChatGPTPromptTooLong.value
    ? 'https://chatgpt.com/'
    : directChatGPTUrl.value,
);
const cursorUrl = computed(() => buildCursorUrl(markdown.value));

const handleChatGPTClick = () => {
  if (!isChatGPTPromptTooLong.value) return;
  void navigator.clipboard.writeText(markdown.value);
};

const handleCopyPromptSelect = (event: Event) => {
  event.preventDefault();
  handleCopyMarkdown();
};

const itemClass =
  'flex items-center gap-2.5 p-2 rounded-lg cursor-pointer outline-none transition-colors hover:bg-white/5';
const logoClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10';
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        :class="
          cn(
            'flex shrink-0 items-center gap-1 h-7 whitespace-nowrap px-2.5 rounded-md text-xs font-medium self-center',
            'text-slate-11',
            'hover:text-slate-12 transition-colors',
            'outline-none',
          )
        "
      >
        Copy for AI
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="max-h-(--reka-dropdown-menu-content-available-height) w-80 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl p-1.5 shadow-2xl z-50 border border-white/10"
        style="background-color: #0c0c0c"
        :side-offset="8"
        :collision-padding="8"
        align="end"
        side="top"
      >
        <DropdownMenuItem :class="itemClass" @select="handleCopyPromptSelect">
          <span :class="logoClass" style="background-color: #161616">
            <IconClipboard :size="16" class="text-slate-11" />
          </span>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="text-sm font-medium text-white">Copy prompt</span>
            <span class="text-xs text-white/40">Copy as Markdown for LLMs</span>
          </div>
          <div class="h-4 w-4 shrink-0" />
        </DropdownMenuItem>

        <DropdownMenuItem as-child>
          <a
            :href="cursorUrl"
            target="_blank"
            rel="noreferrer noopener"
            :class="itemClass"
          >
            <span :class="logoClass" style="background-color: #161616">
              <CursorLogo :size="18" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="text-sm font-medium text-white">Open in Cursor</span>
              <span class="text-xs text-white/40">{{ linkDescription }}</span>
            </div>
            <IconArrowUpRight :size="16" class="shrink-0 text-white/30" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem as-child>
          <a
            :href="claudeUrl"
            target="_blank"
            rel="noreferrer noopener"
            :class="itemClass"
          >
            <span :class="logoClass" style="background-color: #161616">
              <ClaudeLogo :size="18" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="text-sm font-medium text-white">Open in Claude</span>
              <span class="text-xs text-white/40">{{ linkDescription }}</span>
            </div>
            <IconArrowUpRight :size="16" class="shrink-0 text-white/30" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem as-child>
          <a
            :href="chatGPTUrl"
            target="_blank"
            rel="noreferrer noopener"
            :class="itemClass"
            @click="handleChatGPTClick"
          >
            <span :class="logoClass" style="background-color: #161616">
              <ChatGPTLogo :size="18" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="text-sm font-medium text-white">Open in ChatGPT</span>
              <span class="text-xs text-white/40">
                {{
                  isChatGPTPromptTooLong
                    ? 'Long prompt: copied to clipboard. Paste with Ctrl+V / Cmd+V'
                    : linkDescription
                }}
              </span>
            </div>
            <IconArrowUpRight :size="16" class="shrink-0 text-white/30" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

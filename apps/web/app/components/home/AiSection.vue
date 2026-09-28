<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next';
import { ref } from 'vue';

const installPrompt = (agent: string) =>
  `Install the Vuemail skill with \`npx skills add psycarlo/vuemail --agent ${agent}\`, then help me build an HTML email using Vuemail components. Docs: https://vuemail.dev/docs/llms.txt`;

const items = [
  {
    title: 'Claude Code',
    prompt: installPrompt('claude-code'),
    icon: 'claude',
  },
  {
    title: 'Codex',
    prompt: installPrompt('codex'),
    icon: 'codex',
  },
  {
    title: 'Cursor',
    prompt: installPrompt('cursor'),
    icon: 'cursor',
  },
  {
    title: 'Copilot',
    prompt: installPrompt('github-copilot'),
    icon: 'copilot',
  },
  {
    title: 'v0',
    prompt: installPrompt('eve'),
    icon: 'v0',
  },
  {
    title: 'Lovable',
    prompt:
      'Import the Vuemail skill from https://github.com/psycarlo/vuemail (path: skills/vuemail). Then help me build an HTML email using Vuemail components. Docs: https://vuemail.dev/docs/llms.txt',
    icon: 'lovable',
  },
] as const;

const copiedTitle = ref<string | null>(null);

const handleCopy = async (item: (typeof items)[number]) => {
  try {
    await navigator.clipboard.writeText(item.prompt);
  } catch {
    return;
  }
  copiedTitle.value = item.title;
  window.setTimeout(() => {
    if (copiedTitle.value === item.title) copiedTitle.value = null;
  }, 1500);
};
</script>

<template>
  <section
    class="relative my-24 space-y-12 py-10 text-center max-md:px-6 md:space-y-16"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-1"
      :style="{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
      }"
    />
    <div
      class="relative z-4 max-w-full space-y-4 text-center md:mx-auto md:max-w-160"
    >
      <UiHeading
        as="h2"
        size="8"
        weight="medium"
        class="inline-block text-white/80 max-md:mx-auto max-md:max-w-lg md:w-96"
      >
        Build with any AI
      </UiHeading>
      <div class="px-4 md:px-40">
        <UiText size="5" class="opacity-70">
          Describe the email you want. Your agent builds it with Vuemail.
        </UiText>
      </div>
    </div>
    <ul class="mx-auto grid w-fit grid-cols-3 gap-6 md:grid-cols-6 lg:gap-16">
      <li
        v-for="item in items"
        :key="item.title"
        class="flex flex-col items-center justify-center gap-3"
      >
        <button
          type="button"
          class="group flex cursor-pointer flex-col items-center justify-center gap-3 bg-transparent outline-hidden focus-visible:ring-1 focus-visible:ring-slate-7"
          @click="handleCopy(item)"
        >
          <HomeAiTile>
            <CheckIcon
              v-if="copiedTitle === item.title"
              class="size-8 text-green-11"
              aria-hidden="true"
            />
            <HomeAiIcon v-else :name="item.icon" />
          </HomeAiTile>
          <UiText
            size="3"
            class="relative z-4 grid opacity-90 font-[460] tracking-tight"
            aria-live="polite"
          >
            <span
              :class="[
                'text-gradient [grid-area:1/1]',
                copiedTitle === item.title && 'invisible',
              ]"
            >
              {{ item.title }}
            </span>
            <span
              :class="[
                'text-gradient [grid-area:1/1]',
                copiedTitle !== item.title && 'invisible',
              ]"
            >
              Copied
            </span>
          </UiText>
        </button>
      </li>
    </ul>
    <div
      class="relative z-4 mb-0 flex flex-wrap items-center justify-center gap-4"
    >
      <SiteCode
        language="bash"
        class="w-auto! max-w-full"
        code="npx skills add psycarlo/vuemail"
      />
      <UiButton as-child size="4" appearance="gradient">
        <SmartLink href="/docs/llms.txt">Docs for LLMs</SmartLink>
      </UiButton>
    </div>
    <HomeBackgroundImage
      class="pointer-events-none absolute sm:-translate-x-48 -top-20 z-3 scale-110 select-none mix-blend-lighten opacity-100"
    />
  </section>
</template>

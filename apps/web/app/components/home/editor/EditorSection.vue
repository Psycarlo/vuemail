<script setup lang="ts">
import { EmailEditor, type EmailEditorRef } from '@vuemail/editor';
import type { EditorThemeInput } from '@vuemail/editor/plugins';
import { ArrowRightIcon, SendHorizontalIcon, XIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import { homeEditorInitialContent } from '~/utils/home/editor';
import '@vuemail/editor/themes/default.css';
import './editor.css';

// The email HTML of what's in the editor, which is sent and shown next to it
const html = ref('');

const theme: EditorThemeInput = {
  extends: 'basic',
  styles: {
    paragraph: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
};

const updateHtml = async (emailEditor: EmailEditorRef) => {
  html.value = await emailEditor.getEmailHTML();
};
</script>

<template>
  <section class="relative py-20 md:py-10 md:pb-80 space-y-16 sm:space-y-24">
    <HomeBackgroundImage
      class="pointer-events-none absolute md:-translate-x-96 -top-40 z-3 select-none mix-blend-lighten"
      priority
    />
    <div class="space-y-6 pt-20">
      <UiHeading as="h2" size="8" weight="medium" class="text-white/80">
        Add an email editor <br />
        to your product
      </UiHeading>

      <UiText size="5" class="block max-w-100 text-balance opacity-70">
        Let your users write beautiful emails without leaving your product.
      </UiText>

      <div class="flex items-center gap-3">
        <UiButton as-child size="3">
          <SmartLink href="/docs/editor/overview">
            Check the docs
            <ArrowRightIcon :size="14" />
          </SmartLink>
        </UiButton>
        <UiButton as-child size="3" appearance="gradient">
          <NuxtLink to="/editor">See examples</NuxtLink>
        </UiButton>
      </div>
    </div>

    <div
      class="md:w-4/6 bg-white md:aspect-video z-20 relative border border-slate-4 grow rounded-2xl sm:rounded-3xl overflow-hidden [overflow-anchor:none] -order-1 md:order-0 flex flex-col"
    >
      <EmailEditor
        :content="homeEditorInitialContent"
        class="flex-1 overflow-auto px-6 w-full [&>div]:w-full [&_div]:outline-none"
        :theme="theme"
        @ready="updateHtml"
        @update="updateHtml"
      >
        <HomeEditorToolbar
          class="shrink-0 border-y border-gray-100 px-4 py-1"
        />
        <div
          class="absolute right-3 top-1.5 inline-flex items-center justify-center rounded p-1.5 text-gray-400"
        >
          <XIcon :size="14" />
        </div>

        <Send
          class="absolute right-3 bottom-3 gap-2 bg-transparent! px-4! py-2! h-auto! font-medium text-gray-400! hover:text-gray-600!"
          default-subject="Your editor is live"
          :markup="html"
        >
          Send
          <SendHorizontalIcon :size="14" />
        </Send>
      </EmailEditor>
    </div>

    <div
      class="absolute right-10 -mr-2 -top-50 h-full z-10 w-1/2 hidden md:block pointer-events-none"
    >
      <div
        class="w-dvw h-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_10%,black_20%,black_80%,transparent)]"
      >
        <SiteCodeBlock
          :code="html"
          code-class="text-xs opacity-50 scale-90"
          language="tsx"
          :is-gradient-line="false"
        />
      </div>
    </div>
  </section>
</template>

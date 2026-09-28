<script setup lang="ts">
import 'vuemail-editor/themes/default.css';
import '~/assets/css/editor-overrides.css';
import type { Component } from 'vue';

definePageMeta({
  validate: (route) =>
    editorExamples.some((example) => example.slug === route.params.slug),
});

const examples = import.meta.glob<Component>('../../editor-examples/*.vue', {
  import: 'default',
});
const sources = import.meta.glob<string>('../../editor-examples/*.vue', {
  query: '?raw',
  import: 'default',
});

const route = useRoute();
const slug = String(route.params.slug);
const example = editorExamples.find((example) => example.slug === slug)!;
const examplePath = `../../editor-examples/${slug}.vue`;

const Example = defineAsyncComponent(examples[examplePath]!);

useSeoMeta({
  title: `${example.subtitle ? `${example.heading} — ${example.subtitle.toLowerCase()}` : example.heading} — Editor examples`,
  description: example.pageDescription ?? example.description,
});

useHead({
  link: [{ rel: 'canonical', href: `https://vuemail.dev/editor/${slug}` }],
});

const sourceCode = await sources[examplePath]!();
</script>

<template>
  <EditorExamplePageShell
    :slug="slug"
    :heading="example.heading"
    :subtitle="example.subtitle"
    :docs-url="example.docsUrl"
    :source-code="sourceCode"
    :github-url="getEditorExampleGitHubUrl(slug)"
  >
    <Example />
  </EditorExamplePageShell>
</template>

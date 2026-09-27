<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDebouncedCallback } from '../composables/use-debounced-callback';
import { usePreviewContext } from '../composables/use-preview';
import { isStatic } from '../config';
import { cn } from '../utils/cn';
import JsonEditor from './json-editor.vue';

const { renderedEmailMetadata, previewPropsOverride, setPreviewPropsOverride } =
  usePreviewContext();

const renderedPropsJson = computed(() =>
  JSON.stringify(renderedEmailMetadata.value?.previewProps ?? {}, null, 2),
);

// The applied override is the source of truth for what renders; the draft
// only preserves the user's raw text, which can be momentarily invalid
// JSON or formatted differently than the applied value.
const draft = ref<string>();
const parseError = ref<string>();

const hasOverride = computed(() => previewPropsOverride.value !== undefined);

// Applying is debounced because every applied value costs a server render:
// per-keystroke applies would queue up behind each other.
const applyValue = useDebouncedCallback((newValue: string) => {
  try {
    const parsed = JSON.parse(newValue) as unknown;
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      parseError.value = 'Props must be a JSON object';
      return;
    }
    parseError.value = undefined;
    setPreviewPropsOverride(parsed as Record<string, unknown>);
  } catch (exception) {
    parseError.value = (exception as Error).message;
  }
}, 400);

const handleChange = (newValue: string) => {
  draft.value = newValue;
  applyValue(newValue);
};

const reset = () => {
  applyValue.cancel();
  draft.value = undefined;
  parseError.value = undefined;
  setPreviewPropsOverride(undefined);
};
</script>

<template>
  <div class="flex h-full flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <p v-if="isStatic" class="text-slate-11">
        Read-only. This preview was rendered at build time.
      </p>
      <button
        v-else
        :class="
          cn(
            'ml-auto shrink-0 rounded-md border border-slate-6 px-2 py-1 text-slate-11 transition-colors',
            'hover:border-slate-8 hover:text-slate-12',
            'disabled:opacity-40 disabled:hover:border-slate-6 disabled:hover:text-slate-11',
          )
        "
        :disabled="!hasOverride && draft === undefined"
        type="button"
        @click="reset"
      >
        Reset to defaults
      </button>
    </div>
    <JsonEditor
      :aria-invalid="parseError !== undefined"
      aria-label="Preview props JSON"
      :class="
        cn(parseError !== undefined && 'border-red-9 focus-within:border-red-9')
      "
      :disabled="isStatic"
      :value="draft ?? renderedPropsJson"
      @change="handleChange"
    />
    <p v-if="parseError !== undefined" class="pb-3 text-red-11">
      {{ parseError }}
    </p>
  </div>
</template>

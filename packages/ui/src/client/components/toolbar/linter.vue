<script setup lang="ts">
import { computed } from 'vue';
import type { ImageCheck, LinkCheck, LintingRow } from '../../../shared/types';
import IconWarning from '../../icons/icon-warning.vue';
import CodePreviewLineLink from './code-preview-line-link.vue';
import { prettyBytes, sanitize } from './format';
import Results from './results.vue';
import ResultsColumn from './results-column.vue';
import ResultsRow from './results-row.vue';

const props = defineProps<{
  rows: LintingRow[] | undefined;
}>();

const describeLinkCheck = (check: LinkCheck) => {
  if (check.type === 'security') {
    return 'Insecure URL, use HTTPS instead of HTTP';
  }
  if (check.type === 'syntax') {
    return 'The link is broken due to invalid syntax';
  }
  const statusCode = check.metadata.fetchStatusCode;
  if (statusCode === undefined) return 'The link could not be reached';
  if (statusCode >= 400) return 'The link is broken';
  if (statusCode >= 300) {
    return 'There was a redirect, the content may have been moved';
  }
  return undefined;
};

const describeImageCheck = (check: ImageCheck) => {
  switch (check.type) {
    case 'security':
      return 'Insecure URL, use HTTPS instead of HTTP';
    case 'syntax':
      return 'The image is broken due to an invalid source';
    case 'accessibility':
      return 'Missing alt text';
    case 'image_size':
      return check.metadata.byteCount
        ? 'This image is too large, keep it under 1mb'
        : undefined;
    case 'fetch_attempt': {
      const statusCode = check.metadata.fetchStatusCode;
      if (statusCode === undefined) return 'The image could not be reached';
      if (statusCode >= 400) return 'The image is broken';
      if (statusCode >= 300) {
        return 'There was a redirect, the image may have been moved';
      }
      return undefined;
    }
  }
};

const results = computed(() =>
  (props.rows ?? []).map((row) => {
    const metadata: string[] = [];
    for (const check of row.result.checks) {
      if (check.type === 'image_size' && check.metadata.byteCount) {
        metadata.push(prettyBytes(check.metadata.byteCount));
      }
      if (check.type === 'fetch_attempt' && check.metadata.fetchStatusCode) {
        metadata.push(`HTTP ${check.metadata.fetchStatusCode}`);
      }
    }

    if (row.source === 'link') {
      const failingCheck = row.result.checks.find(
        (check) => check.passed === false,
      )!;
      return {
        status: row.result.status,
        name: sanitize(failingCheck.type),
        description: describeLinkCheck(failingCheck),
        target: row.result.link,
        line: row.result.codeLocation.line,
        metadata,
      };
    }

    const failingCheck = row.result.checks.find(
      (check) => check.passed === false,
    )!;
    return {
      status: row.result.status,
      name: sanitize(failingCheck.type),
      description: describeImageCheck(failingCheck),
      target: row.result.source,
      line: row.result.codeLocation.line,
      metadata,
    };
  }),
);
</script>

<template>
  <Results v-if="rows !== undefined">
    <ResultsRow
      v-for="(result, i) in results"
      :key="i"
      :data-status="result.status"
      class="group/result"
    >
      <ResultsColumn>
        <span
          class="flex uppercase gap-2 items-center group-data-[status=error]/result:text-red-400 group-data-[status=warning]/result:text-orange-300"
        >
          <IconWarning />
          {{ result.name }}
        </span>
      </ResultsColumn>
      <ResultsColumn>
        {{ result.description }}<span class="ml-2 text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">{{ result.target }}</span>
      </ResultsColumn>
      <ResultsColumn align="right" class="font-mono text-slate-11">
        <template v-for="(item, index) in result.metadata" :key="index">{{ item }} · </template>
        <CodePreviewLineLink :line="result.line" />
      </ResultsColumn>
    </ResultsRow>
  </Results>
</template>

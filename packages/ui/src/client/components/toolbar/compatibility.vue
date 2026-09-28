<script setup lang="ts">
import { computed } from 'vue';
import { nicenames } from '../../../node/email-validation/caniemail-data';
import type {
  CompatibilityCheckingResult,
  EmailClient,
} from '../../../shared/types';
import IconWarning from '../../icons/icon-warning.vue';
import CodePreviewLineLink from './code-preview-line-link.vue';
import { sanitize } from './format';
import Results from './results.vue';
import ResultsColumn from './results-column.vue';
import ResultsRow from './results-row.vue';

const props = defineProps<{
  results: CompatibilityCheckingResult[] | undefined;
}>();

const rows = computed(() =>
  (props.results ?? []).map((result) => {
    const statsReportedNotWorking = Object.entries(
      result.statsPerEmailClient,
    ).filter(([, stats]) => stats?.status === 'error');
    const unsupportedClientsString = statsReportedNotWorking
      .map(([emailClient]) => nicenames.family[emailClient as EmailClient])
      .join(', ');

    return {
      title: sanitize(result.entry.title),
      description:
        statsReportedNotWorking.length > 0
          ? `Not supported in ${unsupportedClientsString}`
          : '',
      url: result.entry.url,
      line: result.location.start.line,
    };
  }),
);
</script>

<template>
  <Results>
    <ResultsRow v-for="(row, i) in rows" :key="i">
      <ResultsColumn>
        <span class="flex text-red-400 uppercase gap-2 items-center">
          <IconWarning />
          {{ row.title }}
        </span>
      </ResultsColumn>
      <ResultsColumn>
        {{ row.description }}<a :href="row.url" class="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors hover:text-slate-12" rel="noreferrer" target="_blank">More ↗</a>
      </ResultsColumn>
      <ResultsColumn class="font-mono text-slate-11 text-right">
        <CodePreviewLineLink :line="row.line" type="source" />
      </ResultsColumn>
    </ResultsRow>
  </Results>
</template>

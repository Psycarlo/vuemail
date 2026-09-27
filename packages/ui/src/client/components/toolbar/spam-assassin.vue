<script setup lang="ts">
import { computed } from 'vue';
import type { SpamCheckingResult } from '../../../shared/types';
import IconWarning from '../../icons/icon-warning.vue';
import { cn } from '../../utils/cn';
import { sanitize } from './format';
import Results from './results.vue';
import ResultsColumn from './results-column.vue';
import ResultsRow from './results-row.vue';

const props = defineProps<{
  result: SpamCheckingResult | undefined;
}>();

const getScoreColor = (points: number, mediumColor: string) =>
  cn(
    points === 0 ? 'text-green-400' : null,
    points > 1.5 ? mediumColor : null,
    points > 3 ? 'text-orange-400' : null,
    points >= 5 ? 'text-red-400' : null,
  );

const getCheckColor = (points: number) =>
  cn(
    points > 1 ? 'text-yellow-200' : null,
    points > 2 ? 'text-orange-400' : null,
    points > 3 ? 'text-red-400' : null,
  );

const sortedChecks = computed(() =>
  [...(props.result?.checks ?? [])].sort((a, b) => b.points - a.points),
);
</script>

<template>
  <Results v-if="result">
    <ResultsRow class="sticky border-b top-0">
      <ResultsColumn class="uppercase">
        <span class="flex gap-2 items-center">
          <IconWarning :class="getScoreColor(result.points, 'text-yellow-100')" />
          Score
        </span>
      </ResultsColumn>
      <ResultsColumn>
        {{
          result.points === 0
            ? 'Congratulations! Your email is clean of abuse indicators.'
            : 'Higher scores are better'
        }}
      </ResultsColumn>
      <ResultsColumn class="text-right tracking-tighter font-bold">
        <span :class="cn('text-3xl', getScoreColor(result.points, 'text-yellow-200'))">{{ (10 - result.points).toFixed(1) }}</span> <span class="text-lg">/ 10</span>
      </ResultsColumn>
    </ResultsRow>
    <ResultsRow v-for="check in sortedChecks" :key="check.name">
      <ResultsColumn class="uppercase">
        <span class="flex gap-2 items-center">
          <IconWarning :class="getCheckColor(check.points)" />
          {{ sanitize(check.name) }}
        </span>
      </ResultsColumn>
      <ResultsColumn>{{ check.description }}</ResultsColumn>
      <ResultsColumn
        :class="
          cn('text-right font-mono tracking-tighter', getCheckColor(check.points))
        "
      >
        -{{ check.points.toFixed(1) }}
      </ResultsColumn>
    </ResultsRow>
  </Results>
</template>

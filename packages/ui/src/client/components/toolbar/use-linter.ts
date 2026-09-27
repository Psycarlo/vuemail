import { type MaybeRefOrGetter, ref, toValue } from 'vue';
import { toast } from 'vue-sonner';
import type { LintingRow } from '../../../shared/types';
import { lintEmail } from './toolbar-api';

export const useLinter = ({
  slug,
  markup,

  initialRows,
}: {
  slug: string;
  markup: MaybeRefOrGetter<string>;

  initialRows?: LintingRow[];
}) => {
  const rows = ref<LintingRow[] | undefined>(initialRows);

  const loading = ref(false);
  let isLoading = false;

  /** Lints the current markup, resolving with the rows unless it fails. */
  const load = async () => {
    if (isLoading) return;
    isLoading = true;
    loading.value = true;

    try {
      const newRows = await lintEmail(slug, toValue(markup));
      rows.value = newRows;
      return newRows;
    } catch (exception) {
      console.error(exception);
      toast.error(
        exception instanceof Error ? exception.message : String(exception),
      );
    } finally {
      loading.value = false;
      isLoading = false;
    }
  };

  return { rows, loading, load };
};

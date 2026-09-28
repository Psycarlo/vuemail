import { ref } from 'vue';
import { toast } from 'vue-sonner';
import type { CompatibilityCheckingResult } from '../../../shared/types';
import { checkEmailCompatibility } from './toolbar-api';

export const useCompatibility = ({
  slug,

  initialResults,
}: {
  slug: string;

  initialResults?: CompatibilityCheckingResult[];
}) => {
  const results = ref(initialResults);

  const loading = ref(false);
  let isLoading = false;

  /** Checks the email, resolving with the results unless it fails. */
  const load = async () => {
    if (isLoading) return;
    isLoading = true;
    loading.value = true;

    try {
      const newResults = (await checkEmailCompatibility(slug)).filter(
        (result) => result.status === 'error',
      );
      results.value = newResults;
      return newResults;
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

  return { results, loading, load };
};

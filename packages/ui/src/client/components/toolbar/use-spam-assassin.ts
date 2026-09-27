import { type MaybeRefOrGetter, ref, toValue } from 'vue';
import { toast } from 'vue-sonner';
import type { SpamCheckingResult } from '../../../shared/types';
import { checkSpam } from './toolbar-api';

export const useSpamAssassin = ({
  slug,
  markup,
  plainText,

  initialResult,
}: {
  slug: string;
  markup: MaybeRefOrGetter<string>;
  plainText: MaybeRefOrGetter<string>;

  initialResult?: SpamCheckingResult;
}) => {
  const result = ref<SpamCheckingResult | undefined>(initialResult);

  const loading = ref(false);
  let isLoading = false;

  /** Scores the current markup, resolving with the result unless it fails. */
  const load = async () => {
    if (isLoading) return;
    isLoading = true;
    loading.value = true;

    try {
      const responseBody = await checkSpam(
        slug,
        toValue(markup),
        toValue(plainText),
      );
      if (responseBody === undefined) return;
      if ('error' in responseBody) {
        toast.error(responseBody.error);
      } else {
        result.value = responseBody;
        return responseBody;
      }
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

  return { result, loading, load };
};
